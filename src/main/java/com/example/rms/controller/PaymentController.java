package com.example.rms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.rms.entity.Payment;
import com.example.rms.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {   

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/{orderId}/pay")
    public Payment payOrder(
            @PathVariable int orderId, 
            @RequestParam String method) {
        
        return paymentService.processPayment(orderId, method);
    }
}