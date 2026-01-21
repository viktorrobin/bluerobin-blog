---
title: "About BlueRobin"
description: "The story behind BlueRobin - a personal document management system built on a homelab"
---

# About BlueRobin

BlueRobin started in 2022 as a simple question: *"Why does it take so long to find information in my family's medical records?"*

## The Problem

After years of accumulating medical documents—lab results, doctor's notes, prescriptions, imaging reports—I found myself spending hours searching through PDFs and scanned documents whenever I needed specific information. Traditional file organization wasn't scaling, and searching by filename was useless for medical content.

## The Journey

### Phase 1: Cloud-First (2022)

Like many developers, my first instinct was to build on cloud services. I started with:
- Azure Blob Storage for document storage
- Azure Cognitive Search for full-text search
- A simple ASP.NET Core API
- React frontend

It worked, but the monthly costs added up quickly, especially for AI-powered features. For a personal project, $50-100/month felt excessive.

### Phase 2: The Homelab Pivot (2023)

I had an old server collecting dust. Why not run everything locally?

This sparked a complete architecture redesign:
- **k3s** for lightweight Kubernetes
- **MinIO** replacing Azure Blob Storage
- **PostgreSQL with pgvector** for embeddings and search
- **Flux** for GitOps deployments
- **Ollama** for local LLM inference

The homelab approach forced me to think carefully about resource constraints, which led to better architectural decisions.

### Phase 3: AI Integration (2024-2025)

The explosion of accessible LLMs changed everything:
- **OCR with Docling** for document text extraction
- **Local embeddings** with sentence-transformers
- **RAG pipeline** for natural language queries
- **Hybrid AI architecture** using both local Ollama and cloud APIs

## What BlueRobin Does Today

BlueRobin is a personal document management system that:

1. **Ingests documents** - Upload PDFs, images, or scans
2. **Extracts content** - OCR and text extraction with AI cleanup
3. **Generates embeddings** - Vector representations for semantic search
4. **Extracts entities** - Named entity recognition for people, dates, medications, etc.
5. **Enables search** - Both keyword and semantic search with RAG-powered Q&A

## The Tech Stack

| Component | Technology | Why |
|-----------|------------|-----|
| Frontend | Blazor Server | Real-time UI, C# everywhere |
| API | FastEndpoints | High-performance, clean |
| Database | PostgreSQL + pgvector | Relational + vector in one |
| Messaging | NATS JetStream | Lightweight, powerful |
| Storage | MinIO | S3-compatible, self-hosted |
| AI | Ollama + OpenAI | Local-first, cloud fallback |
| Orchestration | k3s + Flux | GitOps on homelab |

## Why This Blog?

Four years of building BlueRobin taught me patterns I wish I'd known earlier:

- How to implement DDD in a real .NET project
- Event-driven architecture with NATS
- GitOps with Flux for homelab deployments
- Practical RAG pipeline implementation
- Balancing local and cloud AI

This blog documents those learnings—with **real code** from a **production system**.

## About Me

I'm Victor, an Engineering Director who codes on weekends. BlueRobin is my playground for exploring patterns I don't always get to use at work: DDD, event sourcing experiments, LLM integration, and homelab DevOps.

The best way to learn is to build, and the second best way is to teach. This blog is both.

---

*Have questions about BlueRobin or want to discuss patterns? Reach out on [GitHub](https://github.com/victorrentea) or [LinkedIn](https://linkedin.com/in/victorrentea).*
