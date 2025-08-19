package com.example.praisepoints.service;

import com.example.praisepoints.dto.PurchaseRequest;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.Purchase;
import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.exception.PurchaseException;
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
        
        // 예약된 포인트 해제 (실제 포인트는 pointService에서 차감됨)
        child.subtractReservedPoints(reward.getRequiredPoints());
        childRepository.save(child);
        
        purchase.setStatus(Purchase.PurchaseStatus.APPROVED);
        purchase.setApprovedAt(LocalDateTime.now());
        
        return purchaseRepository.save(purchase);
    }
    
    public Purchase rejectPurchase(Long purchaseId) {
        Purchase purchase = getPurchaseByIdAndCurrentUser(purchaseId);
        
        if (purchase.getStatus() != Purchase.PurchaseStatus.PENDING) {
            throw new RuntimeException("Purchase is not pending");
        }
        
        Child child = purchase.getChild();
        Reward reward = purchase.getReward();
        
        // 예약된 포인트 해제
        child.subtractReservedPoints(reward.getRequiredPoints());
        childRepository.save(child);
        
        purchase.setStatus(Purchase.PurchaseStatus.REJECTED);
        purchase.setApprovedAt(LocalDateTime.now());
        
        return purchaseRepository.save(purchase);
    }
    
    public Purchase cancelPurchaseByChild(Long childId, Long purchaseId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new PurchaseException("CHILD_NOT_FOUND", "아이를 찾을 수 없습니다."));
        
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new PurchaseException("PURCHASE_NOT_FOUND", "구매 요청을 찾을 수 없습니다."));
        
        // 해당 아이의 구매 요청인지 확인
        if (!purchase.getChild().getId().equals(childId)) {
            throw new PurchaseException("ACCESS_DENIED", "해당 구매 요청에 접근할 수 없습니다.");
        }
        
        // 승인 대기 상태인지 확인
        if (purchase.getStatus() != Purchase.PurchaseStatus.PENDING) {
            throw new PurchaseException("PURCHASE_NOT_PENDING", "승인 대기 중인 구매 요청만 취소할 수 있습니다.");
        }
        
        Reward reward = purchase.getReward();
        
        // 예약된 포인트 해제
        child.subtractReservedPoints(reward.getRequiredPoints());
        childRepository.save(child);
        
        // 구매 요청 상태를 거절로 변경 (취소 상태 대신)
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
    
    public List<Purchase> getPurchasesByChildId(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        return purchaseRepository.findByChildOrderByRequestedAtDesc(child);
    }
    
    public Purchase requestPurchaseByChild(Long childId, Long rewardId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new PurchaseException("CHILD_NOT_FOUND", "아이를 찾을 수 없습니다."));
        
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new PurchaseException("REWARD_NOT_FOUND", "상품을 찾을 수 없습니다."));
        
        // 아이와 상품이 같은 부모에게 속하는지 확인
        if (!child.getUser().getId().equals(reward.getUser().getId())) {
            throw new PurchaseException("ACCESS_DENIED", "해당 상품에 접근할 수 없습니다.");
        }
        
        if (!reward.isActive()) {
            throw new PurchaseException("REWARD_INACTIVE", "비활성화된 상품입니다.");
        }
        
        if (child.getAvailablePoints() < reward.getRequiredPoints()) {
            throw new PurchaseException("INSUFFICIENT_POINTS", 
                String.format("포인트가 부족합니다. 필요: %d, 사용가능: %d", 
                    reward.getRequiredPoints(), child.getAvailablePoints()));
        }
        
        // 구매 요청 시 포인트 예약
        child.addReservedPoints(reward.getRequiredPoints());
        childRepository.save(child);
        
        Purchase purchase = new Purchase();
        purchase.setChild(child);
        purchase.setReward(reward);
        purchase.setStatus(Purchase.PurchaseStatus.PENDING);
        
        return purchaseRepository.save(purchase);
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