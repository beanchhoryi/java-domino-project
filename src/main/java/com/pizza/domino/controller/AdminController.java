package com.pizza.domino.controller;

import com.pizza.domino.model.Category;
import com.pizza.domino.repository.CategoryRepository;
import com.pizza.domino.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AdminController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String dashboard() {
        return "admin/dashboard";
    }

}
