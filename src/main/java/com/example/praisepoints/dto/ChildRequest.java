package com.example.praisepoints.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ChildRequest {
    @NotBlank
    private String name;
    
    private LocalDate birthDate;
    
    private String profileImage;
}