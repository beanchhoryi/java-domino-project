package com.pizza.domino.dto;

public record LoginRequest(
        String usernameOrEmail,
        String password
) {}
