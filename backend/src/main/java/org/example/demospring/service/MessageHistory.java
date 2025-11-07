package org.example.demospring.service;

import org.example.demospring.entity.ChatMessage;

import java.util.List;

public interface MessageHistory {

  void addMessage(ChatMessage account);
  public List<ChatMessage> getAllMessages();
  public void resetAccounts();
  public List<ChatMessage> findBySessionId(String sessionId);

}
