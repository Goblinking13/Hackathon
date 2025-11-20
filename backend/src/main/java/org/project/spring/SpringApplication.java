package org.project.spring;

import org.project.spring.service.MessageHistory;
import org.project.spring.service.MessageHistoryJPA;
import org.project.spring.service.UserFinanceDataJPA;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class SpringApplication {

  public static void main(String[] args) {
    org.springframework.boot.SpringApplication.run(SpringApplication.class, args);
  }

  @Bean
  public MessageHistory messageHistory() { return new MessageHistoryJPA(); }


  @Bean
  public UserFinanceDataJPA financeService(){return new UserFinanceDataJPA();}



}
