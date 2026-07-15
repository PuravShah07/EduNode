package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.InstructorEarning;
import com.purav.coursemaketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorEarningRepository extends JpaRepository<InstructorEarning, Long> {
    List<InstructorEarning> findByInstructor(User instructor);
}
