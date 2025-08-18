package com.example.praisepoints.controller;

import com.example.praisepoints.dto.ChildRequest;
import com.example.praisepoints.dto.ChildResponse;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.service.ChildService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChildController {
    
    @Autowired
    private ChildService childService;
    
    @GetMapping
    public ResponseEntity<List<ChildResponse>> getChildren() {
        List<ChildResponse> children = childService.getChildrenByCurrentUser();
        return ResponseEntity.ok(children);
    }
    
    @PostMapping
    public ResponseEntity<ChildResponse> createChild(@Valid @RequestBody ChildRequest request) {
        ChildResponse child = childService.createChild(request);
        return ResponseEntity.ok(child);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getChild(@PathVariable Long id) {
        ChildResponse child = childService.getChildById(id);
        return ResponseEntity.ok(child);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ChildResponse> updateChild(@PathVariable Long id, @Valid @RequestBody ChildRequest request) {
        ChildResponse child = childService.updateChild(id, request);
        return ResponseEntity.ok(child);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable Long id) {
        childService.deleteChild(id);
        return ResponseEntity.ok().build();
    }
}