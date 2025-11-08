package org.example.demospring.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.demospring.entity.ChatMessage;
import org.example.demospring.entity.UserFinanceData;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;



@Service
public class FetchDataAIService {

  private final ChatClient chatClient;
  private final ObjectMapper mapper = new ObjectMapper();

  public FetchDataAIService(ChatClient.Builder chatClientBuilder, ChatMemory chatMemory) {
    this.chatClient = chatClientBuilder.build();
  }

  public synchronized List<UserFinanceData> processPrompt(String sessionId, String prompt) {
    List<Message> context = new ArrayList<>();

    context.add(new SystemMessage("""
            You are part of a financial assistant AI agent. 
            Your goal is to extract structured financial information from user's text input.
            Return only valid JSON array, with one or more objects having these fields:
            [
              {
                "monthlyIncome": number or null,
                "monthlyExpenses": number or null,
                "savings": number or null,
                "debts": number or null,
                "assetsValue": number or null,
                "currency": "EUR" | "USD" | "other" | null
              }
            ]
            Do not include explanations or text outside the JSON.
        """));

    context.add(new UserMessage(prompt));

    String reply = chatClient.prompt()
            .messages(context)
            .call()
            .content();

    System.out.println("🔍 Model raw reply:\n" + reply);

    try {

      List<UserFinanceData> dataList = mapper.readValue(
              reply,
              new TypeReference<List<UserFinanceData>>() {}
      );


      for (UserFinanceData data : dataList) {
        data.setSessionId(sessionId);
        data.setRawText(prompt);
      }

      return dataList;

    } catch (Exception e) {
      System.err.println("Failed to parse model reply: " + e.getMessage());
      return List.of();
    }
  }
}
