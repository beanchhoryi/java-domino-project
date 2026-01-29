package com.pizza.domino.controller;

import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
public class ProfileController {

    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = "uploads/users";

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public String profileSettings(
            @RequestParam(value = "tab", defaultValue = "info") String tab,
            Model model,
            HttpServletRequest request) {

        System.out.println("=== ProfileController ===");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Tab: " + tab);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return "redirect:/login";
        }

        try {
            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            model.addAttribute("user", user);
            model.addAttribute("tab", tab);

            return "pages/profile_settings";

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return "redirect:/login";
        }
    }

    // ADD THIS METHOD for updating profile
    @PostMapping("/profile/update")
    public String updateProfile(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update user fields
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setAddress(address);
            user.setPhone(phone);

            // Handle image upload
            if (image != null && !image.isEmpty()) {
                String imageUrl = saveUserImage(image);
                user.setImage(imageUrl);
            }

            userRepository.save(user);

            redirectAttributes.addFlashAttribute("message", "Profile updated successfully!");
            redirectAttributes.addFlashAttribute("messageType", "success");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "Error updating profile: " + e.getMessage());
            redirectAttributes.addFlashAttribute("messageType", "error");
        }

        return "redirect:/profile?tab=info";
    }

    private String saveUserImage(MultipartFile image) throws Exception {
        if (image == null || image.isEmpty()) return null;

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, filename);

        Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/users/" + filename;
    }
}