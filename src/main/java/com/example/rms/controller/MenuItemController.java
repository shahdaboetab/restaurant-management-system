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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.rms.dto.MenuItemDto;
import com.example.rms.service.MenuItemService;


@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping
    public List<MenuItemDto> getAll(){
        return menuItemService.getAllMenuItems();
    }

    @PostMapping("/{categoryId}")
    public MenuItemDto create(@PathVariable int categoryId, @RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("price") Double price, @RequestParam("image") MultipartFile imageFile){
        MenuItemDto dto = new MenuItemDto();
        dto.setName(name);
        dto.setDescription(description);
        dto.setPrice(price);
        
        return menuItemService.createMenuItem(categoryId, dto, imageFile);
    }

    @GetMapping("/category/{categoryId}")
    public List<MenuItemDto> getByCategory(@PathVariable int categoryId){
        return menuItemService.getMenuItemByCategory(categoryId);
    }

    @PutMapping("/{id}")
    public MenuItemDto update(@PathVariable int id, @RequestBody MenuItemDto itemDto){
        return menuItemService.updateMenuItem(id, itemDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        menuItemService.deleteMenuItem(id);
    }
}
