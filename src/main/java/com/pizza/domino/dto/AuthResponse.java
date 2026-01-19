package com.pizza.domino.dto;

public record AuthResponse(
        String token,
        Long userId,
        String username,
        String role
) {}
