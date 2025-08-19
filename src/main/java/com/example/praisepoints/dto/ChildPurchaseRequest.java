package com.example.praisepoints.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChildPurchaseRequest {
    @NotNull
    private Long rewardId;
}

