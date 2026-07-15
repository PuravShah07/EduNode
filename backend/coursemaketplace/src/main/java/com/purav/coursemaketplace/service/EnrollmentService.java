package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.response.EnrollmentResponse;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.Enrollment;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.CourseRepository;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public EnrollmentResponse enrollInCourse(Long courseId, User student) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new com.purav.coursemaketplace.exception.ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.existsByUserAndCourse(student, course)) {
            throw new com.purav.coursemaketplace.exception.BadRequestException("You are already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .user(student)
                .course(course)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToResponse(savedEnrollment);
    }

    public List<EnrollmentResponse> getMyCourses(User student) {
        return enrollmentRepository.findByUser(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EnrollmentResponse updateProgress(Long enrollmentId, Integer progress, Boolean completed, User student) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new com.purav.coursemaketplace.exception.ResourceNotFoundException("Enrollment not found"));

        if (!enrollment.getUser().getId().equals(student.getId())) {
            throw new com.purav.coursemaketplace.exception.BadRequestException("You do not own this enrollment");
        }

        if (progress != null) {
            if (progress < 0 || progress > 100) {
                throw new com.purav.coursemaketplace.exception.BadRequestException("Progress must be between 0 and 100");
            }
            enrollment.setProgress(progress);
        }
        if (completed != null) {
            enrollment.setCompleted(completed);
            if (completed && (progress == null || progress < 100)) {
                enrollment.setProgress(100);
            }
        }

        Enrollment updated = enrollmentRepository.save(enrollment);
        return mapToResponse(updated);
    }

    public EnrollmentResponse updateRating(Long enrollmentId, Integer rating, User student) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new com.purav.coursemaketplace.exception.ResourceNotFoundException("Enrollment not found"));

        if (!enrollment.getUser().getId().equals(student.getId())) {
            throw new com.purav.coursemaketplace.exception.BadRequestException("You do not own this enrollment");
        }

        if (rating != null) {
            if (rating < 1 || rating > 5) {
                throw new com.purav.coursemaketplace.exception.BadRequestException("Rating must be between 1 and 5");
            }
            enrollment.setRating(rating);
        }

        Enrollment updated = enrollmentRepository.save(enrollment);
        return mapToResponse(updated);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .instructorName(enrollment.getCourse().getInstructor().getName())
                .enrolledAt(enrollment.getEnrolledAt())
                .rating(enrollment.getRating())
                .completed(enrollment.getCompleted())
                .progress(enrollment.getProgress())
                .build();
    }
}
