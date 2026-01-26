package com.pizza.domino.controller;

import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProfileController {

    private final UserRepository userRepository;

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
}
