package com.example.rms.dto;

import java.util.List;

import com.example.rms.entity.OrderItem;

public class OrderRequest {

    private Integer customerId; 
    
    private List<OrderItem> items;

    public OrderRequest() {
    }

    public Integer getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public List<OrderItem> getItems() {
        return this.items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}