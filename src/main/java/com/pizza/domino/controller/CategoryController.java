package com.pizza.domino.controller;

import com.pizza.domino.model.Category;
import com.pizza.domino.service.CategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ===================== MVC PAGES =====================

    // LIST PAGE
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String categoryList(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("countItem", categoryService.count());
        model.addAttribute("message", "");
        return "admin/category/index";
    }

    // CREATE PAGE
    @GetMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public String createCategory(Model model) {
        model.addAttribute("category", new Category());
        return "admin/category/create";
    }

    // SAVE - FIXED REDIRECT
    @PostMapping("/save")
    @PreAuthorize("hasRole('ADMIN')")
    public String saveCategory(@ModelAttribute Category category,
                               RedirectAttributes redirectAttributes) {

        // Simple validation - check if category name is not empty
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Category name is required!");
            return "redirect:/category/create";
        }

        try {
            categoryService.save(category);
            redirectAttributes.addFlashAttribute("message",
                    "Category saved successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Error saving category. It might already exist.");
        }

        return "redirect:/category";
    }

    // EDIT PAGE
    @GetMapping("/edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String editCategory(@PathVariable Long id, Model model) {
        Category category = categoryService.findById(id);
        model.addAttribute("category", category);
        return "admin/category/update";
    }

    // UPDATE - FIXED REDIRECT
    @PostMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateCategory(@PathVariable Long id,
                                 @ModelAttribute Category category) {
        Category old = categoryService.findById(id);
        old.setCategoryName(category.getCategoryName());
        old.setDescription(category.getDescription());
        categoryService.save(old);
        return "redirect:/category";  // ← CHANGED from /admin/category to /category
    }

    // DELETE - FIXED REDIRECT
    @GetMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return "redirect:/category";  // ← CHANGED from /admin/category to /category
    }

    // ===================== REST API =====================

    // GET ALL CATEGORIES - public API
    @GetMapping("/api")
    @ResponseBody
    public List<Category> getAllCategoriesApi() {
        return categoryService.findAll();
    }

    // GET CATEGORY BY ID - public API
    @GetMapping("/api/{id}")
    @ResponseBody
    public Category getCategoryByIdApi(@PathVariable Long id) {
        return categoryService.findById(id);
    }
}