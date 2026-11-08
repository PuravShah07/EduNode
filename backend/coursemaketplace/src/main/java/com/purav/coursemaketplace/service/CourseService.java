package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.request.CourseRequest;
import com.purav.coursemaketplace.dto.response.CourseResponse;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.repository.CourseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Caching(evict = {
        @CacheEvict(value = "courses", allEntries = true)
    })
    public CourseResponse createCourse(CourseRequest request, User instructor) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .instructor(instructor)
                .build();

        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    public List<CourseResponse> getInstructorCourses(User instructor) {
        return courseRepository.findByInstructor(instructor).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "courses", key = "#keyword + '_' + #sortBy")
    public List<CourseResponse> getAllCourses(String keyword, String sortBy) {
        Sort sort = Sort.unsorted();

        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price_asc":
                    sort = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "price_desc":
                    sort = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "latest":
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
                default:
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
            }
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        List<Course> courses;
        if (keyword != null && !keyword.trim().isEmpty()) {
            courses = courseRepository.searchCourses(keyword, sort);
        } else {
            courses = courseRepository.findAll(sort);
        }

        return courses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "course", key = "#id")
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new com.purav.coursemaketplace.exception.ResourceNotFoundException("Course not found"));
        return mapToResponse(course);
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .price(course.getPrice())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getName())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
