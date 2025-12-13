package com.example.rms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.rms.dto.OrderRequest;
import com.example.rms.entity.Order;
import com.example.rms.entity.OrderItem;
import com.example.rms.entity.OrderStatus;
import com.example.rms.entity.PaymentStatus;
import com.example.rms.repository.OrderRepo;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    public Order createOrder(OrderRequest request) {

        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setStatus(OrderStatus.PENDING);

        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setPaymentMethod(request.getPaymentMethod());


        for (OrderItem item : request.getItems()) {
            item.setOrder(order);
        }

        order.setItems(request.getItems());

        order.setTotalPrice(calculateTotalPrice(order));

        return orderRepo.save(order);
    }

    public Order getOrderById(int orderId) {
        return orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found!"));
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order updateOrderStatus(int orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return orderRepo.save(order);
    }

    public void cancelOrder(int orderId) {
        Order order = getOrderById(orderId);
        order.setStatus(OrderStatus.CANCELED);
        orderRepo.save(order);
    }

    public Order addItemToOrder(int orderId, OrderItem newItem) {
        Order order = getOrderById(orderId);

        newItem.setOrder(order);
        order.getItems().add(newItem);

        order.setTotalPrice(calculateTotalPrice(order));

        return orderRepo.save(order);
    }

    public Order updateItemQuantity(int orderId, int itemId, int newQuantity) {
        Order order = getOrderById(orderId);

        for (OrderItem item : order.getItems()) {
            if (item.getItemId() == itemId) {
                item.setQuantity(newQuantity);
            }
        }

        order.setTotalPrice(calculateTotalPrice(order));

        return orderRepo.save(order);
    }

    public Order removeItemFromOrder(int orderId, int itemId) {
        Order order = getOrderById(orderId);

        order.getItems().removeIf(item -> item.getItemId() == itemId);

        order.setTotalPrice(calculateTotalPrice(order));

        return orderRepo.save(order);
    }

    public List<Order> getOrderByUser(int userId) {
        return orderRepo.findByCustomerId(userId);
    }

    public List<Order> getOrderByStatus(String status) {
       return orderRepo.findByStatus(OrderStatus.valueOf(status.toUpperCase()));
    }

    private double calculateTotalPrice(Order order) {
    return order.getItems().stream()
        .mapToDouble(item -> item.getPrice() * item.getQuantity())
        .sum();
    }

    public Order assignOrderToStaff(int orderId, int staffId) {
    Order order = getOrderById(orderId);
    order.setStaffId(staffId);
    return orderRepo.save(order);
    }

}
