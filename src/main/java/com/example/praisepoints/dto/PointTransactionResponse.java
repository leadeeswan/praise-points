package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointTransactionResponse {
    private Long id;
    private String transactionType; // EARN, SPEND
    private int points;
    private String reason;
    private String message;
    private LocalDateTime createdAt;
}