package com.pizza.domino.controller;

import com.pizza.domino.model.Product;
import com.pizza.domino.service.ProductService;
import com.pizza.domino.service.CategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/products")
public class ProductPageController {

    private final ProductService productService;
    private final CategoryService categoryService;

    public ProductPageController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String productsPage(Model model) {
        model.addAttribute("products", productService.findAll());
        model.addAttribute("countItem", productService.count());
        model.addAttribute("message", "");
        return "admin/products/index";
    }

    @GetMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public String createProductPage(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryService.findAll());
        return "admin/products/create";
    }

    @GetMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateProductPage(@PathVariable Long id, Model model) {
        Product product = productService.findById(id);
        model.addAttribute("product", product);
        model.addAttribute("categories", categoryService.findAll());
        return "admin/products/update";
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('ADMIN')")
    public String saveProduct(
            @ModelAttribute Product product,
            @RequestParam("image") MultipartFile image
    ) throws Exception {

        productService.create(product, image);
        return "redirect:/products";
    }

    @PostMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateProduct(
            @PathVariable Long id,
            @ModelAttribute Product product,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws Exception {

        productService.update(id, product, image);
        return "redirect:/products";
    }


    @GetMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return "redirect:/products";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<Product> getAllProductsApi() {
        return productService.findAll();
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public Product getProductByIdApi(@PathVariable Long id) {
        return productService.findById(id);
    }
}