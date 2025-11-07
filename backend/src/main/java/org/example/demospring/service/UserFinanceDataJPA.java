package org.example.demospring.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.example.demospring.entity.ChatMessage;
import org.example.demospring.entity.UserFinanceData;

import java.util.List;

@Transactional
public class UserFinanceDataJPA {

  @PersistenceContext
  private EntityManager entityManager;


  public void addMessages(List<UserFinanceData> dataList) {
    for (UserFinanceData data : dataList) {
      entityManager.persist(data);
    }
  }


  public List<UserFinanceData> getAllMessages() {
    System.out.println("getAllAccounts invoked");
    return entityManager.createQuery( "SELECT c FROM UserFinanceData c", UserFinanceData.class).getResultList();
  }




  public List<UserFinanceData> findBySessionId(String sessionId) {
    return entityManager.createQuery( "SELECT c FROM UserFinanceData c WHERE c.sessionId = :id", UserFinanceData.class)
            .setParameter("id", sessionId)
            .getResultList();
  }


}
