package com.pizza.domino.controller;

import com.pizza.domino.dto.AuthResponse;
import com.pizza.domino.dto.LoginRequest;
import com.pizza.domino.dto.RegisterRequest;
import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import com.pizza.domino.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthApiController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already taken");
        }

        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setFirstName(req.firstName());
        u.setLastName(req.lastName());
        u.setGender(req.gender());
        u.setPhone(req.phone());
        u.setAddress(req.address());
        u.setRole("USER");
        u.setCreatedAt(LocalDateTime.now());
        u.setPassword(passwordEncoder.encode(req.password()));

        User saved = userRepository.save(u);

        UserDetails ud = userDetailsService.loadUserByUsername(saved.getUsername());
        String token = jwtService.generateToken(ud);

        return new AuthResponse(token, saved.getId(), saved.getUsername(), saved.getRole());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.usernameOrEmail(), req.password())
        );
        UserDetails ud = userDetailsService.loadUserByUsername(req.usernameOrEmail());
        String token = jwtService.generateToken(ud);

        User u = userRepository.findByUsername(ud.getUsername())
                .orElseThrow(() -> new IllegalStateException("User missing after auth"));

        return new AuthResponse(token, u.getId(), u.getUsername(), u.getRole());
    }
}