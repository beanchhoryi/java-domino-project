package com.pizza.domino.service;

import com.pizza.domino.model.Product;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {

    List<Product> findAll();

    List<Product> findPublicProducts();  // ← ADDED: New method for public access

    Product findById(Long id);

    Product create(Product product, MultipartFile image) throws Exception;

    Product update(Long id, Product product, MultipartFile image) throws Exception;

    void delete(Long id);

    long count();

}