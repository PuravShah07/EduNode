package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.request.PaymentVerificationRequest;
import com.purav.coursemaketplace.dto.response.OrderCreationResponse;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    // Endpoint to verify Razorpay signature and finalize purchase
    @PostMapping("/verify")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<Void> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request,
            @AuthenticationPrincipal User student) {
        
        paymentService.verifyPayment(request, student);
        return ResponseEntity.ok().build();
    }
}
