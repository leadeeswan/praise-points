package com.example.praisepoints.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "children")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 추가
public class Child {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @NotBlank
    private String name;
    
    private LocalDate birthDate;
    
    private String profileImage;
    
    @Column(nullable = false, columnDefinition = "int default 0")
    private int totalPoints = 0;
    
    @Column(nullable = false, columnDefinition = "int default 0")
    private int reservedPoints = 0;
    
    @Column(unique = true)
    private String username;
    
    private String authKey;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<PointTransaction> pointTransactions;
    
    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Purchase> purchases;
    
    // 사용 가능한 포인트 계산
    public int getAvailablePoints() {
        return totalPoints - reservedPoints;
    }
    
    // 예약된 포인트 증가
    public void addReservedPoints(int points) {
        this.reservedPoints += points;
    }
    
    // 예약된 포인트 감소
    public void subtractReservedPoints(int points) {
        this.reservedPoints = Math.max(0, this.reservedPoints - points);
    }
}