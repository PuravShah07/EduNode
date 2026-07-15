package com.purav.coursemaketplace.repository;

import com.purav.coursemaketplace.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
}
