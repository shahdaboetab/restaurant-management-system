package com.example.rms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rms.entity.Order;
import com.example.rms.entity.OrderStatus;

public interface OrderRepo extends JpaRepository<Order,Integer> {

    List<Order> findByCustomerId(int customerId);
    List<Order> findByStatus(OrderStatus status);
}

