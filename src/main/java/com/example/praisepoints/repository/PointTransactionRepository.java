package com.example.praisepoints.repository;

import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.PointTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {
    List<PointTransaction> findByChildOrderByCreatedAtDesc(Child child);
    Page<PointTransaction> findByChildOrderByCreatedAtDesc(Child child, Pageable pageable);
    List<PointTransaction> findByChildAndCreatedAtBetweenOrderByCreatedAtDesc(
            Child child, LocalDateTime start, LocalDateTime end);
}