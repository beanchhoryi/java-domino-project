package com.pizza.domino.repository;

import com.pizza.domino.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    List<Product> findByProductNameContainingIgnoreCase(String productName);

    List<Product> findByStockQtyGreaterThan(int stock);

    List<Product> findByPriceBetween(double minPrice, double maxPrice);
}