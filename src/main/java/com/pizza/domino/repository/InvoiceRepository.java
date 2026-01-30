package com.pizza.domino.repository;

import com.pizza.domino.model.Invoice;
import com.pizza.domino.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Find invoices by user
    List<Invoice> findByUserOrderByOrderDateDesc(User user);

    // Find invoice by invoice number
    Invoice findByInvoiceNumber(String invoiceNumber);

    // Count total orders by user
    Long countByUser(User user);

    // Find recent invoices (for dashboard)
    @Query("SELECT i FROM Invoice i WHERE i.user = ?1 ORDER BY i.orderDate DESC LIMIT 5")
    List<Invoice> findRecentInvoices(User user);

    // Find by status and user
    List<Invoice> findByUserAndStatus(User user, String status);
}