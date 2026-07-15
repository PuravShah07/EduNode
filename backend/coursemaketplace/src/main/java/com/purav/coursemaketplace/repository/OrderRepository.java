package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.Order;
import com.purav.coursemaketplace.entity.Course;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    boolean existsByUserAndCourseAndStatus(User user, Course course, OrderStatus status);
}
