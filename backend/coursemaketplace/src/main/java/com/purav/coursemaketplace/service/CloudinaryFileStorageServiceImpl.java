package com.purav.coursemaketplace.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.purav.coursemaketplace.dto.UploadResult;
import com.purav.coursemaketplace.entity.MaterialType;
import com.purav.coursemaketplace.util.CryptoUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@Primary
public class CloudinaryFileStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;
    private final String uploadDirPath = "uploads";

    public CloudinaryFileStorageServiceImpl(java.util.Optional<Cloudinary> cloudinary) {
        this.cloudinary = cloudinary.orElse(null);
        try {
            Path dir = Paths.get(uploadDirPath);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
        } catch (IOException e) {
            System.err.println("Could not initialize fallback local upload directory: " + e.getMessage());
        }
    }

    @Override
    public UploadResult storeFile(MultipartFile file, Long courseId) throws IOException {
        // Generate encryption key and IV
        SecretKey secretKey;
        byte[] iv;
        try {
            secretKey = CryptoUtils.generateKey();
            iv = CryptoUtils.generateIv();
        } catch (Exception e) {
            throw new RuntimeException("Could not generate encryption key", e);
        }
        String encKeyStr = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        String encIvStr = Base64.getEncoder().encodeToString(iv);

        if (cloudinary == null) {
            // Local fallback logic
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown.file");
            String newFilename = UUID.randomUUID().toString() + "_" + originalFilename;
            Path courseFolder = Paths.get(uploadDirPath, String.valueOf(courseId));
            if (!Files.exists(courseFolder)) {
                Files.createDirectories(courseFolder);
            }
            Path targetLocation = courseFolder.resolve(newFilename);
            
            // Encrypt and store locally
            try (InputStream is = file.getInputStream();
                 OutputStream os = Files.newOutputStream(targetLocation)) {
                CryptoUtils.encryptStream(is, os, secretKey, iv);
            } catch (Exception e) {
                throw new IOException("Encryption error during local upload fallback", e);
            }

            String url = "/uploads/" + courseId + "/" + newFilename;
            return new UploadResult(url, url, encKeyStr, encIvStr);
        }

        // Cloudinary upload
        Path tempEncryptedFile = Files.createTempFile("upload-enc-", ".tmp");
        try {
            // Encrypt the stream to a temporary file
            try (InputStream is = file.getInputStream();
                 OutputStream os = Files.newOutputStream(tempEncryptedFile)) {
                CryptoUtils.encryptStream(is, os, secretKey, iv);
            } catch (Exception e) {
                throw new IOException("Encryption error during Cloudinary upload", e);
            }

            Map uploadParams = ObjectUtils.asMap(
                    "resource_type", "raw", // Saved as raw since it is encrypted binary data
                    "folder", "courses/" + courseId
            );
            Map uploadResult = cloudinary.uploader().upload(tempEncryptedFile.toFile(), uploadParams);
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            return new UploadResult(url, publicId, encKeyStr, encIvStr);
        } finally {
            Files.deleteIfExists(tempEncryptedFile);
        }
    }

    @Override
    public void deleteFile(String publicId, MaterialType materialType) {
        if (publicId == null) {
            return;
        }

        // If it starts with /uploads/, it's a local file from fallback or old record
        if (publicId.startsWith("/uploads/")) {
            try {
                Path filePath = Paths.get(publicId.substring(1));
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Could not delete local file: " + publicId);
            }
            return;
        }

        if (cloudinary == null) {
            return;
        }

        try {
            // Since files are encrypted, they are uploaded as "raw"
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file from Cloudinary: " + publicId, e);
        }
    }
}
