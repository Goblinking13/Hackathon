package org.example.demospring.entity;

import jakarta.persistence.*;

@Entity
public class ChatMessage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String sessionId;
  private String role;
  @Column(length = 10000)
  private String content;

  public ChatMessage() {}

  public ChatMessage(String sessionId, String role, String content) {
    this.sessionId = sessionId;
    this.role = role;
    this.content = content;
  }

  public Long getId() { return id; }
  public String getSessionId() { return sessionId; }
  public String getRole() { return role; }
  public String getContent() { return content; }

  public void setSessionId(String sessionId) { this.sessionId = sessionId; }
  public void setRole(String role) { this.role = role; }
  public void setContent(String content) { this.content = content; }
}
