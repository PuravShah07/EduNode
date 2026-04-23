package com.purav.coursemaketplace.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final String uploadDirPath = "uploads";

    public LocalFileStorageServiceImpl() {
        try {
            Path dir = Paths.get(uploadDirPath);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload directory!", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, Long courseId) throws IOException {
        // Clean off any unexpected sequence in original filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown.file");
        
        // Ensure name is absolutely unique
        String newFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        // Group files by course ID into sub-folders
        Path courseFolder = Paths.get(uploadDirPath, String.valueOf(courseId));
        if (!Files.exists(courseFolder)) {
            Files.createDirectories(courseFolder);
        }

        // Copy file
        Path targetLocation = courseFolder.resolve(newFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Return the pseudo-URL for the DB
        return "/uploads/" + courseId + "/" + newFilename;
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl != null && fileUrl.startsWith("/uploads/")) {
            try {
                // remove leading slash to resolve to correct relative directory
                Path filePath = Paths.get(fileUrl.substring(1)); 
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not delete file locally: " + fileUrl, e);
            }
        }
    }
}
