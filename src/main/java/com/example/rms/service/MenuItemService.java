package com.example.rms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.rms.dto.MenuItemDto;
import com.example.rms.entity.Category;
import com.example.rms.entity.MenuItem;
import com.example.rms.repository.CategoryRepository;
import com.example.rms.repository.MenuItemRepository;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public MenuItemDto createMenuItem(int categoryId, MenuItemDto dto){
        Category category  = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        MenuItem item = dto.fromDtoToEntity();
        item.setCategory(category);
        MenuItem saved = menuItemRepository.save(item);
        return MenuItemDto.fromEntityToDto(saved);
    }

    public List<MenuItemDto> getAllMenuItems(){
        return menuItemRepository.findAll()
        .stream()
        .map(MenuItemDto::fromEntityToDto)
        .toList();
    }

    public List<MenuItemDto> getMenuItemByCategory(int categoryId){
        return menuItemRepository.findByCategoryId(categoryId)
                .stream()
                .map(MenuItemDto::fromEntityToDto)
                .toList();
    }

    public MenuItemDto updateMenuItem(int id, MenuItemDto newData){
        MenuItem item = menuItemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setName(newData.getName());
        item.setDescription(newData.getDescription());
        item.setPrice(newData.getPrice());

        MenuItem updated = menuItemRepository.save(item);
        return MenuItemDto.fromEntityToDto(updated);
    }

    public void deleteMenuItem(int id){
        menuItemRepository.deleteById(id);
    }
}
