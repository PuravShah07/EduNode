package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {
    List<CourseMaterial> findByCourseId(Long courseId);

    @Query("SELECT COALESCE(SUM(cm.fileSize), 0) FROM CourseMaterial cm WHERE cm.course.id = :courseId")
    Long sumFileSizeByCourseId(@Param("courseId") Long courseId);
}
