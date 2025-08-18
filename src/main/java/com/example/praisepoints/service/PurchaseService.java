package com.example.praisepoints.service;

import com.example.praisepoints.dto.PurchaseRequest;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.Purchase;
import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.repository.ChildRepository;
import com.example.praisepoints.repository.PurchaseRepository;
import com.example.praisepoints.repository.RewardRepository;
import com.example.praisepoints.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PurchaseService {
    
    @Autowired
    private PurchaseRepository purchaseRepository;
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private RewardRepository rewardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PointService pointService;
    
    public Purchase requestPurchase(PurchaseRequest request) {
        Child child = childRepository.findById(request.getChildId())
                .orElseThrow(() -> new RuntimeException("Child not found"));
        
        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new RuntimeException("Reward not found"));
        
        User currentUser = getCurrentUser();
        if (!child.getUser().getId().equals(currentUser.getId()) ||
            !reward.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        if (!reward.isActive()) {
            throw new RuntimeException("Reward is not active");
        }
        
        if (child.getTotalPoints() < reward.getRequiredPoints()) {
            throw new RuntimeException("Insufficient points");
        }
        
        Purchase purchase = new Purchase();
        purchase.setChild(child);
        purchase.setReward(reward);
        purchase.setStatus(Purchase.PurchaseStatus.PENDING);
        
        return purchaseRepository.save(purchase);
    }
    
    public Purchase approvePurchase(Long purchaseId) {
        Purchase purchase = getPurchaseByIdAndCurrentUser(purchaseId);
        
        if (purchase.getStatus() != Purchase.PurchaseStatus.PENDING) {
            throw new RuntimeException("Purchase is not pending");
        }
        
        Child child = purchase.getChild();
        Reward reward = purchase.getReward();
        
        if (child.getTotalPoints() < reward.getRequiredPoints()) {
            throw new RuntimeException("Insufficient points");
        }
        
        pointService.spendPoints(child, reward.getRequiredPoints(), "구매: " + reward.getName());
        
        purchase.setStatus(Purchase.PurchaseStatus.APPROVED);
        purchase.setApprovedAt(LocalDateTime.now());
        
        return purchaseRepository.save(purchase);
    }
    
    public Purchase rejectPurchase(Long purchaseId) {
        Purchase purchase = getPurchaseByIdAndCurrentUser(purchaseId);
        
        if (purchase.getStatus() != Purchase.PurchaseStatus.PENDING) {
            throw new RuntimeException("Purchase is not pending");
        }
        
        purchase.setStatus(Purchase.PurchaseStatus.REJECTED);
        purchase.setApprovedAt(LocalDateTime.now());
        
        return purchaseRepository.save(purchase);
    }
    
    public List<Purchase> getPendingPurchases() {
        User currentUser = getCurrentUser();
        return purchaseRepository.findByUserAndStatusOrderByRequestedAtDesc(
                currentUser, Purchase.PurchaseStatus.PENDING);
    }
    
    public List<Purchase> getAllPurchasesByCurrentUser() {
        User currentUser = getCurrentUser();
        return purchaseRepository.findByUserOrderByRequestedAtDesc(currentUser);
    }
    
    public List<Purchase> getPurchasesByChild(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        
        User currentUser = getCurrentUser();
        if (!child.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return purchaseRepository.findByChildOrderByRequestedAtDesc(child);
    }
    
    private Purchase getPurchaseByIdAndCurrentUser(Long purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));
        
        User currentUser = getCurrentUser();
        if (!purchase.getChild().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return purchase;
    }
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}