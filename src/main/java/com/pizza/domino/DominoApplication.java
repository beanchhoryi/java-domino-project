package com.pizza.domino;
import com.pizza.domino.model.User;
import com.pizza.domino.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class DominoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DominoApplication.class, args);
    }
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    /**
     * Auto-create admin user at startup if it does not exist
     */
//    @Bean
//    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//        return args -> {
//            if (!userRepository.existsByUsername("admin")) {
//                User admin = new User();
//                admin.setUsername("admin");
//                admin.setEmail("admin@example.com");
//                admin.setFirstName("Super");
//                admin.setLastName("Admin");
//                admin.setPassword(passwordEncoder.encode("admin123"));
//                admin.setRole("ROLE_ADMIN");
//                admin.setCreatedAt(LocalDateTime.now());
//                userRepository.save(admin);
//                System.out.println("Admin user created: username=admin, password=admin123");
//            } else {
//                System.out.println("Admin user already exists");
//            }
//        };
//    }
}
