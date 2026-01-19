package com.pizza.domino.controller;

import com.pizza.domino.model.Category;
import com.pizza.domino.service.CategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/admin/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // LIST
    @GetMapping
    public String categoryList(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("countItem", categoryService.count());
        model.addAttribute("message", "");
        return "admin/category/index";
    }

    // CREATE PAGE
    @GetMapping("/create")
    public String categoryCreate(Model model) {
        model.addAttribute("category", new Category());
        return "admin/category/create";
    }

    // SAVE
    @PostMapping("/save")
    public String saveCategory(@ModelAttribute Category category) {
        categoryService.save(category);
        return "redirect:/admin/category";
    }

    // EDIT PAGE
    @GetMapping("/edit/{id}")
    public String categoryEdit(@PathVariable Long id, Model model) {
        model.addAttribute("category", categoryService.findById(id));
        return "admin/category/update";
    }

    // UPDATE
    @PostMapping("/update/{id}")
    public String updateCategory(@PathVariable Long id,
                                 @ModelAttribute Category category) {
        Category old = categoryService.findById(id);
        old.setCategoryName(category.getCategoryName());
        old.setDescription(category.getDescription());  // FIX: Add this line
        categoryService.save(old);
        return "redirect:/admin/category";
    }

    // DELETE
    @GetMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return "redirect:/admin/category";
    }
}