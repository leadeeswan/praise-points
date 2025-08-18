package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildResponse {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private String profileImage;
    private int totalPoints;
    private LocalDateTime createdAt;
}