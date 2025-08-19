package com.example.praisepoints.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ChildProfileResponse {
    private Long id;
    private String name;
    private LocalDate birthDate;
    private String profileImage;
    private int totalPoints;
    private int reservedPoints;
    private int availablePoints;
    private LocalDateTime createdAt;
    
    public ChildProfileResponse(Long id, String name, LocalDate birthDate, String profileImage, 
                               int totalPoints, int reservedPoints, int availablePoints, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.profileImage = profileImage;
        this.totalPoints = totalPoints;
        this.reservedPoints = reservedPoints;
        this.availablePoints = availablePoints;
        this.createdAt = createdAt;
    }
}