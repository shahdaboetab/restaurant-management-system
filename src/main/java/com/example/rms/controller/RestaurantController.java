package com.example.rms.controller;

import com.example.rms.entity.Restaurant;
import com.example.rms.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/restaurants") 
public class RestaurantController {

    private final RestaurantService service;

    public RestaurantController(RestaurantService service) {
        this.service = service;
    }

    @GetMapping
    public List<Restaurant> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Restaurant add(@RequestBody Restaurant restaurant) {
        return service.add(restaurant);
    }
}