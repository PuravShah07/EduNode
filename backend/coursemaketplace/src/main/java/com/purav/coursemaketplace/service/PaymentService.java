package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.response.OrderCreationResponse;
import com.purav.coursemaketplace.entity.*;
import com.purav.coursemaketplace.exception.BadRequestException;
import com.purav.coursemaketplace.exception.ResourceNotFoundException;
import com.purav.coursemaketplace.repository.CourseRepository;
import com.purav.coursemaketplace.repository.EnrollmentRepository;
import com.purav.coursemaketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;
    private final RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentService(CourseRepository courseRepository,
                          EnrollmentRepository enrollmentRepository,
                          OrderRepository orderRepository,
                          RazorpayService razorpayService) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.razorpayService = razorpayService;
    }

    // Creates an order with Razorpay and stores a pending local Order record
    @Transactional
    public OrderCreationResponse createOrder(Long courseId, User student) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Validate duplicates
        if (enrollmentRepository.existsByUserAndCourse(student, course)) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        if (orderRepository.existsByUserAndCourseAndStatus(student, course, OrderStatus.COMPLETED)) {
            throw new BadRequestException("You have already purchased this course");
        }

        // Validate price
        if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("This course is free, enroll directly");
        }

        try {
            // Generate unique receipt ID
            String receiptId = "receipt_" + student.getId() + "_" + courseId + "_" + UUID.randomUUID().toString().substring(0, 8);
            com.razorpay.Order rpOrder = razorpayService.createOrder(course.getPrice(), receiptId);

            String razorpayOrderId = rpOrder.get("id");

            Order order = Order.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .user(student)
                    .course(course)
                    .amount(course.getPrice())
                    .status(OrderStatus.PENDING)
                    .build();

            Order savedOrder = orderRepository.save(order);

            return OrderCreationResponse.builder()
                    .id(savedOrder.getId())
                    .razorpayOrderId(razorpayOrderId)
                    .amount(savedOrder.getAmount())
                    .currency(savedOrder.getCurrency())
                    .courseTitle(course.getTitle())
                    .courseId(course.getId())
                    .razorpayKeyId(razorpayKeyId)
                    .build();
        } catch (Exception e) {
            throw new BadRequestException("Failed to initiate Razorpay order: " + e.getMessage());
        }
    }
}
