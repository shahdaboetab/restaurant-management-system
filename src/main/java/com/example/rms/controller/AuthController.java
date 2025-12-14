package com.example.rms.controller;

import com.example.rms.dto.AuthResponse;
import com.example.rms.dto.LoginRequest;
import com.example.rms.dto.RegisterRequest;
import com.example.rms.entity.Role; 
import com.example.rms.service.AuthService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid; 

@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        Role role = Role.valueOf(req.getRole().trim().toUpperCase());
        authService.register(req.getUsername(), req.getPassword(), req.getEmail(), role);
        return "Registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        String token = authService.login(req.getUsername(), req.getPassword());
        String role = authService.getUserRole(req.getUsername()); 
        return new AuthResponse(token, role);
    }

    @GetMapping("/me")
    public String me() {
        return "You are authenticated ✅";
    }
}