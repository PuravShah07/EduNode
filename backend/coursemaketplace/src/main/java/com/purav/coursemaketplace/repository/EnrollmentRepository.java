package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.Enrollment;
import com.purav.coursemaketplace.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserAndCourse(User user, Course course);
    List<Enrollment> findByUser(User user);

    // EntityGraph prevents the N+1 query problem by eagerly fetching relations in a single DB query
    @EntityGraph(attributePaths = {"user", "course", "course.instructor"})
    Page<Enrollment> findAll(Pageable pageable);
}
