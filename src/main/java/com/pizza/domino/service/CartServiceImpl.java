package com.pizza.domino.service.impl;

import com.pizza.domino.model.Cart;
import com.pizza.domino.model.CartItem;
import com.pizza.domino.model.Product;
import com.pizza.domino.repository.CartRepository;
import com.pizza.domino.repository.ProductRepository;
import com.pizza.domino.service.CartService;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Cart getCurrentCart(String sessionId, String authHeader) {
        // TODO: implement logic - find by user or session
        // For now returning new cart or existing one
        return new Cart(); // placeholder
    }

    @Override
    public Cart getCartById(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
    public CartItem addItemToCart(Long productId, Integer quantity, String size, String crustType, String sessionId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = getCurrentCart(sessionId, null); // need to improve this

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setSize(size);
        item.setCrustType(crustType);
        // item.setUnitPrice(calculate price based on size/crust/product)

        cart.getItems().add(item);
        cartRepository.save(cart);

        return item;
    }

    @Override
    public CartItem updateItemQuantity(Long cartItemId, Integer quantity) {
        // TODO: implement
        return null;
    }

    @Override
    public void removeItem(Long cartItemId) {
        // TODO: implement
    }

    @Override
    public void clearCart(String sessionId, String authHeader) {
        // TODO: implement
    }
}