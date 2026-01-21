/*
 * BlueRobin Architecture - Structurizr DSL
 * C4 Model for Personal Document Management System
 * 
 * Usage:
 *   - Open at https://structurizr.com/dsl
 *   - Or use structurizr-cli: structurizr-cli export -workspace bluerobin.dsl -format plantuml
 */

workspace "BlueRobin" "Personal Document Management System with AI-Powered Search" {

    !identifiers hierarchical

    model {
        # External Systems
        user = person "User" "A person who manages personal documents and searches for information" "User"
        
        autheliaIdp = softwareSystem "Authelia" "OpenID Connect Identity Provider for authentication" "External System"
        openAiApi = softwareSystem "OpenAI/Azure OpenAI" "Cloud LLM for complex reasoning tasks" "External System"
        
        # BlueRobin System
        blueRobin = softwareSystem "BlueRobin" "Personal document management system with AI-powered semantic search and RAG capabilities" {
            
            # Frontend Container
            blazorWeb = container "Blazor Web App" "Server-side Blazor application providing interactive UI for document management" ".NET 10, Blazor Server, Tailwind CSS 4" "Web Browser" {
                documentUpload = component "Document Upload" "Handles file upload with drag-drop, validation, and progress tracking" "Blazor Component"
                documentBrowser = component "Document Browser" "Displays documents with grid/list views, filtering, and sorting" "Blazor Component"
                ragChat = component "RAG Chat Interface" "Conversational UI for asking questions about documents" "Blazor Component"
                authHandler = component "Auth Handler" "Manages OIDC authentication flow with Authelia" "OIDC Client"
                notificationHub = component "Notification Hub" "Receives real-time document processing updates" "NATS Subscriber"
            }

            # API Container
            archivesApi = container "Archives API" "RESTful API providing document management, search, and RAG endpoints" ".NET 10, FastEndpoints" "API" {
                documentEndpoints = component "Document Endpoints" "CRUD operations for documents: upload, download, delete, metadata" "FastEndpoints"
                ragEndpoints = component "RAG Endpoints" "Question-answering with context retrieval and streaming responses" "FastEndpoints"
                searchEndpoints = component "Search Endpoints" "Semantic and hybrid search across user documents" "FastEndpoints"
                graphEndpoints = component "Graph Endpoints" "Entity and relationship queries from knowledge graph" "FastEndpoints"
                userEndpoints = component "User Endpoints" "User profile, preferences, and account management" "FastEndpoints"
                authMiddleware = component "Auth Middleware" "JWT validation and user context extraction" "ASP.NET Middleware"
            }

            # Application Layer
            applicationServices = container "Application Services" "Business logic and orchestration layer" ".NET 10" "Service" {
                ragService = component "RAG Service" "Orchestrates semantic search, context building, and LLM generation" "Application Service"
                documentService = component "Document Service" "Document lifecycle management and metadata operations" "Application Service"
                archiveResolver = component "Archive Resolver" "Resolves user context to storage archive mapping" "Application Service"
                embeddingService = component "Embedding Service" "Generates embeddings using Ollama models" "Application Service"
                aiService = component "AI Service" "LLM interactions for generation, classification, analysis" "Application Service"
                queryPreprocessor = component "Query Preprocessor" "Rewrites queries for better semantic matching" "Application Service"
            }

            # Workers Container
            archivesWorkers = container "Archives Workers" "Background processing for document ingestion pipeline" ".NET 10, BackgroundService" "Worker" {
                ocrWorker = component "OCR Worker" "Extracts text from PDFs using Docling service" "Event Consumer"
                analysisWorker = component "Content Analysis Worker" "Generates summaries, keywords, friendly names via LLM" "Event Consumer"
                chunkingWorker = component "Chunking Worker" "Splits documents into semantic chunks for embedding" "Event Consumer"
                embeddingFanout = component "Embedding Fanout" "Distributes chunks to multiple embedding model workers" "Event Publisher"
                chunkEmbedding = component "Chunk Embedding Worker" "Generates vector embeddings per model" "Event Consumer"
                embeddingAggregator = component "Embedding Aggregator" "Tracks completion across all models for a document" "Event Consumer"
                classificationWorker = component "Classification Worker" "Categorizes documents using LLM" "Event Consumer"
                entityExtraction = component "Entity Extraction" "Extracts named entities using Spacy NER" "Event Consumer"
                graphSync = component "Graph Sync Worker" "Syncs entities and relationships to FalkorDB" "Event Consumer"
            }

            # Data Stores
            postgresql = container "PostgreSQL" "Stores user accounts, document metadata, archives, entity types" "PostgreSQL 16, CNPG" "Database" {
                usersTable = component "Users Table" "Application user accounts linked to OIDC identities" "Table"
                documentsTable = component "Documents Table" "Document metadata, status, analysis results" "Table"
                archivesTable = component "Archives Table" "User document collections" "Table"
                entityTypesTable = component "Entity Types Table" "Canonical entity definitions" "Table"
            }

            qdrant = container "Qdrant" "Vector database storing document embeddings for semantic search" "Qdrant" "Database" {
                nomicCollection = component "nomic-embed-text" "Primary embedding model collection" "Vector Collection"
                mxbaiCollection = component "mxbai-embed-large" "Secondary embedding model collection" "Vector Collection"
                snowflakeCollection = component "snowflake-arctic-embed" "Tertiary embedding model collection" "Vector Collection"
                bgeCollection = component "bge-large-en" "BGE model collection" "Vector Collection"
            }

            minio = container "MinIO" "S3-compatible object storage for document files" "MinIO with SSE-KMS" "Storage" {
                userBuckets = component "User Buckets" "Per-user encrypted buckets: {env}-{bluerobinId}" "Bucket"
                processedContent = component "Processed Content" "OCR text stored at processed/{docId}/content.md" "Object Path"
            }

            nats = container "NATS JetStream" "Message broker for event-driven document processing pipeline" "NATS 2.x" "Messaging" {
                documentStream = component "Document Stream" "Document lifecycle events (uploaded, ocr.completed, etc.)" "Stream"
                embeddingStream = component "Embedding Stream" "Per-model embedding job distribution" "Stream"
                userStream = component "User Stream" "User provisioning and sync events" "Stream"
            }

            falkordb = container "FalkorDB" "Graph database for entity relationships and knowledge graph" "FalkorDB (Redis Graph)" "Database" {
                entitiesGraph = component "Entities Graph" "Named entities extracted from documents" "Graph"
                relationshipsGraph = component "Relationships Graph" "Connections between entities" "Graph"
            }

            # AI Services
            ollama = container "Ollama" "Self-hosted LLM and embedding model server" "Ollama" "AI" {
                embeddingModels = component "Embedding Models" "8 models: nomic, mxbai, snowflake, bge, granite, etc." "Model Server"
                llmModels = component "LLM Models" "Fast inference models for analysis and classification" "Model Server"
            }

            docling = container "Docling OCR" "PDF text extraction service using IBM Docling" "Python, FastAPI" "AI" {
                pdfExtractor = component "PDF Extractor" "Extracts text and structure from PDF documents" "Service"
            }

            spacyNer = container "Spacy NER" "Named Entity Recognition service" "Python, Spacy" "AI" {
                nerExtractor = component "NER Extractor" "Extracts named entities: persons, orgs, locations, dates" "Service"
            }
        }

        # Relationships - User to System
        user -> blueRobin.blazorWeb "Manages documents, searches, asks questions" "HTTPS"
        user -> autheliaIdp "Authenticates via" "OIDC"
        
        # Relationships - Frontend
        blueRobin.blazorWeb -> blueRobin.archivesApi "Makes API calls" "HTTPS/REST"
        blueRobin.blazorWeb -> autheliaIdp "Validates tokens" "OIDC"
        blueRobin.blazorWeb -> blueRobin.nats "Subscribes to document updates" "NATS"
        
        # Relationships - API to Services
        blueRobin.archivesApi -> blueRobin.applicationServices "Uses business logic" "In-Process"
        blueRobin.archivesApi -> autheliaIdp "Validates JWT tokens" "OIDC"
        
        # Relationships - Application Services
        blueRobin.applicationServices -> blueRobin.postgresql "Reads/writes metadata" "Npgsql"
        blueRobin.applicationServices -> blueRobin.qdrant "Searches vectors" "gRPC"
        blueRobin.applicationServices -> blueRobin.minio "Reads documents" "S3 API"
        blueRobin.applicationServices -> blueRobin.ollama "Generates embeddings, LLM calls" "HTTP"
        blueRobin.applicationServices -> openAiApi "Complex reasoning tasks" "HTTPS"
        blueRobin.applicationServices -> blueRobin.falkordb "Queries knowledge graph" "Redis Protocol"
        
        # Relationships - Workers
        blueRobin.archivesWorkers -> blueRobin.nats "Consumes/publishes events" "NATS"
        blueRobin.archivesWorkers -> blueRobin.postgresql "Updates document status" "Npgsql"
        blueRobin.archivesWorkers -> blueRobin.qdrant "Stores embeddings" "gRPC"
        blueRobin.archivesWorkers -> blueRobin.minio "Reads/writes content" "S3 API"
        blueRobin.archivesWorkers -> blueRobin.ollama "Generates embeddings" "HTTP"
        blueRobin.archivesWorkers -> blueRobin.docling "Extracts text from PDFs" "HTTP"
        blueRobin.archivesWorkers -> blueRobin.spacyNer "Extracts named entities" "HTTP"
        blueRobin.archivesWorkers -> blueRobin.falkordb "Syncs entities to graph" "Redis Protocol"
        
        # Relationships - Internal Component Level
        blueRobin.archivesApi.ragEndpoints -> blueRobin.applicationServices.ragService "Delegates to"
        blueRobin.applicationServices.ragService -> blueRobin.applicationServices.embeddingService "Generates query embedding"
        blueRobin.applicationServices.ragService -> blueRobin.qdrant "Searches similar chunks"
        blueRobin.applicationServices.ragService -> blueRobin.minio "Retrieves full content"
        blueRobin.applicationServices.ragService -> blueRobin.ollama "Generates response"

        # Deployment Model
        deploymentEnvironment "Production" {
            deploymentNode "K3s Cluster" "Kubernetes cluster running on dedicated hardware" "K3s 1.30" {
                deploymentNode "archives-prod Namespace" "Production workloads" "Kubernetes Namespace" {
                    containerInstance blueRobin.blazorWeb
                    containerInstance blueRobin.archivesApi
                    containerInstance blueRobin.archivesWorkers
                }
                
                deploymentNode "data-layer Namespace" "Shared data infrastructure" "Kubernetes Namespace" {
                    containerInstance blueRobin.postgresql
                    containerInstance blueRobin.qdrant
                    containerInstance blueRobin.minio
                    containerInstance blueRobin.nats
                    containerInstance blueRobin.falkordb
                }
                
                deploymentNode "ai Namespace" "AI/ML services" "Kubernetes Namespace" {
                    containerInstance blueRobin.ollama
                    containerInstance blueRobin.docling
                    containerInstance blueRobin.spacyNer
                }
            }
            
            deploymentNode "External Services" "" "Cloud" {
                softwareSystemInstance autheliaIdp
                softwareSystemInstance openAiApi
            }
        }
    }

    views {
        # System Context View
        systemContext blueRobin "SystemContext" {
            include *
            autoLayout
            title "BlueRobin - System Context"
            description "High-level view showing BlueRobin and external systems"
        }

        # Container View
        container blueRobin "Containers" {
            include *
            autoLayout
            title "BlueRobin - Container View"
            description "Shows all containers/services within BlueRobin"
        }

        # Component View - API
        component blueRobin.archivesApi "ApiComponents" {
            include *
            autoLayout
            title "Archives API - Components"
            description "FastEndpoints and middleware within the API"
        }

        # Component View - Workers
        component blueRobin.archivesWorkers "WorkerComponents" {
            include *
            autoLayout
            title "Archives Workers - Components"
            description "Background workers for document processing pipeline"
        }

        # Component View - Application Services
        component blueRobin.applicationServices "ApplicationComponents" {
            include *
            autoLayout
            title "Application Services - Components"
            description "Business logic and orchestration services"
        }

        # Deployment View
        deployment blueRobin "Production" "ProductionDeployment" {
            include *
            autoLayout
            title "BlueRobin - Production Deployment"
            description "K3s cluster deployment topology"
        }

        # Dynamic View - Document Upload Flow
        dynamic blueRobin "DocumentUploadFlow" {
            title "Document Upload and Processing Pipeline"
            user -> blueRobin.blazorWeb "1. Uploads document"
            blueRobin.blazorWeb -> blueRobin.archivesApi "2. POST /api/documents"
            blueRobin.archivesApi -> blueRobin.minio "3. Stores file"
            blueRobin.archivesApi -> blueRobin.postgresql "4. Creates metadata"
            blueRobin.archivesApi -> blueRobin.nats "5. Publishes uploaded event"
            blueRobin.archivesWorkers -> blueRobin.nats "6. Consumes event"
            blueRobin.archivesWorkers -> blueRobin.docling "7. Extracts text (OCR)"
            blueRobin.archivesWorkers -> blueRobin.minio "8. Stores extracted text"
            blueRobin.archivesWorkers -> blueRobin.nats "9. Publishes ocr.completed"
            blueRobin.archivesWorkers -> blueRobin.ollama "10. Generates analysis"
            blueRobin.archivesWorkers -> blueRobin.nats "11. Publishes analysis.completed"
            blueRobin.archivesWorkers -> blueRobin.ollama "12. Generates embeddings (8 models)"
            blueRobin.archivesWorkers -> blueRobin.qdrant "13. Stores vectors"
            blueRobin.archivesWorkers -> blueRobin.spacyNer "14. Extracts entities"
            blueRobin.archivesWorkers -> blueRobin.falkordb "15. Syncs to graph"
            blueRobin.archivesWorkers -> blueRobin.nats "16. Publishes completed"
            blueRobin.nats -> blueRobin.blazorWeb "17. Real-time update"
            autoLayout
        }

        # Dynamic View - RAG Query Flow
        dynamic blueRobin "RagQueryFlow" {
            title "RAG Query Pipeline"
            user -> blueRobin.blazorWeb "1. Asks question"
            blueRobin.blazorWeb -> blueRobin.archivesApi "2. POST /api/rag/ask"
            blueRobin.archivesApi -> blueRobin.applicationServices "3. RagService.AskAsync()"
            blueRobin.applicationServices -> blueRobin.ollama "4. Embed query (nomic)"
            blueRobin.applicationServices -> blueRobin.qdrant "5. Vector similarity search"
            blueRobin.applicationServices -> blueRobin.minio "6. Retrieve full content"
            blueRobin.applicationServices -> blueRobin.ollama "7. Filter relevant chunks (LLM)"
            blueRobin.applicationServices -> blueRobin.ollama "8. Generate answer (LLM)"
            blueRobin.archivesApi -> blueRobin.blazorWeb "9. Stream response"
            autoLayout
        }

        styles {
            element "Person" {
                background #08427b
                color #ffffff
                shape Person
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "External System" {
                background #999999
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
            element "Web Browser" {
                shape WebBrowser
            }
            element "Database" {
                shape Cylinder
            }
            element "Storage" {
                shape Folder
            }
            element "Messaging" {
                shape Pipe
            }
            element "Worker" {
                shape Hexagon
            }
            element "AI" {
                background #ff6b6b
                color #ffffff
            }
            element "API" {
                shape RoundedBox
            }
            element "Service" {
                shape Component
            }
        }
    }
}
