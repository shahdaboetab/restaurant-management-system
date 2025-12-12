package com.example.rms.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.rms.dto.OrderRequest;
import com.example.rms.entity.Order;
import com.example.rms.entity.OrderItem;
import com.example.rms.repository.OrderRepo;


@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    public Order createOrder(OrderRequest request){
        
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setItems(request.getItems());
        order.setStatus("Pending....");

        // paymentt logic

        return orderRepo.save(order);
    }

    public Order getOrderById(int orderId){

        return orderRepo.findById(orderId)
            .orElseThrow(()->new RuntimeException("Order not found!"));
    }

    public List<Order> getAllOrders(){
        return orderRepo.findAll();
    }

    public Order updateOrder(OrderRequest request){
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setItems(request.getItems());
        order.setStatus("Pending....");

        // update payment logic 

        return orderRepo.save(order); // overwrite 3la el haga el mawgouda
    }

    public Order updateOrderStatus(int orderId, String status){
        
        Order order = getOrderById(orderId);
        order.setStatus(status);

        return orderRepo.save(order);
    }   

    public void cancelOrder(int orderId){

        Order order = getOrderById(orderId);
        order.setStatus("CANCELED");
        orderRepo.save(order);
        //orderRepo.deleteById(orderId);
    }
    
    public Order addItemToOrder(int orderid, OrderItem newItem){

        Order order = getOrderById(orderid);
        order.getItems().add(newItem);
        return orderRepo.save(order);

    }

    public Order updateItemQuantity(int orderid,int itemid,int new_quantity)
    {
        Order order = getOrderById(orderid);
        for(OrderItem item : order.getItems()){
            if(item.getItemId() == itemid){
                item.setQuantity(new_quantity);
            }
        }
        return orderRepo.save(order);
    }

    public Order removeItemFromOrder(int orderId,int itemid){

        Order order = getOrderById(orderId);
        order.getItems().removeIf(i -> i.getItemId() == (itemid));

        return orderRepo.save(order);
    }

    public List<Order> getOrderyUser(int userId){

        return orderRepo.findByCustomerId(userId);
    }

    public List<Order> getOrderByStatus(String status){

        return orderRepo.findByStatus(status);
    }
    

}
