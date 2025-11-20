package org.project.spring.server.controller;

import org.project.spring.entity.ChatMessage;
import org.project.spring.service.MessageHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatMessageHistoryController {

  @Autowired
  private MessageHistory messageHistory;


  @GetMapping("/message/history/all")
  public List<ChatMessage> getAllMessages() {
    return messageHistory.getAllMessages();
  }


}
