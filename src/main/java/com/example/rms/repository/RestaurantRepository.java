package com.example.rms.repository;

import java.util.List;

import com.example.rms.entity.Restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
     List<Restaurant> findByCity(String city);
}