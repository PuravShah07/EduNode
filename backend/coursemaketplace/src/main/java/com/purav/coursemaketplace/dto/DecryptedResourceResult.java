package com.purav.coursemaketplace.dto;

import org.springframework.core.io.Resource;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DecryptedResourceResult {
    private final Resource resource;
    private final String filename;
    private final String contentType;
    private final long fileSize;
}
