package org.example.demospring.service;

import org.example.demospring.entity.ChatMessage;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.PromptChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;



@Service
public class AIService {

  private final ChatClient chatClient;
  @Autowired
  private MessageHistory messageHistory;

  public AIService(ChatClient.Builder chatClientBuilder,
                          ChatMemory chatMemory) {
    this.chatClient = chatClientBuilder.build();
  }

  public synchronized String processPrompt(String sessionId,String prompt) {

    messageHistory.addMessage(new ChatMessage(sessionId, "user", prompt));

    List<ChatMessage> history = messageHistory.findBySessionId(sessionId);

    List<Message> context = new ArrayList<>();
    context.add(new SystemMessage("Response as Lenin"));

    for (ChatMessage msg : history) {
      if (msg.getRole().equals("user")) {
        context.add(new UserMessage(msg.getContent()));
      } else {
        context.add(new AssistantMessage(msg.getContent()));
      }
    }


    String reply = chatClient.prompt()
            .messages(context.toArray(new Message[0])) // varargs
            .call()
            .content();

    // Сохраняем ответ ассистента
    messageHistory.addMessage(new ChatMessage(sessionId, "assistant", reply));
    System.out.println(reply);
    return reply;
  }


}
