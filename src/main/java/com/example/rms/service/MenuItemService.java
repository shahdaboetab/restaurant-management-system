package com.example.rms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
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

    private static final String UPLOAD_DIR = "uploads/menuImages/";

    public MenuItemDto createMenuItem(MenuItemDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                              .orElseThrow(() -> new RuntimeException("Category not found"));

        MenuItem item = new MenuItem.Builder()
                        .name(dto.getName())
                        .description(dto.getDescription())
                        .price(dto.getPrice())
                        .category(category)
                        .imageUrl(dto.getImageUrl())
                        .build();

        MenuItem saved = menuItemRepository.save(item);
        return MenuItemDto.fromEntityToDto(saved);
    }

    public MenuItemDto createMenuItemWithFile(String name, String description, Double price, Integer categoryId, MultipartFile imageFile) {
        Category category = categoryRepository.findById(categoryId)
                              .orElseThrow(() -> new RuntimeException("Category not found"));

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = saveImageFile(imageFile);
        }

        MenuItem item = new MenuItem.Builder()
                        .name(name)
                        .description(description)
                        .price(price)
                        .category(category)
                        .imageUrl(imageUrl)
                        .build();

        MenuItem saved = menuItemRepository.save(item);
        return MenuItemDto.fromEntityToDto(saved);
    }

    private String saveImageFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            return "/uploads/menuImages/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file", e);
        }
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

        if (newData.getCategoryId() != 0) {
            Category category = categoryRepository.findById(newData.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(category);
        }

        if (newData.getImageUrl() != null) {
            item.setImageUrl(newData.getImageUrl());
        }

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
