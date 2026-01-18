package com.pizza.domino.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MenuController {

    @GetMapping("/menu")
    public String menu() {
        return "pages/menu";
    }

    @GetMapping("/cart")
    public String cart() {
        return "pages/cart";
    }
}
