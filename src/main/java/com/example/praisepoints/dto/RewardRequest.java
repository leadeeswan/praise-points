package com.example.praisepoints.dto;

import com.example.praisepoints.entity.Reward;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RewardRequest {
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    @Min(1)
    private Integer requiredPoints;
    
    private Reward.RewardCategory category;
    
    private String imageUrl;
    
    private Boolean isActive = true;
}