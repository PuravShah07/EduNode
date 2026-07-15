package com.purav.coursemaketplace.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderCreationResponse {
    private Long id;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String courseTitle;
    private Long courseId;
    private String razorpayKeyId;
}
