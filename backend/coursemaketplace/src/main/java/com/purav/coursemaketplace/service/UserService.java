package com.purav.coursemaketplace.service;


import com.purav.coursemaketplace.dto.response.AuthResponse;
import com.purav.coursemaketplace.dto.request.LoginRequest;
import com.purav.coursemaketplace.dto.request.RegisterRequest;
import com.purav.coursemaketplace.entity.User;
import com.purav.coursemaketplace.entity.Role;
import com.purav.coursemaketplace.exception.BadRequestException;
import com.purav.coursemaketplace.exception.ResourceNotFoundException;
import com.purav.coursemaketplace.repository.UserRepository;
import com.purav.coursemaketplace.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public String registerUser(RegisterRequest request){

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(encodedPassword);
        
        // Map the string role to the Role enum
        if (request.getRole() != null) {
            String requestedRole = request.getRole().toUpperCase();
            if (requestedRole.contains("INSTRUCTOR")) {
                user.setRole(Role.ROLE_INSTRUCTOR);
            } else if (requestedRole.contains("ADMIN")) {
                user.setRole(Role.ROLE_ADMIN);
            } else {
                user.setRole(Role.ROLE_LEARNER);
            }
        } else {
            user.setRole(Role.ROLE_LEARNER); // Default role
        }

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse loginUser(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token, "Login successful");
    }
}

