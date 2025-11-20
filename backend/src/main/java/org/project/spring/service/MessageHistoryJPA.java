package org.project.spring.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.project.spring.entity.ChatMessage;

import java.util.List;


@Transactional
public class MessageHistoryJPA implements MessageHistory {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public void addMessage(ChatMessage account) {
    entityManager.persist(account);
  }

  @Override
  public List<ChatMessage> getAllMessages() {
    System.out.println("getAllAccounts invoked");
    return entityManager.createQuery( "SELECT c FROM ChatMessage c", ChatMessage.class).getResultList();
  }

  @Override
  public void resetAccounts() {
    entityManager.createQuery( "TRUNCATE TABLE ChatMessage",ChatMessage.class ).executeUpdate();
  }

  @Override
  public List<ChatMessage> findBySessionId(String sessionId) {
    return entityManager.createQuery( "SELECT c FROM ChatMessage c WHERE c.sessionId = :id", ChatMessage.class)
            .setParameter("id", sessionId)
            .getResultList();
  }

}
