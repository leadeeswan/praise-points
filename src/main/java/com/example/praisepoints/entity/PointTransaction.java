package com.example.praisepoints.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PointTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    @JsonIgnore
    private Child child;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    private TransactionType transactionType;
    
    @NotNull
    @Column(nullable = false)
    private int points;
    
    private String reason;
    
    private String message;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    public enum TransactionType {
        EARN, SPEND
    }
}