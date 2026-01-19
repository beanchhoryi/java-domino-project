package com.pizza.domino.controller;

import com.pizza.domino.model.Category;
import com.pizza.domino.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@PreAuthorize("hasRole('ADMIN')")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
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
}