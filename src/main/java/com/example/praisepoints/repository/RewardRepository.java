package com.example.praisepoints.repository;

import com.example.praisepoints.entity.Reward;
import com.example.praisepoints.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByUserAndIsActiveOrderByCreatedAtDesc(User user, boolean isActive);
    List<Reward> findByUserOrderByCreatedAtDesc(User user);
    List<Reward> findByUserAndCategoryAndIsActiveOrderByCreatedAtDesc(
            User user, Reward.RewardCategory category, boolean isActive);
}