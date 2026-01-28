package com.pizza.domino.service;

import com.pizza.domino.model.Product;
import com.pizza.domino.repository.CategoryRepository;
import com.pizza.domino.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import java.nio.file.*;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private static final String UPLOAD_DIR = "uploads/products";

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Product create(Product product, MultipartFile image) throws Exception {
        product.setImageUrl(saveImage(image));
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product, MultipartFile image) throws Exception {
        Product old = findById(id);

        old.setProductName(product.getProductName());
        old.setDescription(product.getDescription());
        old.setPrice(product.getPrice());
        old.setStockQty(product.getStockQty());
        old.setCategory(product.getCategory());

        if (image != null && !image.isEmpty()) {
            deleteOldImage(old.getImageUrl());
            old.setImageUrl(saveImage(image));
        }

        return productRepository.save(old);
    }

    @Override
    public void delete(Long id) {
        Product product = findById(id);
        deleteOldImage(product.getImageUrl());
        productRepository.deleteById(id);
    }

    @Override
    public long count() {
        return productRepository.count();
    }

    private String saveImage(MultipartFile image) throws Exception {
        if (image == null || image.isEmpty()) return null;

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, filename);

        Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/products/" + filename;
    }

    private void deleteOldImage(String imageUrl) {
        if (imageUrl == null) return;

        Path path = Paths.get(imageUrl.replace("/uploads/", "uploads/"));
        try {
            Files.deleteIfExists(path);
        } catch (Exception ignored) {}
    }
}
