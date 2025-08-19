package com.example.praisepoints.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChildAuthRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String authKey;
}