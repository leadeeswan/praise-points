package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardListResponse {
    private Long id;
    private String name;
    private String description;
    private int requiredPoints;
    private String category;
    private String imageUrl;
    private boolean isActive;
    private LocalDateTime createdAt;
}