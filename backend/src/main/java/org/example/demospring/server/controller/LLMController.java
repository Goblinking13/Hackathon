package org.example.demospring.server.controller;


import org.example.demospring.service.AIService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")

public class LLMController {

  private final AIService aiService;

  public LLMController(AIService aiService) {
    this.aiService = aiService;
  }

  @PostMapping("/send/prompt")
  public String prompt(@RequestBody Map<String, String> payload) {

    System.out.println("Call send prompt");

    try {

      String sessionId = payload.get("sessionId");
      String prompt = payload.get("prompt");

      return aiService.processPrompt(sessionId, prompt);
    } catch (Exception e) {
      return "Error: " + e.getMessage();
    }

  }

}
