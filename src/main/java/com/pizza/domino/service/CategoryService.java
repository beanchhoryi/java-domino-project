package com.pizza.domino.service;

import com.pizza.domino.model.Category;
import java.util.List;

public interface CategoryService {

    List<Category> findAll();

    Category findById(Long id);

    Category save(Category category);

    void deleteById(Long id);

    long count();
}
