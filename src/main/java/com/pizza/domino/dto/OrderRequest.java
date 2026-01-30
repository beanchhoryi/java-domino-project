package com.pizza.domino.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private CustomerInfo customerInfo;
    private Double subtotal;
    private Double tax;
    private Double total;

    // Inner class for customer info
    public static class CustomerInfo {
        private String name;
        private String phone;
        private String address;

        // Constructors
        public CustomerInfo() {}

        public CustomerInfo(String name, String phone, String address) {
            this.name = name;
            this.phone = phone;
            this.address = address;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    // Getters and Setters for OrderRequest
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public CustomerInfo getCustomerInfo() { return customerInfo; }
    public void setCustomerInfo(CustomerInfo customerInfo) { this.customerInfo = customerInfo; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}