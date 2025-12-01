package com.avamud.service;

import com.avamud.entity.Document;
import com.avamud.entity.Payment;
import com.avamud.entity.User;
import com.avamud.repository.DocumentRepository;
import com.avamud.repository.PaymentRepository;
import com.avamud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentService {

    private final Path uploadRoot = Paths.get("uploads");

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public DocumentService() throws IOException {
        if (!Files.exists(uploadRoot)) {
            Files.createDirectories(uploadRoot);
        }
    }

    public Document saveFile(MultipartFile file, Long userId, Long paymentId, Long uploadedBy) throws IOException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) throw new IllegalArgumentException("User not found");

        User user = userOpt.get();

        Payment payment = null;
        if (paymentId != null) {
            payment = paymentRepository.findById(paymentId).orElse(null);
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }

        String filename = UUID.randomUUID().toString() + ext;
        Path target = uploadRoot.resolve(filename);
        Files.copy(file.getInputStream(), target);

        Document document = new Document();
        document.setUser(user);
        document.setPayment(payment);
        document.setFilename(original != null ? original : filename);
        document.setStoragePath(target.toString());
        document.setContentType(file.getContentType());
        document.setSize(file.getSize());
        document.setUploadedAt(new Date());
        document.setUploadedBy(uploadedBy);

        return documentRepository.save(document);
    }

    public List<Document> getByPaymentId(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        return paymentOpt.map(documentRepository::findByPayment).orElse(List.of());
    }

    public List<Document> getByUserId(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(documentRepository::findByUser).orElse(List.of());
    }
}
