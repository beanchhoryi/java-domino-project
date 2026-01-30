package com.pizza.domino.controller;

import com.pizza.domino.dto.OrderRequest;
import com.pizza.domino.dto.OrderItemRequest;
import com.pizza.domino.model.*;
import com.pizza.domino.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderApiController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request,
                                         Authentication authentication) {
        try {
            // Check authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create invoice
            Invoice invoice = new Invoice();
            invoice.setUser(user);

            // Set customer info
            if (request.getCustomerInfo() != null) {
                invoice.setCustomerName(request.getCustomerInfo().getName());
                invoice.setCustomerPhone(request.getCustomerInfo().getPhone());
                invoice.setDeliveryAddress(request.getCustomerInfo().getAddress());
            } else {
                // Use user's info if not provided
                invoice.setCustomerName(user.getFirstName() + " " + user.getLastName());
                invoice.setCustomerPhone(user.getPhone());
                invoice.setDeliveryAddress(user.getAddress());
            }

            // Set amounts
            invoice.setSubtotal(request.getSubtotal());
            invoice.setTax(request.getTax());
            invoice.setTotal(request.getTotal());

            // Set dates explicitly
            invoice.setOrderDate(LocalDateTime.now());
            invoice.setCreatedAt(LocalDateTime.now());

            // Create invoice items
            List<InvoiceItem> items = new ArrayList<>();
            if (request.getItems() != null) {
                for (OrderItemRequest itemRequest : request.getItems()) {
                    Product product = null;

                    if (itemRequest.getProductId() != null) {
                        try {
                            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
                            if (productOpt.isPresent()) {
                                product = productOpt.get();
                            } else {
                                System.out.println("Warning: Product not found with ID: " + itemRequest.getProductId());
                                // Continue without product reference
                            }
                        } catch (Exception e) {
                            System.out.println("Error finding product: " + e.getMessage());
                            // Continue without product reference
                        }
                    }

                    InvoiceItem item = new InvoiceItem();

                    // Set product (can be null)
                    item.setProduct(product);

                    // Set product name - use request data
                    if (itemRequest.getProductName() != null && !itemRequest.getProductName().isEmpty()) {
                        item.setProductName(itemRequest.getProductName());
                    } else if (product != null) {
                        item.setProductName(product.getProductName());
                    } else {
                        item.setProductName("Unknown Product");
                    }

                    // Set price
                    if (itemRequest.getPrice() != null) {
                        item.setPrice(itemRequest.getPrice());
                    } else if (product != null) {
                        item.setPrice(product.getPrice());
                    } else {
                        item.setPrice(0.0);
                    }

                    // Set quantity
                    item.setQuantity(itemRequest.getQuantity() != null ? itemRequest.getQuantity() : 1);
                    item.setInvoice(invoice);
                    item.setCreatedAt(LocalDateTime.now());

                    items.add(item);
                }
            }

            invoice.setItems(items);
            invoiceRepository.save(invoice);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "orderId", invoice.getId(),
                    "invoiceNumber", invoice.getInvoiceNumber(),
                    "message", "Order created successfully"
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/details")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderId,
                                             Authentication authentication) {
        try {
            // Check authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();

            // Find invoice
            Invoice invoice = invoiceRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Security check - user can only view their own orders
            if (!invoice.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("id", invoice.getId());
            response.put("invoiceNumber", invoice.getInvoiceNumber());
            response.put("orderDate", invoice.getOrderDate());
            response.put("status", invoice.getStatus());
            response.put("customerName", invoice.getCustomerName());
            response.put("customerPhone", invoice.getCustomerPhone());
            response.put("deliveryAddress", invoice.getDeliveryAddress());
            response.put("paymentMethod", invoice.getPaymentMethod());
            response.put("subtotal", invoice.getSubtotal());
            response.put("tax", invoice.getTax());
            response.put("total", invoice.getTotal());

            // Add items
            List<Map<String, Object>> items = new ArrayList<>();
            if (invoice.getItems() != null) {
                for (InvoiceItem item : invoice.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("productId", item.getProduct() != null ? item.getProduct().getId() : null);
                    itemMap.put("productName", item.getProductName());
                    itemMap.put("price", item.getPrice());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("total", item.getTotal());
                    items.add(itemMap);
                }
            }
            response.put("items", items);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<?> getOrderItems(@PathVariable Long orderId,
                                           Authentication authentication) {
        try {
            // Check authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();

            // Find invoice
            Invoice invoice = invoiceRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Security check
            if (!invoice.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            // Build items response
            List<Map<String, Object>> items = new ArrayList<>();
            if (invoice.getItems() != null) {
                for (InvoiceItem item : invoice.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("productId", item.getProduct() != null ? item.getProduct().getId() : null);
                    itemMap.put("productName", item.getProductName());
                    itemMap.put("price", item.getPrice());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("total", item.getTotal());

                    // Add image if product exists
                    if (item.getProduct() != null && item.getProduct().getImage() != null) {
                        itemMap.put("image", item.getProduct().getImage());
                    }

                    items.add(itemMap);
                }
            }

            return ResponseEntity.ok(items);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}