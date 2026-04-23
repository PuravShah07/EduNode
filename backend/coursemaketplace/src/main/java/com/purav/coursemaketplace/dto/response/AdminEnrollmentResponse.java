package com.purav.coursemaketplace.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AdminEnrollmentResponse {
    private Long enrollmentId;
    private String learnerName;
    private String learnerEmail;
    private Long courseId;
    private String courseTitle;
    private BigDecimal coursePrice;
    private String instructorName;
    private LocalDateTime enrolledAt;
}
