package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.UploadResult;
import com.purav.coursemaketplace.dto.response.CourseMaterialResponse;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.CourseMaterial;
import com.purav.coursemaketplace.entity.MaterialType;
import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.CourseMaterialRepository;
import com.purav.coursemaketplace.repository.CourseRepository;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import com.purav.coursemaketplace.util.CryptoUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseMaterialService {

    private final CourseMaterialRepository courseMaterialRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;
    private final EnrollmentRepository enrollmentRepository;

    public CourseMaterialService(CourseMaterialRepository courseMaterialRepository,
                                 CourseRepository courseRepository,
                                 FileStorageService fileStorageService,
                                 EnrollmentRepository enrollmentRepository) {
        this.courseMaterialRepository = courseMaterialRepository;
        this.courseRepository = courseRepository;
        this.fileStorageService = fileStorageService;
        this.enrollmentRepository = enrollmentRepository;
    }

    public CourseMaterialResponse uploadMaterial(Long courseId, String title, MaterialType type, MultipartFile file, User instructor) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You are not authorized to add materials to this course");
        }

        // 150 MB Course Limit Validation
        long currentTotalSize = courseMaterialRepository.sumFileSizeByCourseId(courseId);
        long newFileSize = file.getSize();
        long limit = 150L * 1024 * 1024; // 150 MB in bytes

        if (currentTotalSize + newFileSize > limit) {
            throw new RuntimeException("Upload failed: Adding this file (" + String.format("%.2f", newFileSize / (1024.0 * 1024.0)) + " MB) will exceed the 150 MB course storage limit. Current usage: " + String.format("%.2f", currentTotalSize / (1024.0 * 1024.0)) + " MB.");
        }

        // Store the actual file physically / on Cloudinary
        UploadResult uploadResult = fileStorageService.storeFile(file, courseId);

        // Save reference in MySQL
        CourseMaterial material = CourseMaterial.builder()
                .title(title)
                .type(type)
                .fileUrl(uploadResult.getUrl())
                .fileSize(newFileSize)
                .publicId(uploadResult.getPublicId())
                .encryptionKey(uploadResult.getEncryptionKey())
                .encryptionIv(uploadResult.getEncryptionIv())
                .course(course)
                .build();

        CourseMaterial savedMaterial = courseMaterialRepository.save(material);
        
        return mapToResponse(savedMaterial);
    }

    public void deleteMaterial(Long materialId, User instructor) {
        CourseMaterial material = courseMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (!material.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You are not authorized to delete this material");
        }

        // Physically delete the file from Cloudinary or local storage
        String deleteId = material.getPublicId() != null ? material.getPublicId() : material.getFileUrl();
        fileStorageService.deleteFile(deleteId, material.getType());
        
        // Remove from MySQL
        courseMaterialRepository.delete(material);
    }

    public List<CourseMaterialResponse> getCourseMaterials(Long courseId, User currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (currentUser.getRole() == Role.ROLE_LEARNER) {
            boolean isEnrolled = enrollmentRepository.existsByUserAndCourse(currentUser, course);
            if (!isEnrolled) {
                throw new RuntimeException("Access denied! You must enroll in the course to view materials.");
            }
        } else if (currentUser.getRole() == Role.ROLE_INSTRUCTOR) {
            if (!course.getInstructor().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied! You are not the instructor of this course.");
            }
        }

        return courseMaterialRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public com.purav.coursemaketplace.dto.DecryptedResourceResult getDecryptedMaterial(Long materialId, User currentUser) {
        CourseMaterial material = courseMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        Course course = material.getCourse();
        if (currentUser.getRole() == Role.ROLE_LEARNER) {
            boolean isEnrolled = enrollmentRepository.existsByUserAndCourse(currentUser, course);
            if (!isEnrolled) {
                throw new RuntimeException("Access denied! You must enroll in the course to access this material.");
            }
        } else if (currentUser.getRole() == Role.ROLE_INSTRUCTOR) {
            if (!course.getInstructor().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied! You are not the instructor of this course.");
            }
        }

        String encKey = material.getEncryptionKey();
        String encIv = material.getEncryptionIv();

        // Fallback for legacy unencrypted uploads
        if (encKey == null || encKey.isEmpty() || encIv == null || encIv.isEmpty()) {
            if (material.getFileUrl().startsWith("/uploads/")) {
                Path path = Paths.get(material.getFileUrl().substring(1));
                return com.purav.coursemaketplace.dto.DecryptedResourceResult.builder()
                        .resource(new FileSystemResource(path.toFile()))
                        .filename(path.getFileName().toString())
                        .contentType(probeContentType(path))
                        .fileSize(material.getFileSize())
                        .build();
            } else {
                try {
                    Path tempFile = Files.createTempFile("legacy-download-", ".tmp");
                    downloadFile(material.getFileUrl(), tempFile);
                    return com.purav.coursemaketplace.dto.DecryptedResourceResult.builder()
                            .resource(new FileSystemResource(tempFile.toFile()) {
                                @Override
                                public InputStream getInputStream() throws IOException {
                                    return new FileInputStream(getFile()) {
                                        @Override
                                        public void close() throws IOException {
                                            super.close();
                                            Files.deleteIfExists(tempFile);
                                        }
                                    };
                                }
                            })
                            .filename(getFilenameFromUrl(material.getFileUrl()))
                            .contentType(probeContentType(tempFile))
                            .fileSize(material.getFileSize())
                            .build();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to load legacy unencrypted material", e);
                }
            }
        }

        // Handle AES decryption for encrypted files
        try {
            Path tempEncrypted = Files.createTempFile("encrypted-material-", ".tmp");
            Path tempDecrypted = Files.createTempFile("decrypted-material-", ".tmp");

            // 1. Download/Copy the encrypted file
            if (material.getFileUrl().startsWith("/uploads/")) {
                Path localPath = Paths.get(material.getFileUrl().substring(1));
                Files.copy(localPath, tempEncrypted, StandardCopyOption.REPLACE_EXISTING);
            } else {
                downloadFile(material.getFileUrl(), tempEncrypted);
            }

            // 2. Decrypt it stream-wise
            javax.crypto.SecretKey key = CryptoUtils.getKeyFromBytes(Base64.getDecoder().decode(encKey));
            byte[] iv = Base64.getDecoder().decode(encIv);
            try (InputStream is = Files.newInputStream(tempEncrypted);
                 OutputStream os = Files.newOutputStream(tempDecrypted)) {
                CryptoUtils.decryptStream(is, os, key, iv);
            }

            // 3. Setup FileSystemResource with auto cleanup on stream close
            String filename = material.getFileUrl().substring(material.getFileUrl().lastIndexOf("/") + 1);
            if (filename.contains("_")) {
                filename = filename.substring(filename.indexOf("_") + 1);
            }

            final Path toDeleteEnc = tempEncrypted;
            final Path toDeleteDec = tempDecrypted;

            FileSystemResource resource = new FileSystemResource(tempDecrypted.toFile()) {
                @Override
                public InputStream getInputStream() throws IOException {
                    return new FileInputStream(getFile()) {
                        @Override
                        public void close() throws IOException {
                            super.close();
                            try {
                                Files.deleteIfExists(toDeleteDec);
                                Files.deleteIfExists(toDeleteEnc);
                            } catch (IOException e) {
                                System.err.println("Failed to clean up temp files: " + e.getMessage());
                            }
                        }
                    };
                }
            };

            return com.purav.coursemaketplace.dto.DecryptedResourceResult.builder()
                    .resource(resource)
                    .filename(filename)
                    .contentType(probeContentType(tempDecrypted))
                    .fileSize(Files.size(tempDecrypted))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error during decryption processing", e);
        }
    }

    private void downloadFile(String fileUrl, Path targetPath) throws IOException {
        java.net.URL url = new java.net.URL(fileUrl);
        java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        try (InputStream is = connection.getInputStream()) {
            Files.copy(is, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private String probeContentType(Path path) {
        try {
            String type = Files.probeContentType(path);
            return type != null ? type : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }

    private String getFilenameFromUrl(String url) {
        if (url == null || url.isEmpty()) return "file";
        int lastSlash = url.lastIndexOf('/');
        if (lastSlash != -1 && lastSlash < url.length() - 1) {
            return url.substring(lastSlash + 1);
        }
        return "file";
    }

    private CourseMaterialResponse mapToResponse(CourseMaterial material) {
        return CourseMaterialResponse.builder()
                .id(material.getId())
                .title(material.getTitle())
                .type(material.getType())
                .fileUrl(material.getFileUrl())
                .courseId(material.getCourse().getId())
                .build();
    }
}
