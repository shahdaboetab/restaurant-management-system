package com.example.rms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rms.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Payment findByOrderOrderId(Integer orderId);
}