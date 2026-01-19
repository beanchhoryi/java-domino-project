package com.pizza.domino.service;

import com.pizza.domino.model.Product;
import java.util.List;

public interface ProductService {

    // ✅ ADD THESE METHODS

    // Get all products
    List<Product> getAll();

    // Get product by ID
    Product getById(Long id);

    // Create new product
    Product create(Product product);

    // Update existing product
    Product update(Long id, Product product);

    // Delete product
    void delete(Long id);

    // ✅ ADD THIS MISSING METHOD
    long count();

    // Optional: Other methods you might need
    List<Product> findByCategoryId(Long categoryId);
    List<Product> searchByName(String keyword);
}