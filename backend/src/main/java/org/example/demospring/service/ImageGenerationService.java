package org.example.demospring.service;

import jakarta.transaction.NotSupportedException;
import org.example.demospring.server.controller.ImageController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.content.Media;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptionsBuilder;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageGenerationService {

  private final ImageModel imageModel;
  private static final Logger LOG = LoggerFactory.getLogger(ImageController.class);
  private final List<Media> dynamicImages = new ArrayList<>();

  public ImageGenerationService(ImageModel imageModel) {
    this.imageModel = imageModel;
  }

  public String generateImage(String object) throws IOException, NotSupportedException {

    System.out.println("Try to generate " + object);

    if (imageModel == null)
      throw new NotSupportedException("Image model is not supported");

    ImageResponse ir = imageModel.call(new ImagePrompt(
            "Generate an image with " + object,
            ImageOptionsBuilder.builder()
                    .height(300)
                    .width(300)
                    .N(1)
                    .responseFormat("url")
                    .build()
    ));

    String url = ir.getResult().getOutput().getUrl();
    LOG.info("Generated image URL: {}", url);

    dynamicImages.add(Media.builder()
            .id(UUID.randomUUID().toString())
            .mimeType(MimeTypeUtils.IMAGE_PNG)
            .data(url)
            .build());



    return url;
  }


}
