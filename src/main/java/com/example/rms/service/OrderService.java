package com.example.rms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.rms.dto.OrderRequest;
import com.example.rms.entity.MenuItem;
import com.example.rms.entity.Order;
import com.example.rms.entity.OrderItem;
import com.example.rms.entity.OrderStatus;
import com.example.rms.entity.PaymentStatus;
import com.example.rms.repository.MenuItemRepository;
import com.example.rms.repository.OrderRepo;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Order createOrder(OrderRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create an empty order.");
        }

        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setPaymentMethod(request.getPaymentMethod());

        for (OrderItem item : request.getItems()) {
            
            if (item.getMenuItemId() == null) {
                 throw new RuntimeException("Menu Item ID is required!");
            }

            MenuItem realItem = menuItemRepository.findById(item.getMenuItemId())
                  .orElseThrow(() -> new RuntimeException("Item not found in menu! ID: " + item.getMenuItemId()));

            item.setProductname(realItem.getName()); 
            item.setPrice(realItem.getPrice());      

    
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be > 0");
            }
            item.setOrder(order);
        }

        order.setItems(request.getItems());
        
        order.setTotalPrice(calculateTotalPrice(order)); 

        Order savedOrder = orderRepo.save(order);
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);

        return savedOrder;
    }

   /*  public Order processPayment(int orderId, String paymentMethod) {
        Order order = getOrderById(orderId);

        if (order.getStatus() == OrderStatus.CANCELED) {
            throw new RuntimeException("Cannot pay for a canceled order!");
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        if(paymentMethod != null && !paymentMethod.isEmpty()) {
            order.setPaymentMethod(paymentMethod);
        }
        
        return orderRepo.save(order);
    } */

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
        Order updatedOrder = orderRepo.save(order);
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, updatedOrder);
        return updatedOrder;
    }

    public void cancelOrder(int orderId) {
        Order order = getOrderById(orderId);
        order.setStatus(OrderStatus.CANCELED);
        Order saved = orderRepo.save(order);
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, saved);
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
            if (item.getItemId() != null && item.getItemId().equals(itemId)) {
                item.setQuantity(newQuantity);
            }
        }
        order.setTotalPrice(calculateTotalPrice(order));
        return orderRepo.save(order);
    }

    public Order removeItemFromOrder(int orderId, int itemId) {
       Order order = getOrderById(orderId);
        order.getItems().removeIf(item -> item.getItemId() != null && item.getItemId().equals(itemId));
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
