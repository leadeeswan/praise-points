package com.example.praisepoints.controller;

import com.example.praisepoints.dto.RewardRequest;
import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RewardController {
    
    @Autowired
    private RewardService rewardService;
    
    @GetMapping
    public ResponseEntity<List<Reward>> getRewards() {
        List<Reward> rewards = rewardService.getRewardsByCurrentUser();
        return ResponseEntity.ok(rewards);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Reward>> getActiveRewards() {
        List<Reward> rewards = rewardService.getActiveRewardsByCurrentUser();
        return ResponseEntity.ok(rewards);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Reward>> getRewardsByCategory(@PathVariable Reward.RewardCategory category) {
        List<Reward> rewards = rewardService.getRewardsByCategory(category);
        return ResponseEntity.ok(rewards);
    }
    
    @PostMapping
    public ResponseEntity<Reward> createReward(@Valid @RequestBody RewardRequest request) {
        Reward reward = rewardService.createReward(request);
        return ResponseEntity.ok(reward);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reward> getReward(@PathVariable Long id) {
        Reward reward = rewardService.getRewardById(id);
        return ResponseEntity.ok(reward);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Reward> updateReward(@PathVariable Long id, @Valid @RequestBody RewardRequest request) {
        Reward reward = rewardService.updateReward(id, request);
        return ResponseEntity.ok(reward);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<String> toggleRewardStatus(@PathVariable Long id) {
        rewardService.toggleRewardStatus(id);
        return ResponseEntity.ok("Reward status toggled successfully");
    }
}