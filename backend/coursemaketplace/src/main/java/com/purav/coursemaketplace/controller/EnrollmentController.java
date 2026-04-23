package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.EnrollmentResponse;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/courses/{courseId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User student) {
        
        EnrollmentResponse response = enrollmentService.enrollInCourse(courseId, student);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<List<EnrollmentResponse>> getMyCourses(
            @AuthenticationPrincipal User student) {
        
        return ResponseEntity.ok(enrollmentService.getMyCourses(student));
    }
}
