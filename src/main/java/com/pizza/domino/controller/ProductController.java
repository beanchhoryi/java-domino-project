package com.pizza.domino.controller;

import com.pizza.domino.model.Product;
import com.pizza.domino.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {  // ← REMOVED: class-level @PreAuthorize

    private final ProductService productService;

    // Public endpoint - accessible to all authenticated users (but will filter in service)
    @GetMapping("/public")
    public List<Product> getPublicProducts() {
        return productService.findPublicProducts();  // We'll implement this method
    }

    // Admin-only endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")  // ← MOVED: from class level to method level
    public List<Product> getAll() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Product getById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public Product create(
            @RequestPart("product") Product product,
            @RequestPart("image") MultipartFile image
    ) throws Exception {
        return productService.create(product, image);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public Product update(
            @PathVariable Long id,
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {
        return productService.update(id, product, image);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}