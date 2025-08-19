package com.example.praisepoints.controller;

import com.example.praisepoints.dto.ChildAuthRequest;
import com.example.praisepoints.dto.ChildAuthResponse;
import com.example.praisepoints.service.ChildAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/child-auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChildAuthController {
    
    @Autowired
    private ChildAuthService childAuthService;
    
    @PostMapping("/login")
    public ResponseEntity<ChildAuthResponse> childLogin(@Valid @RequestBody ChildAuthRequest request) {
        ChildAuthResponse response = childAuthService.authenticateChild(request);
        return ResponseEntity.ok(response);
    }
}