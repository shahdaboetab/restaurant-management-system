package com.example.rms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.rms.dto.OrderRequest;
import com.example.rms.entity.Order;
import com.example.rms.entity.OrderItem;
import com.example.rms.service.OrderService;
@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired 
    private OrderService orderServiceObj;

    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderRequest request){
        return orderServiceObj.createOrder(request);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable int id){
        return orderServiceObj.getOrderById(id);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderServiceObj.getAllOrders();
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable int id, @RequestParam String status) {
        return orderServiceObj.updateOrderStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void cancelOrder(@PathVariable int id) {
        orderServiceObj.cancelOrder(id);
    }

    @PostMapping("/{id}/addItem")
    public Order addItem(@PathVariable int id, @RequestBody OrderItem item) {
        return orderServiceObj.addItemToOrder(id, item);
    }
}
