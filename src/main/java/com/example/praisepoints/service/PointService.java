package com.example.praisepoints.service;

import com.example.praisepoints.dto.PointAwardRequest;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.PointTransaction;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.repository.ChildRepository;
import com.example.praisepoints.repository.PointTransactionRepository;
import com.example.praisepoints.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PointService {
    
    @Autowired
    private PointTransactionRepository pointTransactionRepository;
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void awardPoints(PointAwardRequest request) {
        User currentUser = getCurrentUser();
        
        for (Long childId : request.getChildIds()) {
            Child child = childRepository.findById(childId)
                    .orElseThrow(() -> new RuntimeException("Child not found with id: " + childId));
            
            if (!child.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access denied for child: " + childId);
            }
            
            PointTransaction transaction = new PointTransaction();
            transaction.setChild(child);
            transaction.setTransactionType(PointTransaction.TransactionType.EARN);
            transaction.setPoints(request.getPoints());
            transaction.setReason(request.getReason());
            transaction.setMessage(request.getMessage());
            
            pointTransactionRepository.save(transaction);
            
            child.setTotalPoints(child.getTotalPoints() + request.getPoints());
            childRepository.save(child);
        }
    }
    
    public void spendPoints(Child child, int points, String reason) {
        if (child.getTotalPoints() < points) {
            throw new RuntimeException("Insufficient points");
        }
        
        PointTransaction transaction = new PointTransaction();
        transaction.setChild(child);
        transaction.setTransactionType(PointTransaction.TransactionType.SPEND);
        transaction.setPoints(points);
        transaction.setReason(reason);
        
        pointTransactionRepository.save(transaction);
        
        child.setTotalPoints(child.getTotalPoints() - points);
        childRepository.save(child);
    }
    
    public List<PointTransaction> getPointHistory(Long childId) {
        Child child = getChildByIdAndCurrentUser(childId);
        return pointTransactionRepository.findByChildOrderByCreatedAtDesc(child);
    }
    
    public Page<PointTransaction> getPointHistoryPaged(Long childId, Pageable pageable) {
        Child child = getChildByIdAndCurrentUser(childId);
        return pointTransactionRepository.findByChildOrderByCreatedAtDesc(child, pageable);
    }
    
    public int getPointBalance(Long childId) {
        Child child = getChildByIdAndCurrentUser(childId);
        return child.getTotalPoints();
    }
    
    private Child getChildByIdAndCurrentUser(Long childId) {
        User currentUser = getCurrentUser();
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found with id: " + childId));
        
        if (!child.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return child;
    }
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}