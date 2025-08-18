package com.example.praisepoints.controller;

import com.example.praisepoints.dto.PointAwardRequest;
import com.example.praisepoints.entity.PointTransaction;
import com.example.praisepoints.service.PointService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PointController {
    
    @Autowired
    private PointService pointService;
    
    @PostMapping("/award")
    public ResponseEntity<String> awardPoints(@Valid @RequestBody PointAwardRequest request) {
        pointService.awardPoints(request);
        return ResponseEntity.ok("Points awarded successfully");
    }
    
    @GetMapping("/history/{childId}")
    public ResponseEntity<List<PointTransaction>> getPointHistory(@PathVariable Long childId) {
        List<PointTransaction> history = pointService.getPointHistory(childId);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/history/{childId}/paged")
    public ResponseEntity<Page<PointTransaction>> getPointHistoryPaged(
            @PathVariable Long childId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PointTransaction> history = pointService.getPointHistoryPaged(childId, pageable);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/balance/{childId}")
    public ResponseEntity<Integer> getPointBalance(@PathVariable Long childId) {
        int balance = pointService.getPointBalance(childId);
        return ResponseEntity.ok(balance);
    }
}