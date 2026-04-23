package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // For admin to fetch paginated lists of specific roles efficiently
    Page<User> findByRole(Role role, Pageable pageable);
}
