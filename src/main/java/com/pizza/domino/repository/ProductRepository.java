package com.pizza.domino.repository;

import com.pizza.domino.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Custom query to find products by category
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    // Search by product name
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // Find products in stock (stock > 0)
    List<Product> findByStockQtyGreaterThan(int stock);

    // Find products by price range
    List<Product> findByPriceBetween(double minPrice, double maxPrice);
}