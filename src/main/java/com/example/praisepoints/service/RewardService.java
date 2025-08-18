package com.example.praisepoints.service;

import com.example.praisepoints.dto.RewardRequest;
import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.repository.RewardRepository;
import com.example.praisepoints.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RewardService {
    
    @Autowired
    private RewardRepository rewardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Reward> getRewardsByCurrentUser() {
        User currentUser = getCurrentUser();
        return rewardRepository.findByUserOrderByCreatedAtDesc(currentUser);
    }
    
    public List<Reward> getActiveRewardsByCurrentUser() {
        User currentUser = getCurrentUser();
        return rewardRepository.findByUserAndIsActiveOrderByCreatedAtDesc(currentUser, true);
    }
    
    public List<Reward> getRewardsByCategory(Reward.RewardCategory category) {
        User currentUser = getCurrentUser();
        return rewardRepository.findByUserAndCategoryAndIsActiveOrderByCreatedAtDesc(currentUser, category, true);
    }
    
    public Reward createReward(RewardRequest request) {
        User currentUser = getCurrentUser();
        
        Reward reward = new Reward();
        reward.setUser(currentUser);
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setRequiredPoints(request.getRequiredPoints());
        reward.setCategory(request.getCategory());
        reward.setImageUrl(request.getImageUrl());
        reward.setActive(request.getIsActive() != null ? request.getIsActive() : true);
        
        return rewardRepository.save(reward);
    }
    
    public Reward updateReward(Long rewardId, RewardRequest request) {
        Reward reward = getRewardByIdAndCurrentUser(rewardId);
        
        reward.setName(request.getName());
        reward.setDescription(request.getDescription());
        reward.setRequiredPoints(request.getRequiredPoints());
        reward.setCategory(request.getCategory());
        reward.setImageUrl(request.getImageUrl());
        
        if (request.getIsActive() != null) {
            reward.setActive(request.getIsActive());
        }
        
        return rewardRepository.save(reward);
    }
    
    public void deleteReward(Long rewardId) {
        Reward reward = getRewardByIdAndCurrentUser(rewardId);
        rewardRepository.delete(reward);
    }
    
    public Reward getRewardById(Long rewardId) {
        return getRewardByIdAndCurrentUser(rewardId);
    }
    
    public void toggleRewardStatus(Long rewardId) {
        Reward reward = getRewardByIdAndCurrentUser(rewardId);
        reward.setActive(!reward.isActive());
        rewardRepository.save(reward);
    }
    
    private Reward getRewardByIdAndCurrentUser(Long rewardId) {
        User currentUser = getCurrentUser();
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found with id: " + rewardId));
        
        if (!reward.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return reward;
    }
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}