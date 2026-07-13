package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.UploadResult;
import com.purav.coursemaketplace.entity.MaterialType;
import com.purav.coursemaketplace.util.CryptoUtils;
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

        // Clean off any unexpected sequence in original filename
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        int dotIndex = originalFilename.lastIndexOf('.');
        String extension = dotIndex == -1 ? "" : originalFilename.substring(dotIndex + 1).toLowerCase();
        
        // Ensure name is absolutely unique and contains no user input
        String newFilename = UUID.randomUUID().toString() + (extension.isEmpty() ? "" : "." + extension);

        // Group files by course ID into sub-folders
        Path courseFolder = Paths.get(uploadDirPath, String.valueOf(courseId));
        if (!Files.exists(courseFolder)) {
            Files.createDirectories(courseFolder);
        }

        // Copy encrypted file
        Path targetLocation = courseFolder.resolve(newFilename);
        try (InputStream is = file.getInputStream();
             OutputStream os = Files.newOutputStream(targetLocation)) {
            CryptoUtils.encryptStream(is, os, secretKey, iv);
        } catch (Exception e) {
            throw new IOException("Encryption error during local file upload", e);
        }

        // Return the pseudo-URL for the DB (using the URL as both URL and public ID)
        String url = "/uploads/" + courseId + "/" + newFilename;
        return new UploadResult(url, url, encKeyStr, encIvStr);
    }

    @Override
    public void deleteFile(String publicId, MaterialType materialType) {
        if (publicId != null && publicId.startsWith("/uploads/")) {
            try {
                // remove leading slash to resolve to correct relative directory
                Path filePath = Paths.get(publicId.substring(1)); 
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not delete file locally: " + publicId, e);
            }
        }
    }
}
