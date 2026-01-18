package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/menu")
    public String menu() {
        return "pages/menu";
    }

    @GetMapping("/cart")
    public String cart() {
        return "pages/cart";
    }

    @GetMapping("/contacts")
    public String contact() {
        return "pages/contact";
    }

    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("error", "");
        model.addAttribute("message", "");
        return "pages/login";
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("error", "");
        model.addAttribute("success", "");
        model.addAttribute("email", "");
        model.addAttribute("firstName", "");
        model.addAttribute("phone", "");
        model.addAttribute("gender", "");
        return "pages/register";
    }

    @GetMapping("/profile/settings")
    public String profileSettings() {
        return "pages/profile_settings";
    }
}