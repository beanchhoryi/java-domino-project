package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/users")
public class UserPageController {

    @GetMapping("/users")
    public String usersPage() {
        return "admin/users/dashboard";
    }

    @GetMapping
    public String index() {
        return "admin/users/index"; // this points to src/main/resources/templates/users/index.html
    }

    @GetMapping("/create")
    public String create() {
        return "admin/users/create"; // src/main/resources/templates/users/create.html
    }

    @GetMapping("/update/{id}")
    public String update(@PathVariable Long id) {
        return "admin/users/update";
    }
}
