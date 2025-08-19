package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class ChildAuthResponse {
    private String token;
    private Long childId;
    private String name;
    private int totalPoints;
}