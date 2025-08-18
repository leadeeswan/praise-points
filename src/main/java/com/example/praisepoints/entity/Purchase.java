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
@Table(name = "purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Purchase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false, columnDefinition = "varchar(20) default 'PENDING'")
    private PurchaseStatus status = PurchaseStatus.PENDING;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime requestedAt;
    
    private LocalDateTime approvedAt;
    
    public enum PurchaseStatus {
        PENDING("승인 대기"),
        APPROVED("승인"),
        REJECTED("거절");
        
        private final String displayName;
        
        PurchaseStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}