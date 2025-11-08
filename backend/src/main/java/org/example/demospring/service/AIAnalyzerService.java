package org.example.demospring.service;

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
public class AIAnalyzerService {

  private final ChatClient chatClient;
  @Autowired




  public AIAnalyzerService(ChatClient.Builder chatClientBuilder,
                   ChatMemory chatMemory, UserFinanceDataJPA userFinanceData) {
    this.chatClient = chatClientBuilder.build();

  }

  public synchronized String processPrompt(String prompt) {


    System.out.println(prompt);


    List<Message> context = new ArrayList<>();

    context.add(new SystemMessage("""
You are part of an AI agent. You must analyze the user's request and return the result in ONLY JSON.
- The field "user_request" must contain exactly the user's original input, without any rephrasing.
- If the user writes about something that is easy to visualize and relevant for a financial agent, include it in JSON with a description under "image".
- If the user asks about their statistics or financial data, include it in JSON under "finance_data_request".
- If there is not inforamtion about image or finance data request. Write it in JSON but with status false. 

Example of response:

{
  "user_request": "I want to buy a car. Based on my financial situation, when can I afford this?",
  "functions": {
    "image": {
      "generate_image": true,
      "description": "car"
    },
    "finance_data_request": {
      "external_call": true
    }
  }
}
"""));


    context.add(new UserMessage(prompt));



    String reply = chatClient.prompt()
            .messages(context.toArray(new Message[0])) // varargs
            .call()
            .content();


    System.out.println(reply);
    return reply;
  }


}


