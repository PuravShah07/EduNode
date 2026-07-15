package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.InstructorDashboardResponse;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.service.InstructorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses/instructor/dashboard")
public class InstructorDashboardController {

    private final InstructorService instructorService;

    public InstructorDashboardController(InstructorService instructorService) {
        this.instructorService = instructorService;
    }

    @GetMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorDashboardResponse> getDashboardStats(
            @AuthenticationPrincipal User instructor) {
        return ResponseEntity.ok(instructorService.getDashboardStats(instructor));
    }
}
