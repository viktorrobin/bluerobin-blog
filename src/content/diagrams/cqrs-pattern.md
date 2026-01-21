---
title: "CQRS Pattern Implementation"
description: "Component diagram showing Command Query Responsibility Segregation in BlueRobin"
diagram_type: "component"
topic: "architecture"
---

# CQRS Pattern Implementation

This diagram shows how BlueRobin implements the CQRS (Command Query Responsibility Segregation) pattern, separating write operations from read-optimized queries.

## CQRS Overview

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        User["User Interface<br/>(Blazor)"]
    end

    subgraph Commands["Command Side (Write)"]
        direction TB
        CmdAPI["Archives API<br/>Write Endpoints"]
        CmdHandler["Command Handlers<br/>(FastEndpoints)"]
        Domain["Domain Model<br/>(Aggregates)"]
        WriteDB[(PostgreSQL<br/>Write Model)]
        Events{{"NATS JetStream<br/>Domain Events"}}
    end

    subgraph Queries["Query Side (Read)"]
        direction TB
        QryAPI["Archives API<br/>Read Endpoints"]
        QryHandler["Query Handlers<br/>(FastEndpoints)"]
        ReadDB[(PostgreSQL<br/>Read Views)]
        VectorDB[(Qdrant<br/>Semantic Search)]
        GraphDB[(FalkorDB<br/>Relationships)]
    end

    subgraph Sync["Synchronization"]
        Projections["Event Projections<br/>(Workers)"]
    end

    User -->|Commands| CmdAPI
    User -->|Queries| QryAPI
    
    CmdAPI --> CmdHandler
    CmdHandler --> Domain
    Domain --> WriteDB
    Domain -.->|Publish| Events

    QryAPI --> QryHandler
    QryHandler --> ReadDB
    QryHandler --> VectorDB
    QryHandler --> GraphDB

    Events -.->|Subscribe| Projections
    Projections --> ReadDB
    Projections --> VectorDB
    Projections --> GraphDB

    style Commands fill:#ffcdd2
    style Queries fill:#c8e6c9
    style Sync fill:#fff9c4
```

## Command Flow Detail

```mermaid
sequenceDiagram
    autonumber
    participant UI as Blazor UI
    participant API as Archives API
    participant Endpoint as UploadDocumentEndpoint
    participant Service as DocumentService
    participant Domain as Document Aggregate
    participant DB as PostgreSQL
    participant NATS as NATS JetStream

    UI->>API: POST /api/documents<br/>{file, metadata}
    API->>Endpoint: Route to handler
    
    rect rgb(255, 235, 238)
        Note over Endpoint,Domain: Command Processing
        Endpoint->>Service: UploadAsync(request)
        Service->>Domain: Document.Create(...)
        Domain->>Domain: Validate invariants
        Domain->>Domain: RaiseDomainEvent(DocumentAdded)
    end

    rect rgb(232, 245, 233)
        Note over Service,NATS: Persistence & Event Publishing
        Service->>DB: SaveChangesAsync()
        DB-->>Service: Committed
        Service->>NATS: Publish: documents.uploaded
    end

    Service-->>Endpoint: DocumentId
    Endpoint-->>API: 201 Created
    API-->>UI: Response with ID
```

## Query Flow Detail

```mermaid
sequenceDiagram
    autonumber
    participant UI as Blazor UI
    participant API as Archives API
    participant Endpoint as SearchDocumentsEndpoint
    participant Service as RagService
    participant Qdrant as Qdrant<br/>(Read Model)
    participant PG as PostgreSQL<br/>(Metadata)
    participant MinIO as MinIO<br/>(Content)

    UI->>API: POST /api/rag/search<br/>{query, filters}
    API->>Endpoint: Route to handler
    
    rect rgb(232, 245, 233)
        Note over Endpoint,MinIO: Query Processing (No DB Writes)
        Endpoint->>Service: SearchAsync(query)
        Service->>Service: Generate query embedding
        Service->>Qdrant: Vector similarity search
        Qdrant-->>Service: Matching chunk IDs + scores
        Service->>PG: Get document metadata<br/>(read-only view)
        PG-->>Service: Document details
        Service->>MinIO: Fetch content snippets
        MinIO-->>Service: Text content
    end

    Service-->>Endpoint: SearchResults
    Endpoint-->>API: 200 OK
    API-->>UI: Results with snippets
```

## Event Projection Pipeline

```mermaid
flowchart LR
    subgraph Source["Event Source"]
        E1["DocumentAdded"]
        E2["AnalysisCompleted"]
        E3["EmbeddingsCompleted"]
        E4["EntitiesExtracted"]
    end

    subgraph Workers["Projection Workers"]
        P1["DbUpdateEventConsumer<br/>Updates PostgreSQL views"]
        P2["EmbeddingAggregator<br/>Updates Qdrant"]
        P3["GraphSyncConsumer<br/>Updates FalkorDB"]
    end

    subgraph ReadModels["Read Models"]
        RM1[(PostgreSQL<br/>Document views)]
        RM2[(Qdrant<br/>Vector index)]
        RM3[(FalkorDB<br/>Entity graph)]
    end

    E1 & E2 --> P1
    E3 --> P2
    E4 --> P3

    P1 --> RM1
    P2 --> RM2
    P3 --> RM3

    style Source fill:#ffcdd2
    style Workers fill:#fff9c4
    style ReadModels fill:#c8e6c9
```

## Read Model Optimization

```mermaid
flowchart TB
    subgraph Queries["Query Types"]
        Q1["List documents<br/>(paginated)"]
        Q2["Full-text search<br/>(keywords)"]
        Q3["Semantic search<br/>(meaning)"]
        Q4["Entity lookup<br/>(relationships)"]
        Q5["RAG query<br/>(Q&A)"]
    end

    subgraph Optimized["Optimized Read Stores"]
        DB1[(PostgreSQL<br/>B-tree indexes<br/>GIN for arrays)]
        DB2[(PostgreSQL<br/>tsvector FTS)]
        DB3[(Qdrant<br/>HNSW index)]
        DB4[(FalkorDB<br/>Graph traversal)]
    end

    Q1 --> DB1
    Q2 --> DB2
    Q3 --> DB3
    Q4 --> DB4
    Q5 --> DB3
    Q5 --> DB1

    style Queries fill:#e3f2fd
    style Optimized fill:#e8f5e9
```

## CQRS Benefits in BlueRobin

| Benefit | Implementation | Impact |
|---------|---------------|--------|
| **Scalability** | Separate read/write DBs | Scale reads independently |
| **Performance** | Denormalized views | Fast queries, no joins |
| **Flexibility** | Multiple read models | Qdrant + FalkorDB + PG |
| **Consistency** | Eventual via events | Acceptable for search |
| **Auditability** | Event log in NATS | Full history available |

## Commands vs Queries

```mermaid
mindmap
  root((CQRS))
    Commands
      POST /api/documents
        Upload file
        Create metadata
        Publish event
      PUT /api/documents/{id}
        Update analysis
        Update status
      DELETE /api/documents/{id}
        Mark deleted
        Publish event
    Queries
      GET /api/documents
        List with filters
        Paginated results
      POST /api/rag/search
        Vector similarity
        Score ranking
      POST /api/rag/ask
        Context retrieval
        LLM generation
      GET /api/graph/entities
        Graph traversal
        Relationship lookup
```

## Consistency Model

| Operation | Consistency | Latency | Use Case |
|-----------|-------------|---------|----------|
| **Create document** | Strong | ~100ms | Write to PG |
| **Update metadata** | Strong | ~50ms | Write to PG |
| **Search by keyword** | Eventual | ~200ms | PG FTS index |
| **Semantic search** | Eventual | ~500ms | Qdrant after embedding |
| **Graph query** | Eventual | ~300ms | FalkorDB after sync |
| **RAG response** | Eventual | ~2s | Full pipeline |
