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

  /**
   * Анализирует CSV-файл по указанному пути.
   *
   * @param filePath путь к CSV файлу
   * @param question вопрос к модели (опционально)
   */
  public String analyzeCsv(String filePath, String question) throws Exception {
    try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
      List<String[]> rows = reader.readAll();

      // Обрезаем длинные файлы — модель не сможет обработать тысячи строк
      String csvPreview = rows.stream()
              .limit(30)
              .map(r -> String.join(", ", r))
              .collect(Collectors.joining("\n"));

      // Формируем промпт
      String userPrompt = (question != null ? question : "Analyze this financial dataset.")
              + "\nHere is a preview of the CSV data:\n" + csvPreview;

      // Отправляем запрос в LLM
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
