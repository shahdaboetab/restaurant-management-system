package com.example.rms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rms.entity.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
    List<MenuItem> findByCategoryId(int categoryId);
}
