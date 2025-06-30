package com.url.shortener.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.url.shortener.dtos.LoginRequest;
import com.url.shortener.dtos.RegisterRequest;
import com.url.shortener.models.User;
import com.url.shortener.security.jwt.JwtAuthenticationResponse;
import com.url.shortener.services.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        try {
            logger.info("Login attempt for user: {}", loginRequest.getUsername());
            JwtAuthenticationResponse response = userService.authenticateUser(loginRequest);
            logger.info("Login successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        try {
            logger.info("Registration attempt for username: {}", registerRequest.getUsername());
            
            // Check if username already exists
            boolean usernameExists = userService.existsByUsername(registerRequest.getUsername());
            logger.info("Username exists check: {} for username: {}", usernameExists, registerRequest.getUsername());
            
            if (usernameExists) {
                logger.warn("Registration failed: Username already exists: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body("Username already exists!");
            }
            
            // Check if email already exists
            boolean emailExists = userService.existsByEmail(registerRequest.getEmail());
            logger.info("Email exists check: {} for email: {}", emailExists, registerRequest.getEmail());
            
            if (emailExists) {
                logger.warn("Registration failed: Email already exists: {}", registerRequest.getEmail());
                return ResponseEntity.badRequest().body("Email already exists!");
            }
            
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(registerRequest.getPassword());
            user.setEmail(registerRequest.getEmail());
            user.setRole("ROLE_USER");
            
            User savedUser = userService.registerUser(user);
            logger.info("User registered successfully: {}", savedUser.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            logger.error("Registration failed with exception", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }
}
