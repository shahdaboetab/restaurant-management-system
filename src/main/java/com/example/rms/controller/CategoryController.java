package com.example.rms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rms.dto.CategoryDto;
import com.example.rms.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryDto> getAll(){
        return categoryService.getAllCategories();
    }

    @PostMapping
    public CategoryDto create(@RequestBody CategoryDto c){
        return categoryService.createCategory(c);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable int id){
        categoryService.deleteCategory(id);
    }

    @PutMapping("{id}")
    public CategoryDto update(@PathVariable int id, @RequestBody CategoryDto c){
        return categoryService.updateCategory(id, c);
    }

}
