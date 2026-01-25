package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

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
}