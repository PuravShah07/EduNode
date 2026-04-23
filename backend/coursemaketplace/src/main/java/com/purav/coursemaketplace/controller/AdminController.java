package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.AdminEnrollmentResponse;
import com.purav.coursemaketplace.dto.response.UserProfileDto;
import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/instructors")
    public ResponseEntity<Page<UserProfileDto>> getAllInstructors(Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsersByRole(Role.ROLE_INSTRUCTOR, pageable));
    }

    @GetMapping("/learners")
    public ResponseEntity<Page<UserProfileDto>> getAllLearners(Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsersByRole(Role.ROLE_LEARNER, pageable));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<Page<AdminEnrollmentResponse>> getAllEnrollments(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllEnrollments(pageable));
    }
}
