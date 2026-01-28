package com.pizza.domino.controller;

import com.pizza.domino.model.User;
import com.pizza.domino.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User create(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String gender,
            @RequestParam String role,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            return userService.create(firstName, lastName, username, email, password,
                    phone, gender, role, address, image);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Create failed: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User update(
            @PathVariable Long id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String gender,
            @RequestParam String role,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            return userService.update(id, firstName, lastName, username, email,
                    password, phone, gender, role, address, image);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
