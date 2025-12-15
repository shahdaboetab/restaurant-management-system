package com.example.rms.dto;

import java.util.List;

public class OrderRequest {

    private Integer customerId;
    private String paymentMethod;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public Integer getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<OrderItemRequest> getItems() {
        return this.items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}