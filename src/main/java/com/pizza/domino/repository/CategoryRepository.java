package com.pizza.domino.repository;

import com.pizza.domino.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long>{}
