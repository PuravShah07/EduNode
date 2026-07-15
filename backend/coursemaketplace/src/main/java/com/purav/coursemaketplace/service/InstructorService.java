package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.response.InstructorDashboardResponse;
import com.purav.coursemaketplace.dto.response.RecentActivityDto;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.Enrollment;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.CourseRepository;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstructorService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public InstructorService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public InstructorDashboardResponse getDashboardStats(User instructor) {
        List<Course> courses = courseRepository.findByInstructor(instructor);
        List<Enrollment> enrollments = enrollmentRepository.findByCourseInstructor(instructor);

        long totalCourses = courses.size();
        long activeEnrollments = enrollments.size();

        long totalStudents = enrollments.stream()
                .map(e -> e.getUser().getId())
                .distinct()
                .count();

        BigDecimal totalRevenue = enrollments.stream()
                .map(e -> e.getCourse().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Monthly revenue (current month)
        LocalDateTime firstDayOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        BigDecimal monthlyRevenue = enrollments.stream()
                .filter(e -> e.getEnrolledAt() != null && e.getEnrolledAt().isAfter(firstDayOfMonth))
                .map(e -> e.getCourse().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Average Rating
        List<Enrollment> ratedEnrollments = enrollments.stream()
                .filter(e -> e.getRating() != null && e.getRating() > 0)
                .collect(Collectors.toList());
        double averageCourseRating = ratedEnrollments.isEmpty() ? 0.0 :
                ratedEnrollments.stream().mapToInt(Enrollment::getRating).average().orElse(0.0);

        // Completion Rate
        double courseCompletionRate = enrollments.isEmpty() ? 0.0 :
                (double) enrollments.stream().filter(e -> Boolean.TRUE.equals(e.getCompleted())).count() / enrollments.size() * 100.0;

        // Recent activities: Combine course creation and enrollments
        List<RecentActivityDto> activities = new ArrayList<>();

        // Enrolled events
        for (Enrollment e : enrollments) {
            activities.add(RecentActivityDto.builder()
                    .type("ENROLLMENT")
                    .message(e.getUser().getName() + " enrolled in " + e.getCourse().getTitle())
                    .timestamp(e.getEnrolledAt() != null ? e.getEnrolledAt() : LocalDateTime.now())
                    .build());
        }

        // Created course events
        for (Course c : courses) {
            activities.add(RecentActivityDto.builder()
                    .type("COURSE_CREATED")
                    .message("Created course " + c.getTitle())
                    .timestamp(c.getCreatedAt() != null ? c.getCreatedAt() : LocalDateTime.now())
                    .build());
        }

        // Ratings events
        for (Enrollment e : ratedEnrollments) {
            activities.add(RecentActivityDto.builder()
                    .type("RATING")
                    .message(e.getUser().getName() + " rated " + e.getCourse().getTitle() + " " + e.getRating() + " stars")
                    .timestamp(e.getEnrolledAt() != null ? e.getEnrolledAt().plusMinutes(2) : LocalDateTime.now()) // Slightly offset to distinguish
                    .build());
        }

        // Sort by timestamp desc and limit to 10
        List<RecentActivityDto> recentActivities = activities.stream()
                .sorted(Comparator.comparing(RecentActivityDto::getTimestamp).reversed())
                .limit(10)
                .collect(Collectors.toList());

        List<InstructorDashboardResponse.CourseStatDto> courseStats = new ArrayList<>();
        for (Course course : courses) {
            List<Enrollment> courseEnrollmentsList = enrollments.stream()
                    .filter(e -> e.getCourse().getId().equals(course.getId()))
                    .collect(Collectors.toList());

            long courseEnrollmentsCount = courseEnrollmentsList.size();
            BigDecimal courseRevenue = course.getPrice().multiply(new BigDecimal(courseEnrollmentsCount));

            List<Enrollment> courseRatedEnrollments = courseEnrollmentsList.stream()
                    .filter(e -> e.getRating() != null && e.getRating() > 0)
                    .collect(Collectors.toList());
            double courseAverageRating = courseRatedEnrollments.isEmpty() ? 0.0 :
                    courseRatedEnrollments.stream().mapToInt(Enrollment::getRating).average().orElse(0.0);

            courseStats.add(InstructorDashboardResponse.CourseStatDto.builder()
                    .title(course.getTitle())
                    .enrollments(courseEnrollmentsCount)
                    .revenue(courseRevenue)
                    .averageRating(courseAverageRating)
                    .build());
        }

        return InstructorDashboardResponse.builder()
                .totalCourses(totalCourses)
                .totalStudents(totalStudents)
                .activeEnrollments(activeEnrollments)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .averageCourseRating(averageCourseRating)
                .courseCompletionRate(courseCompletionRate)
                .recentActivity(recentActivities)
                .courseStats(courseStats)
                .build();
    }
}
