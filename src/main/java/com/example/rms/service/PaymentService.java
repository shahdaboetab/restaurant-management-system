package com.example.rms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.rms.entity.Order;
import com.example.rms.entity.OrderStatus;
import com.example.rms.entity.Payment;
import com.example.rms.entity.PaymentStatus;
import com.example.rms.repository.OrderRepo;
import com.example.rms.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Payment processPayment(int orderId, String paymentMethod) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        if (order.getStatus() == OrderStatus.CANCELED) {
            throw new RuntimeException("Cannot pay for a canceled order");
        }
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Order is already paid!");
        }

        Payment payment = new Payment();
        payment.setAmount(order.getTotalPrice());
        payment.setStatus(PaymentStatus.PAID);
        payment.setOrder(order);
        
        Payment savedPayment = paymentRepository.save(payment);

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentMethod(paymentMethod);
        

        Order updatedOrder = orderRepo.save(order);

        messagingTemplate.convertAndSend("/topic/orders/" + orderId, updatedOrder);

        return savedPayment;
    }
}