package com.example.rms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rms.dto.CategoryDto;
import com.example.rms.dto.MenuItemDto;
import com.example.rms.service.CategoryService;
import com.example.rms.service.MenuItemService;

@RestController
@RequestMapping("/api/customer/menu")
public class CustomerMenuController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("/categories")
    public List<CategoryDto> getCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/categories/{categoryId}/items")
    public List<MenuItemDto> getItemsByCategory(@PathVariable int categoryId) {
        return menuItemService.getMenuItemByCategory(categoryId);
    }
}


