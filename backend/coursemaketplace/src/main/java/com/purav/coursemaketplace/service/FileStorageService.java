package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.UploadResult;
import com.purav.coursemaketplace.entity.MaterialType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    UploadResult storeFile(MultipartFile file, Long courseId) throws IOException;
    void deleteFile(String publicId, MaterialType materialType);
}
