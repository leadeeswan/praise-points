package com.example.praisepoints.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PointAwardRequest {
    @NotEmpty
    private List<Long> childIds;
    
    @NotNull
    @Min(1)
    @Max(10)
    private Integer points;
    
    private String reason;
    
    private String message;
}