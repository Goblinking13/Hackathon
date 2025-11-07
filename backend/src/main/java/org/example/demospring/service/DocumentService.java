package org.example.demospring.service;


//import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
//import org.springframework.ai.vectorstore.VectorStoreDocument;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

//  private final EmbeddingClient embeddingClient;
  private final VectorStore vectorStore;

  public DocumentService( VectorStore vectorStore) {
//    this.embeddingClient = embeddingClient;
    this.vectorStore = vectorStore;
  }

  /** Добавить текст в векторное хранилище */
  public void addDocument(String text) {
//    var embedding = embeddingClient.embed(text);
//    var document = new VectorStoreDocument(text, embedding);
    System.out.println("addDocument call ");
    var doc = Document.builder().id("1").text(text).build();
    vectorStore.add(List.of(doc));
  }

  /** Найти похожие документы по запросу */
  public List<Document> searchSimilar(String query, int topK) {
    SearchRequest searchRequest = SearchRequest.builder()
            .query(query)
            .topK(2)
            .build();

    List<Document> docs = vectorStore.similaritySearch(searchRequest);
    return docs;

//    var queryEmbedding = embeddingClient.embed(query);
//    return vectorStore.similaritySearch(queryEmbedding, topK);
  }
}
