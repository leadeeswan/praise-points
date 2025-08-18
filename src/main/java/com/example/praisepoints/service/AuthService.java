package com.example.praisepoints.service;

import com.example.praisepoints.dto.AuthRequest;
import com.example.praisepoints.dto.AuthResponse;
import com.example.praisepoints.dto.SignupRequest;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.repository.UserRepository;
import com.example.praisepoints.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        
        String jwt = jwtUtils.generateJwtToken(request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new AuthResponse(jwt, user.getEmail(), user.getName());
    }
    
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        System.out.println(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        String jwt = jwtUtils.generateJwtToken(savedUser.getEmail());
        
        return new AuthResponse(jwt, savedUser.getEmail(), savedUser.getName());
    }
}