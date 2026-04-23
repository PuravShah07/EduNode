package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.UserProfileDto;
import com.purav.coursemaketplace.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        UserProfileDto profile = UserProfileDto.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .role(currentUser.getRole())
                .build();
                
        return ResponseEntity.ok(profile);
    }
}
