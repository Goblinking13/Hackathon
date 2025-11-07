package org.example.demospring.server.controller;


import org.example.demospring.entity.UserFinanceData;
import org.example.demospring.service.AIService;
import org.example.demospring.service.CsvAnalysisService;
import org.example.demospring.service.FetchDataAIService;
import org.example.demospring.service.UserFinanceDataJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")

public class LLMController {


  private final AIService aiService;
  private final FetchDataAIService fetchDataAIService;
  private final CsvAnalysisService csvAnalysisService;

  private final UserFinanceDataJPA userFinanceDataJPA;

  public LLMController(AIService aiService, FetchDataAIService fetchDataAIService, UserFinanceDataJPA userFinanceDataJPA
  , CsvAnalysisService csvAnalysisService) {
    this.aiService = aiService;
    this.fetchDataAIService = fetchDataAIService;
    this.userFinanceDataJPA = userFinanceDataJPA;
    this.csvAnalysisService = csvAnalysisService;
  }

  @PostMapping("/send/prompt")
  public String prompt(@RequestBody Map<String, String> payload) {

    System.out.println("Call send prompt");

    try {

      String sessionId = payload.get("sessionId");
      String prompt = payload.get("prompt");

//      List<UserFinanceData> financeData = fetchDataAIService.processPrompt(sessionId,prompt);
//      userFinanceDataJPA.addMessages(financeData);


//      return aiService.processPrompt(sessionId, prompt);


      return csvAnalysisService.analyzeCsv("/Users/artem/Desktop/project1/Hackathon/backend/src/main/resources/wage.csv", "What will be my wage as a programmer in 2030?");
    } catch (Exception e) {
      return "Error: " + e.getMessage();
    }

  }

}
