package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.OrderCreationResponse;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Endpoint to create a Razorpay order before frontend checkout
    @PostMapping("/order/courses/{courseId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<OrderCreationResponse> createOrder(
            @PathVariable Long courseId,
            @AuthenticationPrincipal User student) {
        
        return ResponseEntity.ok(paymentService.createOrder(courseId, student));
    }
}
