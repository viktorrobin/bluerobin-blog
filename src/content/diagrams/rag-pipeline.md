---
title: "RAG Query Pipeline"
description: "Sequence diagram showing the Retrieval Augmented Generation (RAG) query flow in BlueRobin"
diagram_type: "sequence"
topic: "ai"
---

# RAG Query Pipeline

This diagram illustrates how BlueRobin processes user questions using the RAG (Retrieval Augmented Generation) pattern, combining semantic search with LLM generation.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Blazor as Blazor Web<br/>(UI)
    participant API as Archives API<br/>(FastEndpoints)
    participant RAG as RagService<br/>(Application)
    participant QP as QueryPreprocessor
    participant Ollama as Ollama<br/>(Embeddings)
    participant Qdrant as Qdrant<br/>(Vector DB)
    participant MinIO as MinIO<br/>(Storage)
    participant LLM as Ollama/OpenAI<br/>(Generation)

    User->>Blazor: Ask question about documents
    Blazor->>API: POST /api/rag/ask<br/>{ question, options }
    
    rect rgb(240, 248, 255)
        Note over API,RAG: Query Preprocessing Phase
        API->>RAG: AskAsync(userId, question, options)
        RAG->>QP: PreprocessAsync(question)
        QP->>LLM: Rewrite query for semantic search
        LLM-->>QP: Enhanced query
        QP-->>RAG: RewrittenQuery
    end

    rect rgb(255, 248, 240)
        Note over RAG,Qdrant: Retrieval Phase
        RAG->>Ollama: Generate query embedding<br/>(nomic-embed-text)
        Ollama-->>RAG: Query vector [1024d]
        RAG->>Qdrant: Vector similarity search<br/>(top_k=20, threshold=0.7)
        Qdrant-->>RAG: Matching chunks with scores
    end

    rect rgb(240, 255, 240)
        Note over RAG,MinIO: Context Building Phase
        RAG->>MinIO: Fetch full document content<br/>processed/{docId}/content.md
        MinIO-->>RAG: Document text
        RAG->>RAG: Build context with<br/>document headers
    end

    rect rgb(255, 240, 245)
        Note over RAG,LLM: Relevance Filtering Phase
        RAG->>LLM: FilterRelevantChunksAsync()<br/>"Which chunks answer this question?"
        LLM-->>RAG: Filtered relevant chunks
    end

    rect rgb(248, 248, 255)
        Note over RAG,LLM: Generation Phase
        RAG->>LLM: Generate answer with context<br/>(structured output format)
        
        alt Streaming Response
            loop Token by token
                LLM-->>RAG: Partial response
                RAG-->>API: Stream chunk
                API-->>Blazor: SSE event
            end
        else Non-Streaming
            LLM-->>RAG: Complete response
        end
    end

    RAG-->>API: RagResponse { answer, citations,<br/>confidence, searchTimeMs }
    API-->>Blazor: JSON response
    Blazor-->>User: Display answer with citations
```

## Component Responsibilities

| Component | Role | Technology |
|-----------|------|------------|
| **Blazor Web** | User interface for chat | .NET 10, Blazor Server |
| **Archives API** | REST endpoint handling | FastEndpoints |
| **RagService** | Orchestration layer | Application Service |
| **QueryPreprocessor** | Query optimization | LLM-based rewriting |
| **Ollama** | Embedding generation | nomic-embed-text model |
| **Qdrant** | Vector similarity search | gRPC, HNSW index |
| **MinIO** | Document content retrieval | S3 API |
| **LLM** | Answer generation | Ollama (local) or OpenAI (cloud) |

## Key Design Decisions

1. **Query Preprocessing**: Rewrites user questions for better semantic matching
2. **Multi-phase Retrieval**: Embed → Search → Filter → Generate
3. **Chunk-level Relevance Filtering**: LLM validates which chunks actually answer the question
4. **Streaming Support**: Real-time response display for better UX
5. **Citation Tracking**: Links answers back to source documents
