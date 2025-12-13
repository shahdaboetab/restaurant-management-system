package com.example.rms.dto;

import com.example.rms.entity.Category;

public class CategoryDto {
    private int id;
    private String name;
    private String description;

    public CategoryDto() {
    }

    public CategoryDto(String name, String description) {
        this.name = name;
        this.description = description;
    }


    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public static CategoryDto fromEntityToDto(Category entity) {
        CategoryDto dto = new CategoryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    public Category fromDtoToEntity() {
        Category entity = new Category();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setDescription(this.description);
        return entity;
    }
}

