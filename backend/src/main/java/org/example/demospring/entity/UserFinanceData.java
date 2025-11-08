package org.example.demospring.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "user_finance_data")
public class UserFinanceData {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String sessionId;

  private BigDecimal monthlyIncome;   // зарплата
  private BigDecimal monthlyExpenses; // траты
  private BigDecimal savings;         // накопления
  private BigDecimal debts;           // долги
  private BigDecimal assetsValue;     // стоимость имущества

  private String currency;            // EUR, USD и т.д.

  @Column(length = 2000)
  private String rawText;


  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getSessionId() { return sessionId; }
  public void setSessionId(String sessionId) { this.sessionId = sessionId; }

  public BigDecimal getMonthlyIncome() { return monthlyIncome; }
  public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

  public BigDecimal getMonthlyExpenses() { return monthlyExpenses; }
  public void setMonthlyExpenses(BigDecimal monthlyExpenses) { this.monthlyExpenses = monthlyExpenses; }

  public BigDecimal getSavings() { return savings; }
  public void setSavings(BigDecimal savings) { this.savings = savings; }

  public BigDecimal getDebts() { return debts; }
  public void setDebts(BigDecimal debts) { this.debts = debts; }

  public BigDecimal getAssetsValue() { return assetsValue; }
  public void setAssetsValue(BigDecimal assetsValue) { this.assetsValue = assetsValue; }

  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }

  public String getRawText() { return rawText; }
  public void setRawText(String rawText) { this.rawText = rawText; }
}
