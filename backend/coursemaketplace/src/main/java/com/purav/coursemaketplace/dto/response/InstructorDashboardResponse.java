package com.purav.coursemaketplace.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class InstructorDashboardResponse {
    private long totalCourses;
    private long totalStudents;
    private long activeEnrollments;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private double averageCourseRating;
    private double courseCompletionRate;
    private List<RecentActivityDto> recentActivity;
    private List<CourseStatDto> courseStats;

    @Getter
    @Setter
    @Builder
    public static class CourseStatDto {
        private String title;
        private long enrollments;
        private BigDecimal revenue;
        private double averageRating;
    }
}
