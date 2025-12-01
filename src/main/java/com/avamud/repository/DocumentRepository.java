package com.avamud.repository;

import com.avamud.entity.Document;
import com.avamud.entity.Payment;
import com.avamud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPayment(Payment payment);
    List<Document> findByUser(User user);
}
