package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/products")
public class ProductPageController {

    // Redirect old /products to new /admin/products
    @GetMapping
    public String redirectToAdminProducts() {
        return "redirect:/admin/products";
    }

    // Redirect old /products/create to new /admin/products/create
    @GetMapping("/create")
    public String redirectToCreate() {
        return "redirect:/admin/products/create";
    }

    // Redirect old /products/update/{id} to new /admin/products/edit/{id}
    @GetMapping("/update/{id}")
    public String redirectToUpdate() {
        return "redirect:/admin/products";
    }
}