package org.project.spring.service;

import org.project.spring.entity.ChatMessage;

import java.util.List;

public interface MessageHistory {

  void addMessage(ChatMessage account);
  public List<ChatMessage> getAllMessages();
  public void resetAccounts();
  public List<ChatMessage> findBySessionId(String sessionId);

}
