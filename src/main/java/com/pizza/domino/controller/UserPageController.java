package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/users")
public class UserPageController {

    @GetMapping
    public String index() {
        return "admin/users/index";
    }

    @GetMapping("/create")
    public String create() {
        return "admin/users/create";
    }

    @GetMapping("/update/{id}")
    public String update(@PathVariable Long id, Model model) {
        model.addAttribute("userId", id);
        return "admin/users/update";
    }
}