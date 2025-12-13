package com.example.rms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rms.entity.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {

}