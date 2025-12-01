package com.avamud.controller;

import com.avamud.entity.Document;
import com.avamud.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/users/{userId}/documents")
    public ResponseEntity<Document> uploadDocument(@PathVariable Long userId,
                                                   @RequestParam("file") MultipartFile file,
                                                   @RequestParam(value = "paymentId", required = false) Long paymentId) throws IOException {
        // For now, uploadedBy is the same as userId
        Document doc = documentService.saveFile(file, userId, paymentId, userId);
        return ResponseEntity.status(201).body(doc);
    }

    @GetMapping("/payments/{paymentId}/documents")
    public ResponseEntity<List<Document>> getByPayment(@PathVariable Long paymentId) {
        List<Document> docs = documentService.getByPaymentId(paymentId);
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/users/{userId}/documents")
    public ResponseEntity<List<Document>> getByUser(@PathVariable Long userId) {
        List<Document> docs = documentService.getByUserId(userId);
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {
        // Simple download implementation
        Document doc = documentService.getByUserId(id).stream().filter(d -> d.getId().equals(id)).findFirst().orElse(null);
        if (doc == null) return ResponseEntity.notFound().build();
        File f = new File(doc.getStoragePath());
        byte[] data = Files.readAllBytes(f.toPath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

}
