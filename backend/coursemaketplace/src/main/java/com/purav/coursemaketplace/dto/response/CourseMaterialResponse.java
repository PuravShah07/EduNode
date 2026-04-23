package com.purav.coursemaketplace.dto.response;

import com.purav.coursemaketplace.entity.MaterialType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseMaterialResponse {
    private Long id;
    private String title;
    private MaterialType type;
    private String fileUrl;
    private Long courseId;
}
