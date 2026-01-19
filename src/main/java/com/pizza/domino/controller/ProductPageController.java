package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/products")

public class ProductPageController {

    @GetMapping
    public String index() {
        return "admin/products/index"; // src/main/resources/templates/products/index.html
    }

    @GetMapping("/create")
    public String create() {
        return "admin/products/create"; // src/main/resources/templates/products/create.html
    }

    @GetMapping("/update/{id}")
    public String update(@PathVariable Long id) {
        return "admin/products/update";
    }
}
