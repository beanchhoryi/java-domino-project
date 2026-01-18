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
    private final CategoryService categoryService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String dashboard() {
        return "admin/dashboard";
    }

    public AdminController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/category")
    public String categoryList(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("countItem", categoryService.count());
        return "admin/category/index";
    }

    @GetMapping("/category/create")
    public String categoryCreate() {
        return "admin/category/create";
    }

    @GetMapping("/category/edit/{id}")
    public String categoryEdit() {
        return "admin/category/update";
    }

    @GetMapping("/products")
    public String productList() {
        return "admin/product/index";
    }

    @GetMapping("/users")
    public String userList() {
        return "admin/user/index";
    }
}
