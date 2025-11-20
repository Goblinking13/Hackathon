package org.project.spring.server.controller;

import jakarta.transaction.NotSupportedException;
import org.project.spring.service.ImageGenerationService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/images")
public class ImageController {


  private final ChatClient chatClient;
  private final ImageGenerationService imageGenerationService;




  public ImageController(ChatClient.Builder chatClientBuilder, ImageGenerationService imageGenerationService) {
    this.chatClient = chatClientBuilder
            .defaultAdvisors(new SimpleLoggerAdvisor())
            .build();
    this.imageGenerationService = imageGenerationService;

  }


  @GetMapping(value = "/generate/{object}", produces = MediaType.TEXT_PLAIN_VALUE)
  public String generate(@PathVariable String object) throws IOException, NotSupportedException {

    return imageGenerationService.generateImage(object);
  }

}
