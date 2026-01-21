---
title: "Event-Driven Architecture"
description: "Sequence diagram showing NATS JetStream event flow for document processing"
diagram_type: "sequence"
topic: "architecture"
---

# Event-Driven Architecture

This diagram illustrates how BlueRobin uses NATS JetStream for asynchronous, event-driven document processing with guaranteed delivery.

## Event Flow Sequence

```mermaid
sequenceDiagram
    autonumber
    participant API as Archives API
    participant NATS as NATS JetStream
    participant OCR as OCR Worker
    participant Analysis as Analysis Worker
    participant Chunking as Chunking Worker
    participant Fanout as Embedding Fanout
    participant Embed as Chunk Embedding<br/>(per model)
    participant Agg as Embedding Aggregator
    participant NER as Entity Extraction
    participant Graph as Graph Sync
    participant Class as Classification
    participant Blazor as Blazor Web

    Note over NATS: Stream: ARCHIVES-DOCUMENTS<br/>Retention: WorkQueue<br/>MaxDeliver: 3

    rect rgb(230, 245, 255)
        Note right of API: Upload Phase
        API->>NATS: Publish: documents.uploaded<br/>{docId, bucket, fileName}
        NATS-->>OCR: Deliver (ack required)
    end

    rect rgb(255, 243, 224)
        Note right of OCR: OCR Phase
        OCR->>OCR: Process with Docling
        OCR->>NATS: Ack: documents.uploaded
        OCR->>NATS: Publish: documents.ocr.completed<br/>{docId, textLength, pageCount}
        NATS-->>Analysis: Deliver
    end

    rect rgb(243, 229, 245)
        Note right of Analysis: Analysis Phase
        Analysis->>Analysis: Generate summary, keywords<br/>via Ollama LLM
        Analysis->>NATS: Ack: documents.ocr.completed
        Analysis->>NATS: Publish: documents.analysis.completed<br/>{docId, summary, keywords}
        NATS-->>Chunking: Deliver
    end

    rect rgb(232, 245, 233)
        Note right of Chunking: Chunking Phase
        Chunking->>Chunking: Split into semantic chunks
        Chunking->>NATS: Ack: documents.analysis.completed
        
        loop For each chunk
            Chunking->>NATS: Publish: documents.chunks.created<br/>{docId, chunkIdx, text}
        end
        
        NATS-->>Fanout: Deliver chunk events
    end

    rect rgb(252, 228, 236)
        Note right of Fanout: Embedding Fanout Phase
        Fanout->>Fanout: Read chunk event
        
        par Fan out to 8 models
            Fanout->>NATS: Publish: embeddings.nomic<br/>{chunkId, text}
            Fanout->>NATS: Publish: embeddings.mxbai<br/>{chunkId, text}
            Fanout->>NATS: Publish: embeddings.snowflake<br/>{chunkId, text}
            Fanout->>NATS: Publish: embeddings.bge<br/>{chunkId, text}
            Note right of Fanout: ...and 4 more models
        end
        
        Fanout->>NATS: Ack: documents.chunks.created
        NATS-->>Embed: Deliver to model workers
    end

    rect rgb(224, 242, 241)
        Note right of Embed: Embedding Phase (parallel)
        par 8 model workers processing
            Embed->>Embed: Generate vector via Ollama
            Embed->>Embed: Store in Qdrant collection
            Embed->>NATS: Publish: embeddings.{model}.completed<br/>{docId, chunkId, modelId}
            Embed->>NATS: Ack: embeddings.{model}
        end
        
        NATS-->>Agg: Deliver completion events
    end

    rect rgb(224, 247, 250)
        Note right of Agg: Aggregation Phase
        loop Until all 8 models complete
            Agg->>Agg: Track completion per doc
            Agg->>NATS: Ack: embeddings.*.completed
        end
        
        Agg->>NATS: Publish: documents.embeddings.completed<br/>{docId, modelCount, totalVectors}
        NATS-->>NER: Deliver
    end

    rect rgb(255, 248, 225)
        Note right of NER: Entity Extraction Phase
        NER->>NER: Extract via Spacy NER
        NER->>NATS: Ack: embeddings.completed
        NER->>NATS: Publish: documents.entities.extracted<br/>{docId, entityIds[]}
        NATS-->>Graph: Deliver
    end

    rect rgb(241, 248, 233)
        Note right of Graph: Graph Sync Phase
        Graph->>Graph: Sync to FalkorDB
        Graph->>NATS: Ack: entities.extracted
        Graph->>NATS: Publish: documents.graph.synced<br/>{docId, entityCount}
        NATS-->>Class: Deliver
    end

    rect rgb(232, 234, 246)
        Note right of Class: Classification Phase
        Class->>Class: Classify via LLM
        Class->>NATS: Ack: graph.synced
        Class->>NATS: Publish: documents.classified<br/>{docId, category}
    end

    rect rgb(179, 229, 252)
        Note right of Blazor: Real-time Update
        NATS-->>Blazor: Deliver: documents.classified
        Blazor->>Blazor: Update UI component state
        Blazor->>Blazor: Show "Document Ready" notification
    end
```

## NATS JetStream Configuration

```mermaid
flowchart LR
    subgraph Streams["JetStream Streams"]
        S1["📬 ARCHIVES-DOCUMENTS<br/>subjects: archives.documents.>"]
        S2["📬 ARCHIVES-EMBEDDINGS<br/>subjects: archives.embeddings.>"]
        S3["📬 ARCHIVES-USERS<br/>subjects: archives.users.>"]
    end

    subgraph Consumers["Consumer Groups"]
        C1["OCR Consumer<br/>filter: documents.uploaded"]
        C2["Analysis Consumer<br/>filter: documents.ocr.completed"]
        C3["Chunking Consumer<br/>filter: documents.analysis.completed"]
        C4["Fanout Consumer<br/>filter: documents.chunks.created"]
        C5["Model Workers<br/>filter: embeddings.{model}"]
        C6["Aggregator<br/>filter: embeddings.*.completed"]
    end

    S1 --> C1 & C2 & C3 & C4
    S2 --> C5 & C6
```

## Delivery Guarantees

| Feature | Configuration | Purpose |
|---------|--------------|---------|
| **AckPolicy** | Explicit | Manual acknowledgment required |
| **MaxDeliver** | 3 | Retry up to 3 times on failure |
| **AckWait** | 30s | Time to process before redelivery |
| **DeliverPolicy** | All | Start from beginning on new consumer |
| **ReplayPolicy** | Instant | Process as fast as possible |
| **MaxAckPending** | 1000 | Backpressure control |

## Error Recovery Pattern

```mermaid
flowchart TD
    A[Message Received] --> B{Process OK?}
    B -->|Yes| C[Ack Message]
    B -->|No| D{Retries < 3?}
    D -->|Yes| E[NAK with delay<br/>exponential backoff]
    D -->|No| F[Move to DLQ<br/>dead-letter queue]
    E --> G[Wait: 2^retry seconds]
    G --> A
    F --> H[Alert: Manual review<br/>required]
```

## Benefits of Event-Driven Design

1. **Loose Coupling**: Workers don't know about each other
2. **Scalability**: Add worker replicas independently
3. **Resilience**: Failed steps don't block pipeline
4. **Observability**: Events provide audit trail
5. **Flexibility**: Easy to add new processing steps
