package com.pizza.domino.controller;

import com.pizza.domino.model.*;
import com.pizza.domino.repository.InvoiceRepository;
import com.pizza.domino.repository.InvoiceItemRepository;
import com.pizza.domino.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/create-invoice")
public class InvoiceController {

    private static final Logger log = LoggerFactory.getLogger(InvoiceController.class);

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> createInvoice(
            @RequestBody Map<String, List<CartItemDTO>> payload,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
        }

        User user;
        try {
            user = (User) authentication.getPrincipal();
        } catch (ClassCastException e) {
            log.error("Principal is not User entity", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication configuration error"));
        }

        List<CartItemDTO> cart = payload.get("cart");
        if (cart == null || cart.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cart is empty"));
        }

        Invoice invoice = new Invoice();
        invoice.setUser(user);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItemDTO item : cart) {
            InvoiceItem invoiceItem = new InvoiceItem();
            invoiceItem.setInvoice(invoice);

            // Optional: link to real product
            Product product = null;
            try {
                product = productRepository.findById(Long.valueOf(item.getId())).orElse(null);
            } catch (NumberFormatException e) {
                log.warn("Invalid product ID format: {}", item.getId());
            }

            invoiceItem.setProduct(product);
            invoiceItem.setProductName(item.getName() != null ? item.getName() : "Unknown Product");
            invoiceItem.setPrice(BigDecimal.valueOf(item.getPrice()));
            invoiceItem.setQuantity(item.getQuantity());

            BigDecimal subtotal = invoiceItem.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(subtotal);

            invoice.addItem(invoiceItem);
        }

        invoice.setTotalAmount(total);
        invoice.calculateTotal();
        try {
            Invoice saved = invoiceRepository.save(invoice);
            log.info("After first save - ID generated: {}", saved.getId());
            String invoiceNumber = String.format("INV-%06d", saved.getId());
            saved.setInvoiceNumber(invoiceNumber);

            saved = invoiceRepository.save(saved);

            log.info("Created invoice: ID={}, Number={}, User={}, Total={}",
                    saved.getId(), saved.getInvoiceNumber(), user.getUsername(), saved.getTotalAmount());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order created successfully",
                    "invoice_id", saved.getId(),
                    "invoice_number", saved.getInvoiceNumber(),
                    "total", saved.getTotalAmount()
            ));
        } catch (Exception e) {
            log.error("Failed to save invoice", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }

    public static class CartItemDTO {
        private String id;
        private String name;
        private double price;
        private int quantity;
        private String image;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }
}