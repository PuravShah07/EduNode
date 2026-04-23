package com.purav.coursemaketplace.controller;

import com.purav.coursemaketplace.dto.response.AuthResponse;
import com.purav.coursemaketplace.dto.request.LoginRequest;
import com.purav.coursemaketplace.dto.request.RegisterRequest;
import com.purav.coursemaketplace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    
    public AuthController(UserService userService) {  
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(userService.loginUser(request));
    }
}
