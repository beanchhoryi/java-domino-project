package com.pizza.domino.controller;

import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.pizza.domino.model.Invoice;
import com.pizza.domino.repository.InvoiceRepository;
import com.pizza.domino.service.UserService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Controller
public class ProfileController {

    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = "uploads/users";
    private final InvoiceRepository invoiceRepository;
    private final UserService userService;

    public ProfileController(UserRepository userRepository,
                             InvoiceRepository invoiceRepository,
                             UserService userService) {
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.userService = userService;
    }

    @GetMapping("/profile")
    public String profileSettings(
            @RequestParam(value = "tab", defaultValue = "info") String tab,
            Model model,
            HttpServletRequest request) {

        System.out.println("=== ProfileController ===");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Tab: " + tab);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return "redirect:/login";
        }

        try {
            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            model.addAttribute("user", user);
            model.addAttribute("tab", tab);

            return "pages/profile_settings";

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return "redirect:/login";
        }
    }

    // ADD THIS METHOD for updating profile
    @PostMapping("/profile/update")
    public String updateProfile(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update user fields
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setAddress(address);
            user.setPhone(phone);

            // Handle image upload
            if (image != null && !image.isEmpty()) {
                String imageUrl = saveUserImage(image);
                user.setImage(imageUrl);
            }

            userRepository.save(user);

            redirectAttributes.addFlashAttribute("message", "Profile updated successfully!");
            redirectAttributes.addFlashAttribute("messageType", "success");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("message", "Error updating profile: " + e.getMessage());
            redirectAttributes.addFlashAttribute("messageType", "error");
        }

        return "redirect:/profile?tab=info";
    }

    private String saveUserImage(MultipartFile image) throws Exception {
        if (image == null || image.isEmpty()) return null;

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, filename);

        Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/users/" + filename;
    }

    //order history
    @GetMapping("/orders")
    public String orderHistory(
            @RequestParam(value = "status", required = false) String status,
            Model model,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Invoice> orders;
            if (status != null && !status.isEmpty()) {
                orders = invoiceRepository.findByUserAndStatus(user, status);
            } else {
                orders = invoiceRepository.findByUserOrderByOrderDateDesc(user);
            }

            // Count statuses for filter
            long pendingCount = invoiceRepository.findByUserAndStatus(user, "PENDING").size();
            long completedCount = invoiceRepository.findByUserAndStatus(user, "COMPLETED").size();
            long totalCount = invoiceRepository.countByUser(user);

            model.addAttribute("orders", orders);
            model.addAttribute("user", user);
            model.addAttribute("selectedStatus", status);
            model.addAttribute("pendingCount", pendingCount);
            model.addAttribute("completedCount", completedCount);
            model.addAttribute("totalCount", totalCount);

            return "pages/order-history"; // Make sure this matches your file name

        } catch (Exception e) {
            model.addAttribute("error", "Error loading order history: " + e.getMessage());
            return "pages/order-history";
        }
    }

    // view invoice
    @GetMapping("/invoice/{id}")
    public String viewInvoice(@PathVariable Long id, Model model, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "redirect:/login";
        }

        try {
            Invoice invoice = invoiceRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Invoice not found"));

            // Security check - user can only view their own invoices
            String username = authentication.getName();
            if (!invoice.getUser().getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized access");
            }

            model.addAttribute("invoice", invoice);
            return "pages/invoice-detail";

        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "redirect:/orders";
        }
    }
}