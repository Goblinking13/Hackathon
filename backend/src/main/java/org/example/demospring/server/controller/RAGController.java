package org.example.demospring.server.controller;

import org.example.demospring.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rag")
@CrossOrigin("*")
public class RAGController {

  @Autowired
  private final DocumentService documentService;

  public RAGController(DocumentService documentService) {
    this.documentService = documentService;
  }

  @PostMapping("/upload")
  public String uploadText(@RequestBody String text) {
    System.out.println("Get text to RAG: " + text);
    documentService.addDocument(text);
    return "Document saved to vector store.";
  }

  @GetMapping("/search")
  public List<?> search(@RequestParam String query) {
    return documentService.searchSimilar(query, 3);
  }
}
