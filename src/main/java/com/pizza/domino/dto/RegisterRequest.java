package com.pizza.domino.dto;

public record RegisterRequest(
        String username,
        String email,
        String password,
        String firstName,
        String lastName,
        String gender,
        String phone,
        String address
) {}
