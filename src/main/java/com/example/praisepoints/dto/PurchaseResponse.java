package com.example.praisepoints.dto;

import com.example.praisepoints.entity.Purchase;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseResponse {
    private Long id;
    private ChildResponse child;
    private RewardResponse reward;
    private Purchase.PurchaseStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
}