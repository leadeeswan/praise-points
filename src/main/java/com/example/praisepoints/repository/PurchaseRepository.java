package com.example.praisepoints.repository;

import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.Purchase;
import com.example.praisepoints.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByChildOrderByRequestedAtDesc(Child child);
    List<Purchase> findByStatusOrderByRequestedAtDesc(Purchase.PurchaseStatus status);
    
    @Query("SELECT p FROM Purchase p WHERE p.child.user = :user AND p.status = :status ORDER BY p.requestedAt DESC")
    List<Purchase> findByUserAndStatusOrderByRequestedAtDesc(@Param("user") User user, @Param("status") Purchase.PurchaseStatus status);
    
    @Query("SELECT p FROM Purchase p WHERE p.child.user = :user ORDER BY p.requestedAt DESC")
    List<Purchase> findByUserOrderByRequestedAtDesc(@Param("user") User user);
}