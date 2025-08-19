package com.example.praisepoints.controller;

import com.example.praisepoints.dto.ChildResponse;
import com.example.praisepoints.dto.ChildPurchaseRequest;
import com.example.praisepoints.dto.ChildProfileResponse;
import com.example.praisepoints.dto.ErrorResponse;
import com.example.praisepoints.dto.PointTransactionResponse;
import com.example.praisepoints.dto.PurchaseHistoryResponse;
import com.example.praisepoints.dto.RewardListResponse;
import com.example.praisepoints.exception.PurchaseException;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.PointTransaction;
import com.example.praisepoints.entity.Purchase;
import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.repository.ChildRepository;
import com.example.praisepoints.service.PointService;
import com.example.praisepoints.service.PurchaseService;
import com.example.praisepoints.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/child-dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChildDashboardController {
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private PointService pointService;
    
    @Autowired
    private PurchaseService purchaseService;
    
    @Autowired
    private RewardService rewardService;
    
    @GetMapping("/profile")
    public ResponseEntity<ChildProfileResponse> getChildProfile() {
        Long childId = getChildIdFromToken();
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        
        ChildProfileResponse response = convertToChildProfileResponse(child);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/points/history")
    public ResponseEntity<List<PointTransactionResponse>> getPointHistory() {
        Long childId = getChildIdFromToken();
        List<PointTransaction> history = pointService.getPointHistoryByChildId(childId);
        
        List<PointTransactionResponse> response = history.stream()
                .map(this::convertToPointTransactionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/purchases")
    public ResponseEntity<List<PurchaseHistoryResponse>> getPurchaseHistory() {
        Long childId = getChildIdFromToken();
        List<Purchase> purchases = purchaseService.getPurchasesByChildId(childId);
        
        List<PurchaseHistoryResponse> response = purchases.stream()
                .map(this::convertToPurchaseHistoryResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/rewards/available")
    public ResponseEntity<List<RewardListResponse>> getAvailableRewards() {
        Long childId = getChildIdFromToken();
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        List<Reward> rewards = rewardService.getActiveRewardsByUser(child.getUser());
        
        List<RewardListResponse> response = rewards.stream()
                .map(this::convertToRewardListResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/purchase")
    public ResponseEntity<?> requestPurchase(@Valid @RequestBody ChildPurchaseRequest request) {
        try {
            Long childId = getChildIdFromToken();
            Purchase purchase = purchaseService.requestPurchaseByChild(childId, request.getRewardId());
            
            PurchaseHistoryResponse response = convertToPurchaseHistoryResponse(purchase);
            return ResponseEntity.ok(response);
        } catch (PurchaseException e) {
            ErrorResponse errorResponse = new ErrorResponse(e.getErrorCode(), e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/purchase/{purchaseId}")
    public ResponseEntity<?> cancelPurchase(@PathVariable Long purchaseId) {
        try {
            Long childId = getChildIdFromToken();
            Purchase purchase = purchaseService.cancelPurchaseByChild(childId, purchaseId);
            
            PurchaseHistoryResponse response = convertToPurchaseHistoryResponse(purchase);
            return ResponseEntity.ok(response);
        } catch (PurchaseException e) {
            ErrorResponse errorResponse = new ErrorResponse(e.getErrorCode(), e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    private Long getChildIdFromToken() {
        String authentication = SecurityContextHolder.getContext().getAuthentication().getName();
        if (authentication.startsWith("child_")) {
            return Long.parseLong(authentication.substring(6));
        }
        throw new RuntimeException("Invalid child authentication");
    }
    
    private ChildProfileResponse convertToChildProfileResponse(Child child) {
        return new ChildProfileResponse(
                child.getId(),
                child.getName(),
                child.getBirthDate(),
                child.getProfileImage(),
                child.getTotalPoints(),
                child.getReservedPoints(),
                child.getAvailablePoints(),
                child.getCreatedAt()
        );
    }
    
    private PointTransactionResponse convertToPointTransactionResponse(PointTransaction transaction) {
        return new PointTransactionResponse(
                transaction.getId(),
                transaction.getTransactionType().name(),
                transaction.getPoints(),
                transaction.getReason(),
                transaction.getMessage(),
                transaction.getCreatedAt()
        );
    }
    
    private PurchaseHistoryResponse convertToPurchaseHistoryResponse(Purchase purchase) {
        return new PurchaseHistoryResponse(
                purchase.getId(),
                purchase.getReward().getName(),
                purchase.getReward().getDescription(),
                purchase.getReward().getRequiredPoints(),
                purchase.getReward().getImageUrl(),
                purchase.getStatus().name(),
                purchase.getRequestedAt(),
                purchase.getApprovedAt()
        );
    }
    
    private RewardListResponse convertToRewardListResponse(Reward reward) {
        return new RewardListResponse(
                reward.getId(),
                reward.getName(),
                reward.getDescription(),
                reward.getRequiredPoints(),
                reward.getCategory().name(),
                reward.getImageUrl(),
                reward.isActive(),
                reward.getCreatedAt()
        );
    }
}