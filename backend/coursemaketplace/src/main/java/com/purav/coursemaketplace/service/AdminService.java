package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.response.AdminEnrollmentResponse;
import com.purav.coursemaketplace.dto.response.UserProfileDto;
import com.purav.coursemaketplace.entity.Enrollment;
import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import com.purav.coursemaketplace.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminService(UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Page<UserProfileDto> getUsersByRole(Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable)
                .map(this::mapToUserProfileDto);
    }

    public Page<AdminEnrollmentResponse> getAllEnrollments(Pageable pageable) {
        // Will use the @EntityGraph to do this in exactly ONE optimized database query
        return enrollmentRepository.findAll(pageable)
                .map(this::mapToAdminEnrollmentResponse);
    }

    private UserProfileDto mapToUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private AdminEnrollmentResponse mapToAdminEnrollmentResponse(Enrollment enrollment) {
        return AdminEnrollmentResponse.builder()
                .enrollmentId(enrollment.getId())
                .learnerName(enrollment.getUser().getName())
                .learnerEmail(enrollment.getUser().getEmail())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .coursePrice(enrollment.getCourse().getPrice())
                .instructorName(enrollment.getCourse().getInstructor().getName())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}
