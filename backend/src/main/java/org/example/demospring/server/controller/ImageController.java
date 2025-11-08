package org.example.demospring.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.NotSupportedException;
import org.example.demospring.service.ImageGenerationService;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptionsBuilder;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import java.util.ArrayList;
import java.util.List;

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
