package com.example.praisepoints.repository;

import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {
    List<Child> findByUser(User user);
    List<Child> findByUserIdOrderByCreatedAtAsc(Long userId);
}