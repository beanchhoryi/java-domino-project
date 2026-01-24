package com.pizza.domino.service;

import com.pizza.domino.model.Product;
import com.pizza.domino.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public abstract class ProductService {

    private final ProductRepository productRepository;

    // ===== STANDARD CRUD (FOR REST API) =====

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    public abstract List<Product> getAll();

    public abstract Product getById(Long id);

    public abstract Product create(Product product);

    public abstract Product update(Long id, Product product);

    public abstract void delete(Long id);

    public abstract long count();

    // Optional additional methods
    public abstract List<Product> findByCategoryId(Long categoryId);

    public abstract List<Product> searchByName(String keyword);

    // ===== KEEP OLD METHODS (DO NOT REMOVE) =====
    // If your teammates are using them elsewhere
}
