package com.pizza.domino.service;

import com.pizza.domino.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    List<User> getAll();

    User getById(Long id);

    User create(
            String firstName,
            String lastName,
            String username,
            String email,
            String password,
            String phone,
            String gender,
            String role,
            String address,
            MultipartFile image
    ) throws Exception;

    User update(
            Long id,
            String firstName,
            String lastName,
            String username,
            String email,
            String password,
            String phone,
            String gender,
            String role,
            String address,
            MultipartFile image
    ) throws Exception;

    void delete(Long id);
}
