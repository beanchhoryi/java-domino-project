package com.pizza.domino.service;

import com.pizza.domino.model.Product;
import com.pizza.domino.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = getById(id);
        existing.setProductName(product.getProductName());
        existing.setPrice(product.getPrice());
        existing.setStockQty(product.getStockQty());
        existing.setDescription(product.getDescription());
        existing.setImage(product.getImage());
        existing.setCategory(product.getCategory());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}