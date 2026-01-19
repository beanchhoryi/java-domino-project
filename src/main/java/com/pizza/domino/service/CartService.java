package com.pizza.domino.service;

import com.pizza.domino.model.Cart;
import com.pizza.domino.model.CartItem;

public interface CartService {

    Cart getCurrentCart(String sessionId, String authHeader);

    Cart getCartById(Long cartId);

    CartItem addItemToCart(Long productId, Integer quantity, String size, String crustType, String sessionId);

    CartItem updateItemQuantity(Long cartItemId, Integer quantity);

    void removeItem(Long cartItemId);

    void clearCart(String sessionId, String authHeader);
}