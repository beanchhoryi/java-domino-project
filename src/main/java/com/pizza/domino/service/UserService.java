package com.pizza.domino.service;

import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateRole(Long id, String role) {

        if (!role.equals("ROLE_ADMIN") &&
                !role.equals("ROLE_USER")) {
            throw new IllegalArgumentException("Invalid role");
        }

        User user = findById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}