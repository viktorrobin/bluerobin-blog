---
title: "Microservices Communication"
description: "C4 Container diagram showing service-to-service communication patterns"
diagram_type: "c4"
topic: "architecture"
---

# Microservices Communication

This diagram shows how BlueRobin services communicate with each other, including synchronous API calls and asynchronous event-driven messaging.

## C4 Container View

```mermaid
C4Context
    title BlueRobin System Context

    Person(user, "User", "Document owner who uploads, searches, and asks questions")
    
    System_Boundary(bluerobin, "BlueRobin System") {
        Container(web, "Blazor Web", ".NET 10, Blazor Server", "Server-rendered UI with real-time updates")
        Container(api, "Archives API", ".NET 10, FastEndpoints", "REST API for document operations")
        Container(workers, "Archives Workers", ".NET 10, BackgroundService", "Async document processing pipeline")
    }

    System_Ext(authelia, "Authelia", "OIDC Identity Provider")
    System_Ext(openai, "OpenAI/Azure", "Cloud LLM for complex tasks")

    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "Calls", "REST/HTTPS")
    Rel(web, authelia, "Authenticates", "OIDC")
    Rel(api, authelia, "Validates", "JWT")
    Rel(api, openai, "Generates", "HTTPS")
    Rel(workers, openai, "Analyzes", "HTTPS")
```

## Service Communication Matrix

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        Web["Blazor Web<br/>:8080"]
    end

    subgraph API["API Layer"]
        ArchivesAPI["Archives API<br/>:8080"]
    end

    subgraph Workers["Worker Layer"]
        OcrW["OCR Worker"]
        AnalysisW["Analysis Worker"]
        EmbeddingW["Embedding Workers"]
        NerW["Entity Worker"]
        GraphW["Graph Worker"]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL<br/>:5432)]
        Qdrant[(Qdrant<br/>:6334)]
        MinIO[(MinIO<br/>:9000)]
        FalkorDB[(FalkorDB<br/>:6379)]
    end

    subgraph Messaging["Messaging Layer"]
        NATS{{"NATS JetStream<br/>:4222"}}
    end

    subgraph AI["AI Layer"]
        Ollama["Ollama<br/>:11434"]
        Docling["Docling<br/>:8080"]
        Spacy["Spacy<br/>:8080"]
    end

    %% Sync connections
    Web -->|REST| ArchivesAPI
    ArchivesAPI -->|SQL| PG
    ArchivesAPI -->|gRPC| Qdrant
    ArchivesAPI -->|S3| MinIO
    ArchivesAPI -->|HTTP| Ollama
    ArchivesAPI -->|Cypher| FalkorDB

    %% Async connections (pub/sub)
    ArchivesAPI -.->|Publish| NATS
    Web -.->|Subscribe| NATS
    
    NATS -.->|Consume| OcrW
    NATS -.->|Consume| AnalysisW
    NATS -.->|Consume| EmbeddingW
    NATS -.->|Consume| NerW
    NATS -.->|Consume| GraphW

    OcrW -.->|Publish| NATS
    AnalysisW -.->|Publish| NATS
    EmbeddingW -.->|Publish| NATS
    NerW -.->|Publish| NATS
    GraphW -.->|Publish| NATS

    %% Worker to data
    OcrW -->|HTTP| Docling
    OcrW -->|S3| MinIO
    OcrW -->|SQL| PG
    
    AnalysisW -->|HTTP| Ollama
    AnalysisW -->|SQL| PG
    
    EmbeddingW -->|HTTP| Ollama
    EmbeddingW -->|gRPC| Qdrant
    
    NerW -->|HTTP| Spacy
    NerW -->|SQL| PG
    
    GraphW -->|Cypher| FalkorDB

    style Frontend fill:#e3f2fd
    style API fill:#fff3e0
    style Workers fill:#f3e5f5
    style Data fill:#e8f5e9
    style Messaging fill:#fce4ec
    style AI fill:#fff8e1
```

## Protocol Details

| Source | Target | Protocol | Port | Purpose |
|--------|--------|----------|------|---------|
| Web → API | REST | HTTPS | 8080 | Document CRUD, RAG queries |
| Web → NATS | NATS | TCP | 4222 | Real-time notifications |
| API → PostgreSQL | Npgsql | TCP | 5432 | Metadata persistence |
| API → Qdrant | gRPC | HTTP/2 | 6334 | Vector search |
| API → MinIO | S3 | HTTPS | 9000 | File storage |
| API → Ollama | HTTP | TCP | 11434 | Embeddings, LLM |
| Workers → NATS | NATS | TCP | 4222 | Event consumption |
| Workers → Docling | HTTP | TCP | 8080 | OCR extraction |
| Workers → Spacy | HTTP | TCP | 8080 | NER extraction |
| Workers → FalkorDB | Cypher | TCP | 6379 | Graph queries |

## Communication Patterns

```mermaid
flowchart LR
    subgraph Sync["Synchronous (Request/Response)"]
        direction TB
        A1[Client] -->|Request| A2[Service]
        A2 -->|Response| A1
        A3["✓ REST APIs<br/>✓ gRPC calls<br/>✓ Database queries"]
    end

    subgraph Async["Asynchronous (Event-Driven)"]
        direction TB
        B1[Publisher] -->|Event| B2[Message Broker]
        B2 -->|Deliver| B3[Consumer]
        B4["✓ Document events<br/>✓ Processing pipeline<br/>✓ Real-time updates"]
    end

    subgraph Hybrid["Hybrid (CQRS)"]
        direction TB
        C1[Command] -->|Write| C2[API]
        C2 -->|Event| C3[NATS]
        C3 -->|Update| C4[Read Model]
        C5[Query] -->|Read| C4
    end

    style Sync fill:#e3f2fd
    style Async fill:#fff3e0
    style Hybrid fill:#e8f5e9
```

## Service Dependencies

```mermaid
graph TD
    subgraph Critical["Critical Path"]
        API --> PG
        API --> MinIO
        Web --> API
    end

    subgraph Processing["Processing Path"]
        Workers --> NATS
        Workers --> Ollama
        Workers --> Qdrant
    end

    subgraph Optional["Optional/Degraded"]
        API -.-> FalkorDB
        API -.-> Qdrant
        Workers -.-> Spacy
    end

    style Critical fill:#ffcdd2
    style Processing fill:#fff9c4
    style Optional fill:#c8e6c9
```

## Resilience Patterns

| Pattern | Implementation | Service |
|---------|---------------|---------|
| **Circuit Breaker** | Polly | API → External services |
| **Retry with Backoff** | NatsEventConsumerBase | Workers |
| **Bulkhead** | Semaphore limits | Embedding workers |
| **Timeout** | HttpClient timeout | All HTTP calls |
| **Health Checks** | ASP.NET Health | All services |
| **Graceful Degradation** | Optional features | Graph queries |
