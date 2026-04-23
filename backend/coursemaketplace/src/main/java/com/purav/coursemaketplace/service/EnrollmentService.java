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

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .instructorName(enrollment.getCourse().getInstructor().getName())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}
