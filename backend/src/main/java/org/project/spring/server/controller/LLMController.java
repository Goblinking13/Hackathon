package org.project.spring.server.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.spring.entity.UserFinanceData;
import org.project.spring.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")

public class LLMController {


  private final AIService aiService;
  private final FetchDataAIService fetchDataAIService;
  private final ImageGenerationService imageGenerationService;
  private final AIAnalyzerService aiAnalyzerService;

  private final UserFinanceDataJPA userFinanceDataJPA;

  int imageGenerationCounter = 0;

  public LLMController(AIService aiService, FetchDataAIService fetchDataAIService, UserFinanceDataJPA userFinanceDataJPA
  ,  ImageGenerationService imageGenerationService, AIAnalyzerService aiAnalyzerService) {
    this.aiService = aiService;
    this.fetchDataAIService = fetchDataAIService;
    this.userFinanceDataJPA = userFinanceDataJPA;
    this.imageGenerationService = imageGenerationService;
    this.aiAnalyzerService = aiAnalyzerService;
  }

  @PostMapping("/send/prompt")
  public String prompt(@RequestBody Map<String, String> payload) {

    System.out.println("Call send prompt");

    try {

      String sessionId = payload.get("sessionId");
      String prompt = payload.get("prompt");
      String additionalInfo = "";

      String aiJsonReply = aiAnalyzerService.processPrompt(prompt);

      List<UserFinanceData> financeData = fetchDataAIService.processPrompt(sessionId,prompt);
      userFinanceDataJPA.addMessages(financeData);

      ObjectMapper mapper = new ObjectMapper();
      Map<String, Object> aiReplyMap = mapper.readValue(aiJsonReply, new TypeReference<>() {});

      Map<String, Object> functions = (Map<String, Object>) aiReplyMap.get("functions");

      if(imageGenerationCounter > 5)
        imageGenerationCounter = 0;


      System.out.println(imageGenerationCounter);
      String imageUrl = "";
      Map<String, Object> imageFunc = (Map<String, Object>) functions.get("image");
      if ((Boolean) imageFunc.getOrDefault("generate_image", false) && imageGenerationCounter ==0) {
        String description = (String) imageFunc.getOrDefault("description", "finance");
        imageUrl = imageGenerationService.generateImage(description);
        System.out.println("iamge URL:" + imageUrl);

      }
      imageGenerationCounter++;



      String reply = aiService.processPrompt(sessionId,prompt, imageUrl);

      return reply;


    } catch (Exception e) {
      return "Error: " + e.getMessage();
    }

  }

}
