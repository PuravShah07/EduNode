package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.CourseMaterialResponse;
import com.purav.coursemaketplace.entity.MaterialType;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.service.CourseMaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseMaterialController {

    private final CourseMaterialService courseMaterialService;

    public CourseMaterialController(CourseMaterialService courseMaterialService) {
        this.courseMaterialService = courseMaterialService;
    }

    @PostMapping("/{courseId}/materials")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseMaterialResponse> uploadMaterial(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("type") MaterialType type,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User instructor) {
        
        try {
            CourseMaterialResponse response = courseMaterialService.uploadMaterial(courseId, title, type, file, instructor);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/materials/{materialId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> deleteMaterial(
            @PathVariable Long materialId,
            @AuthenticationPrincipal User instructor) {
        
        courseMaterialService.deleteMaterial(materialId, instructor);
        return ResponseEntity.ok("Material deleted successfully");
    }

    @GetMapping("/{courseId}/materials")
    public ResponseEntity<List<CourseMaterialResponse>> getCourseMaterials(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(courseMaterialService.getCourseMaterials(courseId, currentUser));
    }
}
