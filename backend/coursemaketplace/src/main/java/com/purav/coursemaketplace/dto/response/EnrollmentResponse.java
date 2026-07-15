package com.purav.coursemaketplace.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EnrollmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String instructorName;
    private LocalDateTime enrolledAt;
    private Integer rating;
    private Boolean completed;
    private Integer progress;
}
