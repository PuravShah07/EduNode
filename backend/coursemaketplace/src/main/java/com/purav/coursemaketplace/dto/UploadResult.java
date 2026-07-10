package com.purav.coursemaketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UploadResult {
    private final String url;
    private final String publicId;
    private final String encryptionKey;
    private final String encryptionIv;
}
