package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.response.CourseMaterialResponse;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.CourseMaterial;
import com.purav.coursemaketplace.entity.MaterialType;
import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.CourseMaterialRepository;
import com.purav.coursemaketplace.repository.CourseRepository;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseMaterialService {

    private final CourseMaterialRepository courseMaterialRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;
    private final EnrollmentRepository enrollmentRepository;

    public CourseMaterialService(CourseMaterialRepository courseMaterialRepository,
                                 CourseRepository courseRepository,
                                 FileStorageService fileStorageService,
                                 EnrollmentRepository enrollmentRepository) {
        this.courseMaterialRepository = courseMaterialRepository;
        this.courseRepository = courseRepository;
        this.fileStorageService = fileStorageService;
        this.enrollmentRepository = enrollmentRepository;
    }

    public CourseMaterialResponse uploadMaterial(Long courseId, String title, MaterialType type, MultipartFile file, User instructor) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You are not authorized to add materials to this course");
        }

        // Store the actual file physically
        String fileUrl = fileStorageService.storeFile(file, courseId);

        // Save reference in MySQL
        CourseMaterial material = CourseMaterial.builder()
                .title(title)
                .type(type)
                .fileUrl(fileUrl)
                .course(course)
                .build();

        CourseMaterial savedMaterial = courseMaterialRepository.save(material);
        
        return mapToResponse(savedMaterial);
    }

    public void deleteMaterial(Long materialId, User instructor) {
        CourseMaterial material = courseMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (!material.getCourse().getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("You are not authorized to delete this material");
        }

        // Physically delete the file
        fileStorageService.deleteFile(material.getFileUrl());
        
        // Remove from MySQL
        courseMaterialRepository.delete(material);
    }

    public List<CourseMaterialResponse> getCourseMaterials(Long courseId, User currentUser) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (currentUser.getRole() == Role.ROLE_LEARNER) {
            boolean isEnrolled = enrollmentRepository.existsByUserAndCourse(currentUser, course);
            if (!isEnrolled) {
                throw new RuntimeException("Access denied! You must enroll in the course to view materials.");
            }
        } else if (currentUser.getRole() == Role.ROLE_INSTRUCTOR) {
            if (!course.getInstructor().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied! You are not the instructor of this course.");
            }
        }

        return courseMaterialRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CourseMaterialResponse mapToResponse(CourseMaterial material) {
        return CourseMaterialResponse.builder()
                .id(material.getId())
                .title(material.getTitle())
                .type(material.getType())
                .fileUrl(material.getFileUrl())
                .courseId(material.getCourse().getId())
                .build();
    }
}
