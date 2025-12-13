package com.example.rms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rms.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
}
