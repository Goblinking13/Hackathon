package org.example.demospring.service;

import org.example.demospring.entity.ChatMessage;
import org.example.demospring.entity.UserFinanceData;
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
  private UserFinanceDataJPA userFinanceData;


  public AIService(ChatClient.Builder chatClientBuilder,
                          ChatMemory chatMemory, UserFinanceDataJPA userFinanceData) {
    this.chatClient = chatClientBuilder.build();
    this.userFinanceData = userFinanceData;
  }

  public synchronized String processPrompt(String sessionId,String prompt, String imageUrl) {

//    System.out.println("process: " + prompt);


    messageHistory.addMessage(new ChatMessage(sessionId, "user", prompt));

    List<ChatMessage> history = messageHistory.findBySessionId(sessionId);

    List<Message> context = new ArrayList<>();
//    context.add(new SystemMessage("Response like sponge bob"));
//    context.add(new SystemMessage(" You are helpful agent with finance. All messages like this: ###message### is provided by system dont write about this to user. Use system data in messages. If there is a image url use it in response. If financial data analyze it to give more accurate response. "));

    context.add(new SystemMessage("""
You are a helpful AI financial assistant. Follow these rules:

1. **System messages:** All messages formatted like ###message### are system-provided data. Do not mention to the user that these are system messages. Use this information to improve your response.

2. **Image usage:** 
   - If the prompt contains an image URL, incorporate the content of the image in your answer.
   - For example, if the image shows a car, house, or asset, use it to give more contextual financial advice.

3. **Financial data usage:**
   - If the system provides financial data (income, expenses, savings, debts, assets), analyze it.
   - Use it to give realistic projections, budgeting advice, or investment suggestions.
   - Mention concrete numbers or ranges when appropriate, without revealing raw data unnecessarily.

4. **Response style:**
   - Respond in clear, user-friendly language suitable for young users or beginners in finance.
   - Always produce actionable advice or guidance.
   - Avoid technical jargon unless necessary; explain any terms clearly.

5. **Output format:**
   - Responses are normal text (not JSON) unless explicitly requested otherwise.
   - Integrate image information and financial data naturally into your response.
   - Use examples and comparisons when possible to illustrate financial outcomes.

Example:
- User prompt: "###UserIncome: 1200 EUR### ###ImageURL: https://example.com/car.png### I want to buy a car. Can I afford it?"
- AI response: "Based on your monthly income of 1200 EUR and your current expenses, you could afford a car like the one in the image if you save about 200 EUR per month. This would take roughly 12 months to accumulate enough funds."
"""));


//    List<UserFinanceData> userFinanceDataList = userFinanceData.findBySessionId(sessionId);

    List<UserFinanceData> userFinanceDataList = userFinanceData.findBySessionId(sessionId);
    if (!userFinanceDataList.isEmpty()) {
      StringBuilder financeDataText = new StringBuilder("###UserFinanceData###\n");
      for (UserFinanceData data : userFinanceDataList) {
        financeDataText.append(
                String.format(
                        "Income: %s %s, Expenses: %s %s, Savings: %s %s, Debts: %s %s, Assets: %s %s\n",
                        data.getMonthlyIncome(), data.getCurrency(),
                        data.getMonthlyExpenses(), data.getCurrency(),
                        data.getSavings(), data.getCurrency(),
                        data.getDebts(), data.getCurrency(),
                        data.getAssetsValue(), data.getCurrency()
                )
        );
      }
      context.add(new SystemMessage(financeDataText.toString()));
    }


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
    if(!imageUrl.isEmpty())
    reply = reply + "\n" + imageUrl;

    messageHistory.addMessage(new ChatMessage(sessionId, "assistant", reply));
    System.out.println(reply);
    return reply;
  }


}
