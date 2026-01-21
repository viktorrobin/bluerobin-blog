---
title: "Domain Model"
description: "Class diagram showing the DDD domain model with aggregates, entities, and value objects"
diagram_type: "class"
topic: "architecture"
---

# Domain Model

This diagram illustrates the Domain-Driven Design (DDD) model in BlueRobin, showing aggregates, entities, value objects, and their relationships.

## Aggregate Structure

```mermaid
classDiagram
    direction TB

    class AggregateRoot {
        <<abstract>>
        +BlueRobinId Id
        -List~IDomainEvent~ _domainEvents
        +RaiseDomainEvent(event)
        +ClearDomainEvents()
    }

    class Entity {
        <<abstract>>
        +BlueRobinId Id
    }

    class Archive {
        <<Aggregate Root>>
        +BlueRobinId Id
        +string Name
        +BlueRobinId CreatedBy
        +DateTime CreatedOn
        +Create(name, createdBy)$ Archive
    }

    class Document {
        <<Aggregate Root>>
        +BlueRobinId Id
        +BlueRobinId ArchiveId
        +BlueRobinId CreatedBy
        +DocumentStatus Status
        +DocumentMetadata Metadata
        +DocumentAnalysis Analysis
        +DocumentClassification Classification
        +ProcessingMetrics Metrics
        +DateTime CreatedOnUtc
        +Create(archiveId, createdBy, fingerPrint, fileName, fileSize, contentType)$ Document
        +UpdateStatus(status)
        +RecordOcrTime(ms)
        +RecordAnalysisTime(ms)
        +UpdateAnalysis(summary, keywords, friendlyName)
    }

    class ApplicationUser {
        <<Aggregate Root>>
        +BlueRobinId Id
        +string ExternalId
        +string Email
        +string DisplayName
        +bool IsActive
        +DateTime CreatedAt
        +DateTime? LastLoginAt
    }

    class CanonicalEntity {
        <<Aggregate Root>>
        +BlueRobinId Id
        +string Name
        +string Type
        +BlueRobinId OwnerUserId
        +string? NormalizedName
        +Create(name, type, ownerId)$ CanonicalEntity
    }

    class EntityRelationship {
        <<Aggregate Root>>
        +BlueRobinId Id
        +BlueRobinId SourceEntityId
        +BlueRobinId TargetEntityId
        +BlueRobinId RelationshipTypeId
        +BlueRobinId DocumentId
    }

    AggregateRoot <|-- Archive
    AggregateRoot <|-- Document
    AggregateRoot <|-- ApplicationUser
    AggregateRoot <|-- CanonicalEntity
    AggregateRoot <|-- EntityRelationship
    Entity <|-- AggregateRoot
```

## Value Objects

```mermaid
classDiagram
    direction LR

    class BlueRobinId {
        <<Value Object>>
        +string Value
        +New()$ BlueRobinId
        +From(string)$ BlueRobinId
        -GenerateId()$ string
        Note: 10-char alphanumeric
    }

    class FingerPrint {
        <<Value Object>>
        +string Hash
        +FromContent(bytes)$ FingerPrint
        +FromStream(stream)$ FingerPrint
        Note: SHA256 hash
    }

    class DocumentMetadata {
        <<Value Object>>
        +string FileName
        +string ContentType
        +long FileSize
        +string ObjectName
        +FingerPrint FingerPrint
        +int PageCount
        +CreateWithGeneratedObjectName(...)$ DocumentMetadata
    }

    class DocumentAnalysis {
        <<Value Object>>
        +string? Summary
        +string? Keywords
        +string? FriendlyName
        +int ChunkCount
        +Empty()$ DocumentAnalysis
        +WithSummary(summary)
        +WithKeywords(keywords)
        +WithFriendlyName(name)
    }

    class DocumentClassification {
        <<Value Object>>
        +string Category
        +float Confidence
        +DateTime? ClassifiedAt
        +Unclassified()$ DocumentClassification
        +Create(category, confidence)$ DocumentClassification
    }

    class ProcessingMetrics {
        <<Value Object>>
        +long? OcrTimeMs
        +long? AnalysisTimeMs
        +long? EmbeddingTimeMs
        +long? TotalTimeMs
        +Empty()$ ProcessingMetrics
        +WithOcrTime(ms)
        +WithAnalysisTime(ms)
    }

    class ObjectReference {
        <<Value Object>>
        +string Bucket
        +string Key
        +Create(bucket, key)$ ObjectReference
    }

    class SearchFilters {
        <<Value Object>>
        +string? Query
        +DateRange? DateRange
        +string[]? Categories
        +string[]? Keywords
    }
```

## Document Aggregate Detail

```mermaid
classDiagram
    direction TB

    class Document {
        <<Aggregate Root>>
        +BlueRobinId Id
        +BlueRobinId ArchiveId
        +BlueRobinId CreatedBy
        +DocumentStatus Status
        +DocumentMetadata Metadata
        +DocumentAnalysis Analysis
        +DocumentClassification Classification
        +ProcessingMetrics Metrics
    }

    class DocumentMetadata {
        <<Value Object>>
        +string FileName
        +string ContentType
        +long FileSize
        +string ObjectName
        +FingerPrint FingerPrint
        +int PageCount
    }

    class DocumentAnalysis {
        <<Value Object>>
        +string? Summary
        +string? Keywords
        +string? FriendlyName
        +int ChunkCount
    }

    class DocumentClassification {
        <<Value Object>>
        +string Category
        +float Confidence
        +DateTime? ClassifiedAt
    }

    class ProcessingMetrics {
        <<Value Object>>
        +long? OcrTimeMs
        +long? AnalysisTimeMs
        +long? EmbeddingTimeMs
    }

    class DocumentStatus {
        <<Enumeration>>
        Pending
        Processing
        Completed
        Failed
    }

    class FingerPrint {
        <<Value Object>>
        +string Hash
    }

    Document *-- DocumentMetadata : contains
    Document *-- DocumentAnalysis : contains
    Document *-- DocumentClassification : contains
    Document *-- ProcessingMetrics : contains
    Document --> DocumentStatus : has
    DocumentMetadata *-- FingerPrint : contains
```

## Domain Events

```mermaid
classDiagram
    direction TB

    class IDomainEvent {
        <<interface>>
        +DateTime OccurredAt
    }

    class DocumentAddedEvent {
        +BlueRobinId DocumentId
        +BlueRobinId ArchiveId
        +BlueRobinId CreatedBy
        +string FileName
        +string ContentType
        +long FileSize
        +string ObjectName
    }

    class DocumentStatusChangedEvent {
        +BlueRobinId DocumentId
        +DocumentStatus OldStatus
        +DocumentStatus NewStatus
    }

    class DocumentAnalysisUpdatedEvent {
        +BlueRobinId DocumentId
        +string Summary
        +string Keywords
        +string FriendlyName
    }

    IDomainEvent <|.. DocumentAddedEvent
    IDomainEvent <|.. DocumentStatusChangedEvent
    IDomainEvent <|.. DocumentAnalysisUpdatedEvent
```

## Repository Interfaces

```mermaid
classDiagram
    direction TB

    class IRepository~T~ {
        <<interface>>
        +GetByIdAsync(id) Task~T?~
        +AddAsync(entity) Task
        +UpdateAsync(entity) Task
        +DeleteAsync(entity) Task
    }

    class IDocumentsRepository {
        <<interface>>
        +GetByArchiveIdAsync(archiveId) Task~List~Document~~
        +GetByFingerprintAsync(fingerprint) Task~Document?~
        +GetByUserIdAsync(userId, filters) Task~PagedResult~Document~~
    }

    class IArchivesRepository {
        <<interface>>
        +GetByOwnerIdAsync(ownerId) Task~Archive?~
        +ExistsAsync(id) Task~bool~
    }

    class IUsersRepository {
        <<interface>>
        +GetByExternalIdAsync(externalId) Task~ApplicationUser?~
        +GetByEmailAsync(email) Task~ApplicationUser?~
    }

    IRepository <|-- IDocumentsRepository
    IRepository <|-- IArchivesRepository
    IRepository <|-- IUsersRepository
```

## Key DDD Patterns Used

| Pattern | Implementation | Example |
|---------|---------------|---------|
| **Aggregate Root** | `AggregateRoot` base class | Document, Archive |
| **Value Object** | Immutable records | BlueRobinId, FingerPrint |
| **Domain Event** | Event sourcing | DocumentAddedEvent |
| **Factory Method** | Static `Create()` methods | `Document.Create(...)` |
| **Repository** | Interface per aggregate | IDocumentsRepository |
| **Specification** | Search filters | SearchFilters |
