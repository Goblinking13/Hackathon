package org.example.demospring.service;

import com.opencsv.CSVReader;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvAnalysisService {

  private final ChatClient chatClient;

  public CsvAnalysisService(ChatClient.Builder builder) {
    this.chatClient = builder.build();
  }

  public String analyzeCsv(String filePath, String question) throws Exception {
    try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
      List<String[]> rows = reader.readAll();

      String csvPreview = rows.stream()
              .limit(30)
              .map(r -> String.join(", ", r))
              .collect(Collectors.joining("\n"));

      String userPrompt = (question != null ? question : "Analyze this financial dataset.")
              + "\nHere is a preview of the CSV data:\n" + csvPreview;

      String reply = chatClient.prompt()
              .messages(
                      new SystemMessage("You are an expert data analyst. Analyze CSV data, find trends, and produce insights."),
                      new UserMessage(userPrompt)
              )
              .call()
              .content();

      return reply;
    }
  }
}
