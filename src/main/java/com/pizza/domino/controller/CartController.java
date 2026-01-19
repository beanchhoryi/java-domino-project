package com.pizza.domino.controller;

import com.pizza.domino.model.Cart;
import com.pizza.domino.model.CartItem;
import com.pizza.domino.model.Product;
import com.pizza.domino.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    @GetMapping
    public ResponseEntity<Cart> getCurrentCart(
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Cart cart = cartService.getCurrentCart(sessionId, authHeader);
        return ResponseEntity.ok(cart);
    }
    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long cartId) {
        Cart cart = cartService.getCartById(cartId);
        return ResponseEntity.ok(cart);
    }
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody AddToCartRequest request,
            @RequestParam(required = false) String sessionId) {

        CartItem addedItem = cartService.addItemToCart(
                request.getProductId(),
                request.getQuantity(),
                request.getSize(),
                request.getCrustType(),
                sessionId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(addedItem);
    }

    // Update quantity of existing cart item
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItem> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody UpdateQuantityRequest request) {

        CartItem updatedItem = cartService.updateItemQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.ok(updatedItem);
    }

    // Remove item from cart
    @DeleteMapping("/items/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
    }

    // Clear entire cart
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        cartService.clearCart(sessionId, authHeader);
    }
}

class AddToCartRequest {
    private Long productId;
    private Integer quantity = 1;
    private String size;
    private String crustType;

    // Getters & Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getCrustType() { return crustType; }
    public void setCrustType(String crustType) { this.crustType = crustType; }
}

class UpdateQuantityRequest {
    private Integer quantity;

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}