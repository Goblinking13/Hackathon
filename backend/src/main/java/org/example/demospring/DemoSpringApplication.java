package org.example.demospring;

import org.example.demospring.service.DocumentService;
import org.example.demospring.service.MessageHistory;
import org.example.demospring.service.MessageHistoryJPA;
import org.example.demospring.service.UserFinanceDataJPA;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.print.Doc;

@SpringBootApplication
public class DemoSpringApplication {

  public static void main(String[] args) {
    SpringApplication.run(DemoSpringApplication.class, args);
  }

  @Bean
  public MessageHistory messageHistory() { return new MessageHistoryJPA(); }

  @Bean
  public DocumentService documentService(VectorStore vectorStore) {
    return new DocumentService(vectorStore);
  }

  @Bean
  public UserFinanceDataJPA financeService(){return new UserFinanceDataJPA();}



}
