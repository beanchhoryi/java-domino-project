package com.pizza.domino.service;

import com.pizza.domino.model.Category;
import com.pizza.domino.repository.CategoryRepository;
import com.pizza.domino.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category save(Category category) {
        // Check if category with same name already exists
        if (category.getId() == null) { // New category
            List<Category> allCategories = categoryRepository.findAll();
            for (Category existing : allCategories) {
                if (existing.getCategoryName().equalsIgnoreCase(category.getCategoryName())) {
                    // Update existing instead of creating duplicate
                    existing.setDescription(category.getDescription());
                    return categoryRepository.save(existing);
                }
            }
        }

        return categoryRepository.save(category);
    }

    @Override
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public long count() {
        return categoryRepository.count();
    }
}


