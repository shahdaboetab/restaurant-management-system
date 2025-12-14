package com.example.rms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private StorageService storageService;

    public MenuItemDto createMenuItem(int categoryId, MenuItemDto dto, MultipartFile imageFile){
        Category category  = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        MenuItem item = dto.fromDtoToEntity();
        item.setCategory(category);

        String filename  = storageService.store(imageFile);
        String imageUrl = "/uploads/menuImages/" + filename;  // نفس اللي في WebConfig
        item.setImageUrl(imageUrl);

        MenuItem saved = menuItemRepository.save(item);
        return MenuItemDto.fromEntityToDto(saved);
    }

    public List<MenuItemDto> getAllMenuItems(){
        return menuItemRepository.findAll()
        .stream()
        .map(MenuItemDto::fromEntityToDto)
       .collect(Collectors.toList());
    }

    public List<MenuItemDto> getMenuItemByCategory(int categoryId){
        return menuItemRepository.findByCategoryId(categoryId)
                .stream()
                .map(MenuItemDto::fromEntityToDto)
                .collect(Collectors.toList());
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
        MenuItem item = menuItemRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Item not found"));
        
        String imageUrl = item.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
         try {
            String filename = Paths.get(imageUrl).getFileName().toString();
            Path imagePath = Paths.get("uploads/menuImages").resolve(filename);

            Files.deleteIfExists(imagePath); 
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
        menuItemRepository.deleteById(id);
    }
}
