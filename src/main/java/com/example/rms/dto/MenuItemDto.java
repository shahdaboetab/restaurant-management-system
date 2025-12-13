package com.example.rms.dto;

import com.example.rms.entity.MenuItem;

public class MenuItemDto {
    private int id;
    private String name;
    private String description;
    private Double price;
    private int categoryId; 


    public MenuItemDto() {
    }

    public MenuItemDto(int id, String name, String description, Double price, int categoryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
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

    public Double getPrice() {
        return this.price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public int getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }    


    public static MenuItemDto fromEntityToDto(MenuItem entity) {
        MenuItemDto dto = new MenuItemDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setCategoryId(entity.getCategory().getId());
        return dto;
    }

    public MenuItem fromDtoToEntity() {
        MenuItem entity = new MenuItem();
        entity.setId(this.id);
        entity.setName(this.name);
        entity.setDescription(this.description);
        entity.setPrice(this.price);
        return entity;
    }

}