package org.example.demospring.server.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.demospring.entity.UserFinanceData;
import org.example.demospring.service.*;
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
  private final ImageGenerationService imageGenerationService;
  private final AIAnalyzerService aiAnalyzerService;

  private final UserFinanceDataJPA userFinanceDataJPA;

  int imageGenerationCounter = 0;

  public LLMController(AIService aiService, FetchDataAIService fetchDataAIService, UserFinanceDataJPA userFinanceDataJPA
  , CsvAnalysisService csvAnalysisService, ImageGenerationService imageGenerationService, AIAnalyzerService aiAnalyzerService) {
    this.aiService = aiService;
    this.fetchDataAIService = fetchDataAIService;
    this.userFinanceDataJPA = userFinanceDataJPA;
    this.csvAnalysisService = csvAnalysisService;
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


      String imageUrl = "";
      Map<String, Object> imageFunc = (Map<String, Object>) functions.get("image");
      if ((Boolean) imageFunc.getOrDefault("generate_image", false)) {
        String description = (String) imageFunc.getOrDefault("description", "finance");
        imageUrl = imageGenerationService.generateImage(description);
        System.out.println("iamge URL:" + imageUrl);

      }
      imageGenerationCounter++;

//      String financeDataJson = "This is finance data:";
//      Map<String, Object> financeFunc = (Map<String, Object>) functions.get("finance_data_request");
//      if ((Boolean) financeFunc.getOrDefault("external_call", false)) {
//        List<UserFinanceData> financeDataRaw = userFinanceDataJPA.findBySessionId(sessionId);
//         financeDataJson = mapper.writeValueAsString(financeDataRaw);
//
//         System.out.println("finance data: " + financeDataJson);
//
//      }




      String reply = aiService.processPrompt(sessionId,prompt, imageUrl);

//      System.out.println("Model get prompt" + prompt);
//      String reply =aiService.processPrompt(sessionId, prompt);
//

//
//      String imageUrl = imageGenerationService.generateImage("description");
////      reply = reply + "https://dalleprodsec.blob.core.windows.net/private/images/94e21122-df51-4101-94d6-7fbf4e45793c/generated_00.png?se=2025-11-08T23%3A38%3A36Z&sig=xTjsYH6JMFpe%2FMzczwROOOTCnB5nttGsYUoJDZu0msM%3D&ske=2025-11-14T10%3A32%3A31Z&skoid=e52d5ed7-0657-4f62-bc12-7e5dbb260a96&sks=b&skt=2025-11-07T10%3A32%3A31Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02";
      return reply;


//      return csvAnalysisService.analyzeCsv("/Users/artem/Desktop/project1/Hackathon/backend/src/main/resources/wage.csv", "What will be my wage as a programmer in 2030?");
    } catch (Exception e) {
      return "Error: " + e.getMessage();
    }

  }

//
//  @PostMapping("/send/prompt")
//  public String prompt(@RequestBody Map<String, String> payload) {
//    System.out.println("Call send prompt");
//
//    try {
//      String sessionId = payload.get("sessionId");
//      String prompt = payload.get("prompt");
//
//      // Получаем JSON от AIAnalyzer
//      String aiJsonReply = aiAnalyzerService.processPrompt(prompt);
//
//      // Парсим JSON
//      ObjectMapper mapper = new ObjectMapper();
//      Map<String, Object> aiReplyMap = mapper.readValue(aiJsonReply, new TypeReference<>() {});
//
//      // Работа с функциями
//      Map<String, Object> functions = (Map<String, Object>) aiReplyMap.get("functions");
//
//      // 1) Генерация изображения, если требуется
//      Map<String, Object> imageFunc = (Map<String, Object>) functions.get("image");
//      if ((Boolean) imageFunc.getOrDefault("generate_image", false)) {
//        String description = (String) imageFunc.getOrDefault("description", "finance");
//        String imageUrl = imageGenerationService.generateImage(description);
//        imageFunc.put("image_url", imageUrl); // добавляем ссылку на изображение
//      }
//
//      // 2) Запрос финансовых данных, если требуется
//      Map<String, Object> financeFunc = (Map<String, Object>) functions.get("finance_data_request");
//      if ((Boolean) financeFunc.getOrDefault("external_call", false)) {
//        List<UserFinanceData> financeData = fetchDataAIService.getUserFinanceData(sessionId);
//        financeFunc.put("data", financeData); // сохраняем данные
//      }
//
//      // 3) Сохраняем сообщение пользователя и результат AI в БД
//
//      // Возвращаем обновленный JSON с результатами функций
//      return mapper.writeValueAsString(aiReplyMap);
//
//    } catch (Exception e) {
//      e.printStackTrace();
//      return "{\"error\": \"" + e.getMessage() + "\"}";
//    }
//  }


}
