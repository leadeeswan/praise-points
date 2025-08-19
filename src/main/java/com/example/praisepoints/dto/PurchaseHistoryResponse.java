package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseHistoryResponse {
    private Long id;
    private String rewardName;
    private String rewardDescription;
    private int requiredPoints;
    private String rewardImageUrl;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
}