package com.example.praisepoints.dto;

import com.example.praisepoints.entity.Reward;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RewardResponse {
    private Long id;
    private String name;
    private String description;
    private int requiredPoints;
    private Reward.RewardCategory category;
    private String imageUrl;
    private boolean isActive;
    private LocalDateTime createdAt;
}