package com.example.praisepoints.controller;

import com.example.praisepoints.dto.PurchaseRequest;
import com.example.praisepoints.entity.Purchase;
import com.example.praisepoints.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PurchaseController {
    
    @Autowired
    private PurchaseService purchaseService;
    
    @PostMapping
    public ResponseEntity<Purchase> requestPurchase(@Valid @RequestBody PurchaseRequest request) {
        Purchase purchase = purchaseService.requestPurchase(request);
        return ResponseEntity.ok(purchase);
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<Purchase> approvePurchase(@PathVariable Long id) {
        Purchase purchase = purchaseService.approvePurchase(id);
        return ResponseEntity.ok(purchase);
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<Purchase> rejectPurchase(@PathVariable Long id) {
        Purchase purchase = purchaseService.rejectPurchase(id);
        return ResponseEntity.ok(purchase);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Purchase>> getPendingPurchases() {
        List<Purchase> purchases = purchaseService.getPendingPurchases();
        return ResponseEntity.ok(purchases);
    }
    
    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        List<Purchase> purchases = purchaseService.getAllPurchasesByCurrentUser();
        return ResponseEntity.ok(purchases);
    }
    
    @GetMapping("/child/{childId}")
    public ResponseEntity<List<Purchase>> getPurchasesByChild(@PathVariable Long childId) {
        List<Purchase> purchases = purchaseService.getPurchasesByChild(childId);
        return ResponseEntity.ok(purchases);
    }
}