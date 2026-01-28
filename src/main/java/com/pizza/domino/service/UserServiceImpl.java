package com.pizza.domino.service;

import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/users";

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User create(String firstName, String lastName, String username, String email, String password, String phone, String gender, String role, String address, MultipartFile image) throws Exception {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setGender(gender);
        user.setRole(role);
        user.setAddress(address);
        user.setImage(saveImage(username, image, null));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public User update(Long id, String firstName, String lastName, String username, String email, String password, String phone, String gender, String role, String address, MultipartFile image) throws Exception {
        User user = getById(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setGender(gender);
        user.setRole(role);
        user.setAddress(address);
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        if (image != null && !image.isEmpty()) {
            user.setImage(saveImage(username, image, user.getImage()));
        }
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        User user = getById(id);
        deleteOldImage(user.getImage());
        userRepository.deleteById(id);
    }

    private String saveImage(String username, MultipartFile image, String oldImage) {
        if (image != null && !image.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();
                String originalName = image.getOriginalFilename();
                String ext = (originalName != null && originalName.contains(".")) ? originalName.substring(originalName.lastIndexOf(".") + 1) : "png";
                String fileName = username + "_" + System.currentTimeMillis() + "." + ext;
                Path path = Paths.get(UPLOAD_DIR, fileName);
                Files.write(path, image.getBytes());
                if (oldImage != null && !oldImage.contains("/img/default-user.png")) {
                    deleteOldImage(oldImage);
                }

                return "/uploads/users/" + fileName;
            } catch (IOException e) {
                e.printStackTrace();
                return "/img/default-user.png";
            }
        }
        return oldImage != null ? oldImage : "/img/default-user.png";
    }

    private void deleteOldImage(String imagePath) {
        if (imagePath != null && !imagePath.contains("/img/default-user.png")) {
            try {
                Path oldPath = Paths.get(UPLOAD_DIR, new File(imagePath).getName());
                Files.deleteIfExists(oldPath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}