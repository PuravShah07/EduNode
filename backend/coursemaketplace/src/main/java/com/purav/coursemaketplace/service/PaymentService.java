package com.purav.coursemaketplace.service;

import com.purav.coursemaketplace.dto.request.PaymentVerificationRequest;
import com.purav.coursemaketplace.dto.response.OrderCreationResponse;
import com.purav.coursemaketplace.entity.*;
import com.purav.coursemaketplace.exception.BadRequestException;
import com.purav.coursemaketplace.exception.ResourceNotFoundException;
import com.purav.coursemaketplace.repository.*;
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
    private final PaymentRepository paymentRepository;
    private final InstructorEarningRepository instructorEarningRepository;
    private final RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentService(CourseRepository courseRepository,
                          EnrollmentRepository enrollmentRepository,
                          OrderRepository orderRepository,
                          PaymentRepository paymentRepository,
                          InstructorEarningRepository instructorEarningRepository,
                          RazorpayService razorpayService) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.instructorEarningRepository = instructorEarningRepository;
        this.razorpayService = razorpayService;
    }

    // Creates an order with Razorpay and stores a pending local Order record
    @Transactional
    public OrderCreationResponse createOrder(Long courseId, User student) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.existsByUserAndCourse(student, course)) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        if (orderRepository.existsByUserAndCourseAndStatus(student, course, OrderStatus.COMPLETED)) {
            throw new BadRequestException("You have already purchased this course");
        }

        if (course.getPrice() == null || course.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("This course is free, enroll directly");
        }

        try {
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

    // Verifies the Razorpay payment signature and enrolls student on success
    @Transactional
    public void verifyPayment(PaymentVerificationRequest request, User student) {
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(student.getId())) {
            throw new BadRequestException("This order does not belong to you");
        }

        if (order.getStatus() == OrderStatus.COMPLETED) {
            return;
        }

        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isValid) {
            order.setStatus(OrderStatus.COMPLETED);
            orderRepository.save(order);

            Payment payment = Payment.builder()
                    .razorpayPaymentId(request.getRazorpayPaymentId())
                    .order(order)
                    .razorpaySignature(request.getRazorpaySignature())
                    .amount(order.getAmount())
                    .status(PaymentStatus.SUCCESS)
                    .build();
            paymentRepository.save(payment);

            Enrollment enrollment = Enrollment.builder()
                    .user(order.getUser())
                    .course(order.getCourse())
                    .completed(false)
                    .progress(0)
                    .build();
            enrollmentRepository.save(enrollment);

            InstructorEarning earning = InstructorEarning.builder()
                    .instructor(order.getCourse().getInstructor())
                    .course(order.getCourse())
                    .order(order)
                    .amount(order.getAmount())
                    .build();
            instructorEarningRepository.save(earning);
        } else {
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);

            Payment payment = Payment.builder()
                    .razorpayPaymentId(request.getRazorpayPaymentId())
                    .order(order)
                    .razorpaySignature(request.getRazorpaySignature())
                    .amount(order.getAmount())
                    .status(PaymentStatus.FAILED)
                    .build();
            paymentRepository.save(payment);

            throw new BadRequestException("Payment signature verification failed");
        }
    }
}
