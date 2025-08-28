package com.example.praisepoints.service;

import com.example.praisepoints.dto.ChildRequest;
import com.example.praisepoints.dto.ChildResponse;
import com.example.praisepoints.entity.Child;
import com.example.praisepoints.entity.User;
import com.example.praisepoints.exception.DuplicateUsernameException;
import com.example.praisepoints.repository.ChildRepository;
import com.example.praisepoints.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChildService {
    
    @Autowired
    private ChildRepository childRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ChildResponse> getChildrenByCurrentUser() {
        User currentUser = getCurrentUser();
        List<Child> children = childRepository.findByUserIdOrderByCreatedAtAsc(currentUser.getId());
        return children.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ChildResponse createChild(ChildRequest request) {
        User currentUser = getCurrentUser();
        
        // username 중복 체크
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String trimmedUsername = request.getUsername().trim();
            if (childRepository.existsByUsername(trimmedUsername)) {
                throw new DuplicateUsernameException("이미 사용 중인 아이 로그인 아이디입니다.");
            }
        }
        
        Child child = new Child();
        child.setUser(currentUser);
        child.setName(request.getName());
        child.setBirthDate(request.getBirthDate());
        child.setProfileImage(request.getProfileImage());
        child.setUsername(request.getUsername() != null ? request.getUsername().trim() : null);
        child.setAuthKey(request.getAuthKey());
        child.setTotalPoints(0);
        
        try {
            Child savedChild = childRepository.save(child);
            return convertToResponse(savedChild);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateUsernameException("이미 사용 중인 아이 로그인 아이디입니다.");
        }
    }
    
    public ChildResponse updateChild(Long childId, ChildRequest request) {
        Child child = getChildByIdAndCurrentUser(childId);
        
        // username 중복 체크 (현재 아이의 username과 다른 경우에만)
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String trimmedUsername = request.getUsername().trim();
            if (!trimmedUsername.equals(child.getUsername()) && 
                childRepository.existsByUsername(trimmedUsername)) {
                throw new DuplicateUsernameException("이미 사용 중인 아이 로그인 아이디입니다.");
            }
        }
        
        child.setName(request.getName());
        child.setBirthDate(request.getBirthDate());
        child.setProfileImage(request.getProfileImage());
        child.setUsername(request.getUsername() != null ? request.getUsername().trim() : null);
        child.setAuthKey(request.getAuthKey());
        
        try {
            Child savedChild = childRepository.save(child);
            return convertToResponse(savedChild);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateUsernameException("이미 사용 중인 아이 로그인 아이디입니다.");
        }
    }
    
    public void deleteChild(Long childId) {
        Child child = getChildByIdAndCurrentUser(childId);
        childRepository.delete(child);
    }
    
    public ChildResponse getChildById(Long childId) {
        Child child = getChildByIdAndCurrentUser(childId);
        return convertToResponse(child);
    }
    
    private ChildResponse convertToResponse(Child child) {
        return new ChildResponse(
                child.getId(),
                child.getName(),
                child.getBirthDate(),
                child.getProfileImage(),
                child.getUsername(),
                child.getAuthKey(),
                child.getTotalPoints(),
                child.getCreatedAt()
        );
    }
    
    private Child getChildByIdAndCurrentUser(Long childId) {
        User currentUser = getCurrentUser();
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found with id: " + childId));
        
        if (!child.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return child;
    }
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}