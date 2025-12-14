package com.example.rms.service;

import com.example.rms.entity.Restaurant;
import com.example.rms.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository repo;

    public RestaurantService(RestaurantRepository repo) {
        this.repo = repo;
    }

    public List<Restaurant> getAll() {
        return repo.findAll();
    }

    public Restaurant add(Restaurant restaurant) {
        return repo.save(restaurant);
    }
}