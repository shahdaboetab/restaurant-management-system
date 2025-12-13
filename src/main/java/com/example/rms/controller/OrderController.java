package com.example.rms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.example.rms.entity.OrderStatus;
import com.example.rms.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired 
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable int id) {
        return orderService.getOrderById(id);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable int id,
            @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(id, status.name());
    }

    @PutMapping("/{id}/cancel")
    public void cancelOrder(@PathVariable int id) {
        orderService.cancelOrder(id);
    }

    @PostMapping("/{id}/items")
    public Order addItem(
            @PathVariable int id,
            @RequestBody OrderItem item) {
        return orderService.addItemToOrder(id, item);
    }

    @PutMapping("/{id}/assign")
    public Order assignStaff(
            @PathVariable int id,
            @RequestParam int staffId) {
        return orderService.assignOrderToStaff(id, staffId);
    }

    @GetMapping("/customer/{id}")
    public List<Order> getCustomerOrders(@PathVariable int id) {
        return orderService.getOrderByUser(id);
    }

}
