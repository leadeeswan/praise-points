package com.example.praisepoints.service;

import com.example.praisepoints.dto.ChildAuthRequest;
import com.example.praisepoints.dto.ChildAuthResponse;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.repository.ChildRepository;
import com.example.praisepoints.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChildAuthService {
    
    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private JwtUtils jwtUtils;
    
    public ChildAuthResponse authenticateChild(ChildAuthRequest request) {
        Child child = childRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or auth key"));
        
        if (child.getAuthKey() == null || !child.getAuthKey().equals(request.getAuthKey())) {
            throw new RuntimeException("Invalid username or auth key");
        }
        
        String token = jwtUtils.generateJwtToken("child_" + child.getId());
        return new ChildAuthResponse(
                token,
                child.getId(),
                child.getName(),
                child.getTotalPoints()
        );
    }
}