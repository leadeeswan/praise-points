package com.example.praisepoints.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PurchaseRequest {
    @NotNull
    private Long childId;
    
    @NotNull
    private Long rewardId;
}