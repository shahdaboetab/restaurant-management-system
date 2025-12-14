package com.example.rms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.rms.dto.CategoryDto;
import com.example.rms.entity.Category;
import com.example.rms.repository.CategoryRepository;


@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryDto createCategory(CategoryDto dto) {
        Category entity = dto.fromDtoToEntity();
        Category saved = categoryRepository.save(entity);
        return CategoryDto.fromEntityToDto(saved);
    }

    public List<CategoryDto> getAllCategories(){
        return categoryRepository.findAll()
        .stream()
        .map(CategoryDto::fromEntityToDto)
        .collect(Collectors.toList());
    }

    public CategoryDto updateCategory(int id, CategoryDto newCategory){
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(newCategory.getName());
        category.setDescription(newCategory.getDescription());
        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntityToDto(updated);
    }

    public void deleteCategory(int id){
        categoryRepository.deleteById(id);
    }
}
