# BMAD-Driven SDLC Platform Web UI Backend Architecture Document

## Introduction

This document outlines the backend architecture for **BMAD-Driven SDLC Platform Web UI**, including Python-based backend systems, Azure cloud deployment, and integration patterns. It serves as the definitive architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies.

**Relationship to Frontend Architecture:**
Since this project includes a significant user interface, a separate Frontend Architecture Document will detail the frontend-specific design and MUST be used in conjunction with this document. Core technology stack choices documented herein (see "Tech Stack") are definitive for the entire project, including any frontend components.

### Starter Template or Existing Project

Based on the PRD analysis, this is a **greenfield project** requiring custom architecture due to its unique requirements for:
- Multi-format document processing (.doc, .xlsx, PDF, Figma)
- BMAD agent orchestration
- Complex GitHub and Figma integrations
- Bidirectional format translation

**Decision:** N/A - This is a greenfield project requiring custom Python backend architecture from scratch, optimized for Azure cloud services.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-11-10 | 1.0 | Initial architecture document creation | Winston (Architect) |
| 2025-11-11 | 2.0 | Updated for Python backend with Azure deployment | Winston (Architect) |

## High Level Architecture

### Technical Summary

The BMAD-Driven SDLC Platform employs a **cloud-native microservices architecture** deployed on Microsoft Azure, combining a React-based frontend with Python backend services orchestrated through Azure API Management. The system centers around a sophisticated **Format Translation Hub** that maintains bidirectional synchronization between business document formats (.doc/.docx, .xlsx, PDF, Figma) and developer markdown files, while implementing dynamic **BMAD agent orchestration** for role-based workflow execution. Key integration points include real-time GitHub synchronization, Figma API connectivity for design workflows, and a comprehensive document processing pipeline supporting concurrent multi-format editing. The architecture leverages **Azure App Service, Azure Functions, and Azure Database for PostgreSQL** for scalable deployment with built-in authentication, file storage, and real-time collaboration features, enabling seamless handoffs between non-technical stakeholders working in familiar business formats and developers operating in their preferred technical environments.

### Cloud Infrastructure

**Provider:** Microsoft Azure
**Key Services:** Azure App Service (Frontend), Azure Functions (Backend APIs), Azure Database for PostgreSQL, Azure Blob Storage, Azure API Management, Azure Container Instances
**Deployment Regions:** Primary: East US 2, Secondary: West Europe (for global distribution)

### Repository Structure

**Structure:** Monorepo with workspace-based organization
**Monorepo Tool:** Poetry (Python dependency management) with workspace structure
**Package Organization:** Domain-driven packages with shared libraries for types, utilities, and document processing

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "User Layer"
        BU[Business Users<br/>.doc, .xlsx, PDF]
        DU[Developers<br/>Markdown, IDE]
        DES[Designers<br/>Figma]
    end

    subgraph "Frontend Layer - Azure App Service"
        WEB[React Web App<br/>Azure App Service]
        EDITOR[Multi-Format Editor]
        COLLAB[Real-time Collaboration]
    end

    subgraph "API Gateway - Azure API Management"
        APIM[Azure API Management]
        AUTH[MSAL<br/>Authentication]
    end

    subgraph "Backend Services - Azure Functions"
        TRANS[Format Translation<br/>Python Function]
        AGENT[BMAD Agent<br/>Orchestration Function]
        DOC[Document Management<br/>Python Function]
        SYNC[GitHub Sync<br/>Python Function]
    end

    subgraph "External Integrations"
        GH[GitHub API]
        FIG[Figma API]
        CONV[Document Conversion<br/>Services]
    end

    subgraph "Data Layer - Azure Services"
        DB[(Azure Database<br/>for PostgreSQL)]
        STORAGE[Azure Blob<br/>Storage]
        CACHE[Azure Cache<br/>for Redis]
        QUEUE[Azure Storage Queues<br/>Message Queue]
    end

    BU --> WEB
    DU --> WEB
    DES --> WEB

    WEB --> APIM
    APIM --> AUTH
    APIM --> TRANS
    APIM --> AGENT
    APIM --> DOC
    APIM --> SYNC

    TRANS --> CONV
    SYNC --> GH
    DOC --> FIG

    TRANS --> DB
    AGENT --> DB
    DOC --> STORAGE
    SYNC --> DB

    TRANS --> QUEUE
    AGENT --> CACHE
```

#### Architecture Diagram Explanation

This high-level architecture diagram illustrates the complete system structure and data flow:

**User Layer:**
- **Business Users:** Non-technical stakeholders who work with familiar formats (.doc, .xlsx, PDF) for creating specifications and requirements
- **Developers:** Technical team members who prefer markdown and IDE-based workflows for implementation
- **Designers:** Creative professionals using Figma for design specifications and mockups

**Frontend Layer:**
- **React Web App:** Single-page application hosted on Azure App Service, providing the unified interface for all user types
- **Multi-Format Editor:** Component supporting editing in multiple document formats with real-time preview
- **Real-time Collaboration:** Features enabling simultaneous editing and live updates across different user sessions

**API Gateway Layer:**
- **Azure API Management:** Centralized entry point providing rate limiting, authentication, monitoring, and API versioning
- **MSAL Authentication:** Microsoft Authentication Library integration for seamless Azure AD SSO

**Backend Services:**
- **Format Translation Function:** Handles bidirectional conversion between business formats and markdown using Pandoc and python-docx
- **BMAD Agent Orchestration:** Manages AI agent workflows for guided specification creation and validation
- **Document Management Function:** Core CRUD operations, version control, and metadata management
- **GitHub Sync Function:** Maintains bidirectional synchronization with GitHub repositories

**External Integrations:**
- **GitHub API:** For repository management, file synchronization, and webhook handling
- **Figma API:** For design file integration and collaborative design workflows
- **Document Conversion Services:** External services for complex format transformations

**Data Layer:**
- **PostgreSQL Database:** Primary data store for documents, users, projects, and metadata
- **Azure Blob Storage:** Object storage for document files, versions, and media assets
- **Redis Cache:** High-performance caching for session data, document previews, and API responses
- **Azure Storage Queues:** Simple message queuing for asynchronous document processing tasks

**Data Flow Patterns:**
1. **User Requests:** All user types access the system through the React web application
2. **API Gateway:** All backend communication flows through Azure API Management for security and monitoring
3. **Service Communication:** Backend services communicate with external APIs and data stores
4. **Async Processing:** Heavy operations like document conversion are queued for background processing

### Architectural Patterns

- **Serverless Architecture:** Azure Functions for scalable backend processing - _Rationale:_ Optimal cost efficiency and automatic scaling for variable document processing workloads
- **Microservices Pattern:** Domain-driven service separation - _Rationale:_ Independent deployment and scaling of document processing, agent orchestration, and integration services
- **Repository Pattern:** Abstract data access logic with Python ORMs - _Rationale:_ Enables testing and future database migration flexibility for complex document metadata
- **API Gateway Pattern:** Azure API Management for centralized routing - _Rationale:_ Centralized auth, rate limiting, monitoring, and versioning for multiple Python microservices
- **Event-Driven Architecture:** Azure Storage Queues for async processing - _Rationale:_ Handle long-running document processing without blocking user interface, simple and cost-effective
- **CQRS Pattern:** Separate read/write models for document operations - _Rationale:_ Optimize for complex document queries while maintaining write performance using PostgreSQL
- **Saga Pattern:** Orchestrate multi-step document workflows - _Rationale:_ Ensure consistency across format conversion, GitHub sync, and collaboration features using Azure Durable Functions

## Azure Deployment Architecture

### Deployment Diagram

```mermaid
graph TB
    subgraph "Internet"
        USERS[Users]
        GITHUB[GitHub API]
        FIGMA[Figma API]
    end

    subgraph "Azure Front Door + CDN"
        AFD[Azure Front Door]
        CDN[Azure CDN]
    end

    subgraph "Azure Resource Group: bmad-platform-prod"
        subgraph "Compute Services"
            WEBAPP[Azure App Service<br/>React Frontend<br/>Linux/Windows, Node.js 18]
            APIAPP[Azure App Service<br/>FastAPI Backend<br/>Linux, Python 3.11]
            FUNC[Azure Functions<br/>Python 3.11 Runtime<br/>Consumption Plan]
            ACI[Azure Container Instances<br/>Document Processing<br/>Custom Python Images]
        end

        subgraph "API Management"
            APIM[Azure API Management<br/>Standard Tier<br/>Rate Limiting & Auth]
        end

        subgraph "Data Services"
            POSTGRES[Azure Database<br/>for PostgreSQL<br/>Flexible Server]
            REDIS[Azure Cache<br/>for Redis<br/>Standard Tier]
            BLOB[Azure Blob Storage<br/>Hot Tier<br/>Document Files]
        end

        subgraph "Messaging & Events"
            STORAGEQUEUE[Azure Storage Queues<br/>Document Processing<br/>Simple & Cost-Effective]
            EVENTGRID[Azure Event Grid<br/>System Events]
        end

        subgraph "Security & Identity"
            MSAL[Microsoft Authentication Library<br/>MSAL + SSO Integration]
            KEYVAULT[Azure Key Vault<br/>Secrets & Certificates]
        end

        subgraph "Monitoring & Logging"
            APPINSIGHTS[Application Insights<br/>Performance Monitoring]
            MONITOR[Azure Monitor<br/>Logs & Metrics]
        end
    end

    USERS --> AFD
    AFD --> CDN
    CDN --> WEBAPP

    WEBAPP --> APIAPP
    WEBAPP --> APIM
    APIAPP --> APIM
    APIM --> FUNC
    APIM --> AAD

    FUNC --> POSTGRES
    FUNC --> REDIS
    FUNC --> BLOB
    FUNC --> STORAGEQUEUE
    FUNC --> GITHUB
    FUNC --> FIGMA

    ACI --> BLOB
    ACI --> POSTGRES
    STORAGEQUEUE --> ACI

    FUNC --> KEYVAULT
    WEBAPP --> APPINSIGHTS
    FUNC --> APPINSIGHTS
    APPINSIGHTS --> MONITOR

    EVENTGRID --> FUNC
```

#### Azure Deployment Diagram Explanation

This deployment architecture diagram shows the complete Azure infrastructure and service interactions:

**Internet Layer:**
- **Users:** End users accessing the platform from various locations globally
- **GitHub API:** External integration for repository management and synchronization
- **Figma API:** External design tool integration for collaborative workflows

**Azure Front Door + CDN:**
- **Azure Front Door:** Global load balancer providing SSL termination, DDoS protection, and intelligent routing to the nearest Azure region
- **Azure CDN:** Content delivery network for caching static assets (CSS, JS, images) and document previews globally for improved performance

**Compute Services (within Azure Resource Group):**
- **Azure App Service (Frontend):** Hosts the React application with auto-scaling capabilities, supporting both Linux and Windows runtimes
- **Azure App Service (API):** Hosts the FastAPI backend application with Python 3.11 runtime on Linux for optimal performance
- **Azure Functions:** Serverless compute for background processing, document conversion, and webhook handling with consumption-based pricing
- **Azure Container Instances:** On-demand containers for heavy document processing tasks that require custom environments or extended processing time

**API Management:**
- **Azure API Management:** Provides centralized API gateway functionality including authentication, rate limiting, request/response transformation, monitoring, and API versioning

**Data Services:**
- **Azure Database for PostgreSQL:** Managed relational database with automatic backups, high availability, and read replicas for scalability
- **Azure Cache for Redis:** In-memory data store for session management, document previews, and API response caching
- **Azure Blob Storage:** Scalable object storage with hot, cool, and archive tiers for cost optimization of document files

**Messaging & Events:**
- **Azure Storage Queues:** Simple, cost-effective message queuing for document processing workflows with at-least-once delivery
- **Azure Event Grid:** Event-driven architecture enabling reactive programming and system-wide notifications

**Security & Identity:**
- **MSAL (Microsoft Authentication Library):** Enterprise-grade authentication with Azure AD integration for seamless SSO
- **Azure Key Vault:** Secure storage and management of secrets, certificates, and encryption keys with hardware security module (HSM) backing

**Monitoring & Logging:**
- **Application Insights:** Real-time application performance monitoring, distributed tracing, and custom telemetry collection
- **Azure Monitor:** Centralized logging, metrics collection, and alerting with integration to Azure DevOps for incident management

**Traffic Flow Patterns:**
1. **User Traffic:** Users → Azure Front Door → CDN → App Service (Frontend)
2. **API Calls:** Frontend → API Management → App Service (API) or Azure Functions
3. **Authentication:** All services → MSAL → Azure AD for token validation
4. **Data Access:** Backend services → PostgreSQL/Redis/Blob Storage for data operations
5. **Background Processing:** API → Storage Queues → Container Instances for heavy operations
6. **External Integration:** Functions → GitHub/Figma APIs for synchronization
7. **Monitoring:** All services → Application Insights → Azure Monitor for observability

**High Availability & Disaster Recovery:**
- **Multi-region deployment:** Primary in East US 2, secondary in West Europe
- **Auto-scaling:** App Services and Functions scale based on demand
- **Database replication:** PostgreSQL with read replicas and automated backups
- **CDN distribution:** Global content delivery for optimal performance

### Infrastructure Components

**Frontend Hosting:**
- **Azure App Service (Linux/Windows):** Hosts React application with Node.js 18 runtime
- **Azure Front Door:** Global load balancing and SSL termination
- **Azure CDN:** Static asset caching and global distribution

**Backend Services:**
- **Azure App Service (Linux):** FastAPI backend with Python 3.11 runtime for main API
- **Azure Functions (Python 3.11):** Serverless functions for background processing and webhooks
- **Azure Container Instances:** Custom document processing containers for complex conversions
- **Azure API Management:** Centralized API gateway with authentication and rate limiting

**Data Layer:**
- **Azure Database for PostgreSQL:** Managed database with automatic backups and high availability
- **Azure Cache for Redis:** In-memory caching for session data and document previews
- **Azure Blob Storage:** Object storage for documents with lifecycle management

**Integration & Messaging:**
- **Azure Storage Queues:** Simple, cost-effective message queuing for document processing workflows
- **Azure Event Grid:** Event-driven architecture for system notifications

**Security & Compliance:**
- **Microsoft Authentication Library (MSAL):** Enterprise SSO integration with Azure AD
- **Azure Key Vault:** Secure storage for API keys, connection strings, and certificates

## Tech Stack

This is the DEFINITIVE technology selection for the entire project:

### Cloud Infrastructure
- **Provider:** Microsoft Azure
- **Key Services:** Azure App Service, Azure Functions, Azure Database for PostgreSQL, Azure Blob Storage, Azure API Management
- **Deployment Regions:** Primary: East US 2, Secondary: West Europe

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Backend Language** | Python | 3.11+ | Primary backend development language | Excellent for document processing, rich ecosystem for ML/AI, strong Azure support |
| **Backend Framework** | FastAPI | 0.104+ | High-performance async API framework | Type hints, automatic OpenAPI docs, excellent performance, async support for I/O operations |
| **API Gateway** | Azure API Management | Latest | API routing and management | Centralized auth, rate limiting, monitoring, versioning for microservices |
| **Serverless Functions** | Azure Functions | 4.x | Event-driven compute | Cost-effective scaling, perfect for document processing jobs, Python runtime support |
| **Database** | Azure Database for PostgreSQL | 15+ | Primary relational database | Document metadata, user management, JSON support, managed service with high availability |
| **Cache** | Azure Cache for Redis | 7+ | Session and document cache | Fast document preview caching, session management, rate limiting for API calls |
| **File Storage** | Azure Blob Storage | Latest | Document and media storage | Scalable object storage, CDN integration, supports large document files up to 50MB |
| **Message Queue** | Azure Storage Queues | Latest | Simple async message processing | Cost-effective message queuing for document conversion jobs, built into storage account |
| **Authentication** | MSAL (Microsoft Authentication Library) | Latest | Enterprise SSO integration | Azure AD integration, single sign-on, role-based access control |
| **ORM** | SQLAlchemy | 2.0+ | Database abstraction layer | Type-safe database operations, migration support, async support |
| **Document Processing** | Pandoc + python-docx | Latest | Format conversion engine | High-fidelity document conversion, Python-native document manipulation |
| **Task Queue** | Celery + Azure Storage Queues | Latest | Background job processing | Distributed task execution for document conversion, simple queue backend |
| **API Documentation** | FastAPI + Swagger UI | Latest | Interactive API documentation | Auto-generated docs from type hints, testing interface |
| **Testing Framework** | pytest + pytest-asyncio | Latest | Unit and integration testing | Comprehensive testing for async Python code, fixtures for database testing |
| **Code Quality** | Black + isort + mypy | Latest | Code formatting and type checking | Consistent code style, static type checking, import organization |
| **Dependency Management** | Poetry | 1.6+ | Python package management | Deterministic builds, virtual environment management, dependency resolution |
| **Container Runtime** | Docker | Latest | Containerization | Consistent deployment across environments, Azure Container Instances support |
| **IaC Tool** | Azure Resource Manager + Bicep | Latest | Infrastructure as Code | Native Azure IaC, type-safe resource definitions, integrated with Azure DevOps |
| **CI/CD** | Azure DevOps Pipelines | Latest | Automated testing and deployment | Integrated with Azure services, Python-optimized pipelines, multi-stage deployments |
| **Monitoring** | Azure Application Insights | Latest | Performance and error tracking | Real-time monitoring, distributed tracing, custom metrics for document processing |
| **Logging** | Azure Monitor Logs | Latest | Centralized logging | Structured logging, query capabilities, integration with Application Insights |

## Data Models

Based on the PRD requirements for comprehensive document management, format translation, and collaborative workflows, here are the core data models using SQLAlchemy:

### User Model

**Purpose:** Represents platform users with MSAL authentication and role-based access

```python
from sqlalchemy import Column, String, DateTime, Boolean, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    azure_ad_object_id = Column(String(255), unique=True, nullable=False, index=True)
    avatar_url = Column(Text)
    github_username = Column(String(255))
    github_access_token = Column(Text)  # Encrypted at application level
    figma_access_token = Column(Text)   # Encrypted at application level
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owned_projects = relationship("Project", back_populates="owner", foreign_keys="Project.owner_id")
    created_documents = relationship("Document", back_populates="creator")
    project_memberships = relationship("ProjectMember", back_populates="user")
```

**Relationships:**
- One-to-many with Projects (as owner)
- Many-to-many with Projects (via ProjectMember)
- One-to-many with Documents (as creator)

### Project Model

**Purpose:** Container for related documents and collaborative workspace management

```python
class ProjectStatus(enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DRAFT = "draft"

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    github_repo_url = Column(Text)
    github_branch = Column(String(255), default="main")
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.ACTIVE)
    settings = Column(JSONB, nullable=False, default={
        "auto_sync": True,
        "default_format": "markdown",
        "collaboration_mode": "open"
    })
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="owned_projects", foreign_keys=[owner_id])
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
```

**Relationships:**
- Many-to-one with User (owner)
- Many-to-many with User (via ProjectMember)
- One-to-many with Documents

### Document Model

**Purpose:** Core entity representing documents in multiple formats with version tracking

```python
class DocumentType(enum.Enum):
    PRD = "prd"
    ARCHITECTURE = "architecture"
    USER_STORY = "user_story"
    TEST_PLAN = "test_plan"
    DESIGN_SPEC = "design_spec"
    BUSINESS_CASE = "business_case"
    MARKET_RESEARCH = "market_research"

class DocumentFormat(enum.Enum):
    MARKDOWN = "markdown"
    DOCX = "docx"
    XLSX = "xlsx"
    PDF = "pdf"
    FIGMA = "figma"

class SyncStatus(enum.Enum):
    SYNCED = "synced"
    PENDING = "pending"
    CONFLICT = "conflict"
    ERROR = "error"

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(Enum(DocumentType), nullable=False)
    primary_format = Column(Enum(DocumentFormat), nullable=False)
    content_hash = Column(String(64))  # SHA-256 hash for integrity
    metadata = Column(JSONB, nullable=False, default={})
    sync_status = Column(Enum(SyncStatus), nullable=False, default=SyncStatus.PENDING)
    github_path = Column(Text)  # Path in GitHub repository
    figma_file_id = Column(String(255))  # Figma file identifier
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="documents")
    creator = relationship("User", back_populates="created_documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")
    collaboration_sessions = relationship("CollaborationSession", back_populates="document")
```

**Relationships:**
- Many-to-one with Project
- Many-to-one with User (creator)
- One-to-many with DocumentVersions
- One-to-many with CollaborationSessions

### Supporting Models

**DocumentVersion Model:**
```python
class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    format = Column(Enum(DocumentFormat), nullable=False)
    content_url = Column(Text, nullable=False)  # Azure Blob Storage URL
    file_size = Column(BigInteger, nullable=False)
    conversion_metadata = Column(JSONB, nullable=False, default={})
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document", back_populates="versions")
    creator = relationship("User")

    __table_args__ = (
        UniqueConstraint('document_id', 'version_number', 'format', name='uq_document_version_format'),
        Index('idx_document_versions_document_id', 'document_id'),
    )
```

**ProjectMember Model:**
```python
class ProjectRole(enum.Enum):
    OWNER = "owner"
    EDITOR = "editor"
    VIEWER = "viewer"

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(ProjectRole), nullable=False, default=ProjectRole.VIEWER)
    invited_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships", foreign_keys=[user_id])
    inviter = relationship("User", foreign_keys=[invited_by])

    __table_args__ = (
        UniqueConstraint('project_id', 'user_id', name='uq_project_member'),
        Index('idx_project_members_user_id', 'user_id'),
    )
```

**CollaborationSession Model:**
```python
class CollaborationSession(Base):
    __tablename__ = "collaboration_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    format = Column(Enum(DocumentFormat), nullable=False)
    cursor_position = Column(JSONB, default={})
    is_active = Column(Boolean, default=True, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    document = relationship("Document", back_populates="collaboration_sessions")
    user = relationship("User")

    __table_args__ = (
        Index('idx_collaboration_sessions_document_id', 'document_id'),
        Index('idx_collaboration_sessions_active', 'is_active'),
    )
```

## API Specification

Based on FastAPI framework selected in the Tech Stack, here's the comprehensive REST API specification:

### FastAPI Application Structure

```python
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer
from pydantic import BaseModel, UUID4
from typing import Optional, List
import enum

app = FastAPI(
    title="BMAD Platform API",
    description="Document processing and collaboration platform",
    version="1.0.0"
)

# Authentication dependency
security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> User:
    # MSAL token validation logic
    pass
```

### Core API Endpoints

**Document Management Endpoints:**

```python
# Pydantic schemas for request/response
class DocumentUploadRequest(BaseModel):
    project_id: UUID4
    name: str
    type: DocumentType
    format: DocumentFormat

class DocumentResponse(BaseModel):
    id: UUID4
    project_id: UUID4
    name: str
    type: DocumentType
    primary_format: DocumentFormat
    sync_status: SyncStatus
    created_at: datetime
    updated_at: datetime

class DocumentUpdateRequest(BaseModel):
    content: str
    format: DocumentFormat
    conflict_resolution: str = "create_version"

# API Routes
@app.post("/api/v1/documents/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    request: DocumentUploadRequest = Depends(),
    current_user: User = Depends(get_current_user)
):
    """Upload a new document and queue for format conversion"""
    # Validate file, store in Azure Blob Storage, create database record
    # Queue conversion job in Azure Storage Queue
    pass

@app.get("/api/v1/documents/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID4,
    format: Optional[DocumentFormat] = None,
    version: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """Retrieve document content in specified format"""
    # Check permissions, retrieve from database/storage
    pass

@app.put("/api/v1/documents/{document_id}/content")
async def update_document_content(
    document_id: UUID4,
    request: DocumentUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    """Update document content with conflict resolution"""
    # Handle conflict resolution, create version, trigger sync
    pass
```

**Format Conversion Endpoints:**

```python
class ConversionRequest(BaseModel):
    document_id: UUID4
    target_format: DocumentFormat
    options: dict = {
        "preserve_formatting": True,
        "include_images": True,
        "quality_level": "balanced"
    }

class ConversionJobResponse(BaseModel):
    job_id: UUID4
    status: str
    estimated_completion: Optional[datetime]

@app.post("/api/v1/conversion/convert", response_model=ConversionJobResponse)
async def convert_document(
    request: ConversionRequest,
    current_user: User = Depends(get_current_user)
):
    """Queue document conversion job"""
    # Validate request, queue job in Azure Storage Queue
    pass

@app.get("/api/v1/conversion/{job_id}/status")
async def get_conversion_status(
    job_id: UUID4,
    current_user: User = Depends(get_current_user)
):
    """Get conversion job status and results"""
    pass
```

**Real-time Collaboration Endpoints:**

```python
class CollaborationSessionRequest(BaseModel):
    document_id: UUID4
    format: DocumentFormat

class CollaborationEvent(BaseModel):
    session_id: UUID4
    event_type: str
    event_data: dict

@app.post("/api/v1/collaboration/sessions")
async def create_collaboration_session(
    request: CollaborationSessionRequest,
    current_user: User = Depends(get_current_user)
):
    """Create or join collaboration session"""
    pass

@app.get("/api/v1/collaboration/{document_id}/stream")
async def document_event_stream(
    document_id: UUID4,
    current_user: User = Depends(get_current_user)
):
    """Server-Sent Events stream for real-time updates"""
    async def event_generator():
        while True:
            # Check Redis for document updates
            update = await redis_client.blpop(f"document:{document_id}:updates", timeout=30)
            if update:
                yield f"data: {update[1]}\n\n"

    return StreamingResponse(event_generator(), media_type="text/plain")

@app.post("/api/v1/collaboration/events")
async def send_collaboration_event(
    event: CollaborationEvent,
    current_user: User = Depends(get_current_user)
):
    """Send collaboration event to other participants"""
    # Broadcast event via Redis pub/sub
    pass
```

## Components

Based on the architectural patterns, tech stack, and data models, here are the major logical components:

### Frontend Application (Azure App Service)

**Responsibility:** React-based web application providing multi-format document editing, real-time collaboration, and project management interfaces

**Key Interfaces:**
- Document Editor API for multi-format content editing
- Real-time updates via Server-Sent Events (SSE)
- File Upload/Download API for document management
- MSAL authentication integration for SSO

**Dependencies:** Azure API Management, Azure Functions backend services, Azure Blob Storage

**Technology Stack:** React 18+, TypeScript, Azure App Service (Linux or Windows), Node.js 18, MSAL.js, EventSource API for real-time features

### Document Management Service (Azure Function)

**Responsibility:** Core document lifecycle management including storage, versioning, metadata tracking, and access control

**Key Interfaces:**
- RESTful API for document CRUD operations with version tracking
- Multi-format content storage and retrieval via Azure Blob Storage
- Document metadata search using PostgreSQL full-text search
- MSAL-based authentication and role-based access control

**Dependencies:** Azure Database for PostgreSQL, Azure Blob Storage, Format Translation Service, MSAL

**Technology Stack:** Python 3.11, FastAPI, SQLAlchemy 2.0, Azure Functions, Pydantic, MSAL Python SDK

### Format Translation Service (Azure Function + Container Instances)

**Responsibility:** Bidirectional conversion between business document formats (.doc, .xlsx, PDF) and markdown with high fidelity preservation

**Key Interfaces:**
- Async document conversion API with format validation
- Conversion job queue using Azure Storage Queues
- Fidelity scoring and quality assessment metrics
- Batch conversion for multiple documents

**Dependencies:** Pandoc, python-docx, Azure Storage Queues, Azure Container Instances for heavy processing

**Technology Stack:** Python 3.11, Pandoc, python-docx, Celery with Azure Storage Queue backend, Azure Functions, Azure Container Instances

### GitHub Integration Service (Azure Function)

**Responsibility:** Bidirectional synchronization with GitHub repositories, maintaining both business and technical document formats

**Key Interfaces:**
- GitHub OAuth integration and repository access
- Document sync with three-way merge conflict resolution
- Webhook handling for external repository changes
- Branch and commit management with automated PR creation

**Dependencies:** GitHub API, Document Management Service, Format Translation Service, Azure Key Vault

**Technology Stack:** Python 3.11, PyGithub, FastAPI, Azure Functions, Azure Key Vault for token storage

### Real-time Collaboration Service (Server-Sent Events)

**Responsibility:** Multi-user document editing with conflict resolution, cursor tracking, and live synchronization

**Key Interfaces:**
- Server-Sent Events (SSE) for real-time document updates
- HTTP endpoints for collaboration actions (cursor moves, text changes)
- Session management and participant tracking via Redis
- Change broadcasting using simple pub/sub pattern

**Dependencies:** Document Management Service, Azure Cache for Redis, FastAPI StreamingResponse

**Technology Stack:** FastAPI with SSE support, Python 3.11, Azure Cache for Redis, EventSource API (browser native)

## Simplified Real-Time Architecture

### Server-Sent Events (SSE) vs SignalR

**Why Server-Sent Events:**
- **Native Browser Support:** Built into all modern browsers, no additional libraries
- **HTTP-Based:** Uses standard HTTP connections, works through firewalls and proxies
- **Automatic Reconnection:** Browsers handle reconnection automatically
- **Simple Implementation:** FastAPI has built-in SSE support with `StreamingResponse`
- **Unidirectional:** Perfect for server-to-client updates (document changes, notifications)
- **No External Dependencies:** No need for Azure SignalR Service

**Real-Time Collaboration Flow:**

```mermaid
graph LR
    subgraph "Real-Time Document Collaboration"
        USER1[User 1<br/>Editing Document]
        USER2[User 2<br/>Viewing Document]
        API[FastAPI Backend<br/>SSE Endpoint]
        REDIS[Redis Cache<br/>Pub/Sub]
        DB[(PostgreSQL<br/>Document Storage)]
    end

    USER1 -->|Edit Document| API
    API -->|Save Changes| DB
    API -->|Publish Update| REDIS
    REDIS -->|Subscribe| API
    API -->|SSE Stream| USER2
```

**SSE Implementation Example:**

**Backend (FastAPI):**
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

@app.get("/documents/{document_id}/stream")
async def document_stream(document_id: str):
    async def event_stream():
        while True:
            # Check for document updates in Redis
            update = await redis_client.blpop(f"document:{document_id}:updates", timeout=30)
            if update:
                data = json.loads(update[1])
                yield f"data: {json.dumps(data)}\n\n"
            else:
                # Send heartbeat to keep connection alive
                yield f"data: {json.dumps({'type': 'heartbeat'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/plain")

@app.post("/documents/{document_id}/update")
async def update_document(document_id: str, update_data: dict):
    # Save to database
    await save_document_update(document_id, update_data)

    # Broadcast to all connected clients
    await redis_client.lpush(
        f"document:{document_id}:updates",
        json.dumps(update_data)
    )

    return {"status": "success"}
```

**Frontend (React):**
```typescript
// Simple SSE client - no additional libraries needed
function useDocumentStream(documentId: string) {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource(`/api/documents/${documentId}/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type !== 'heartbeat') {
                setUpdates(prev => [...prev, data]);
            }
        };

        eventSource.onerror = () => {
            console.log('SSE connection error, will auto-reconnect');
        };

        return () => eventSource.close();
    }, [documentId]);

    return updates;
}
```

## Azure App Service Platform Options

### Platform Comparison

| Feature | Linux App Service | Windows App Service |
|---------|------------------|-------------------|
| **Python Support** | Native, optimized | Supported via extensions |
| **Cost** | 10-20% cheaper | Standard pricing |
| **Performance** | Better for Python/Node.js | Better for .NET |
| **Container Support** | Full Docker support | Limited container support |
| **SSH Access** | Built-in SSH | Remote debugging tools |
| **Startup Time** | Faster cold starts | Slower cold starts |
| **File System** | Case-sensitive | Case-insensitive |

### Recommendation Matrix

**Choose Linux App Service if:**
- Primary backend is Python/Node.js ✅
- Cost optimization is important ✅
- Need container deployment ✅
- Team comfortable with Linux environments ✅

**Choose Windows App Service if:**
- Mixed .NET and Python workloads
- Team primarily Windows-focused
- Need Windows-specific features
- Existing Windows infrastructure

**For this project: Linux App Service recommended** due to Python backend focus and cost benefits.

### App Service Configuration

**Linux App Service Setup:**
```bash
# Create Linux App Service Plan
az appservice plan create \
    --name bmad-platform-plan \
    --resource-group bmad-platform-prod \
    --sku P1V3 \
    --is-linux

# Create Web App with Python runtime
az webapp create \
    --resource-group bmad-platform-prod \
    --plan bmad-platform-plan \
    --name bmad-platform-frontend \
    --runtime "NODE|18-lts"

# Create API App with Python runtime
az webapp create \
    --resource-group bmad-platform-prod \
    --plan bmad-platform-plan \
    --name bmad-platform-api \
    --runtime "PYTHON|3.11"
```

**Windows App Service Alternative:**
```bash
# Create Windows App Service Plan
az appservice plan create \
    --name bmad-platform-plan-win \
    --resource-group bmad-platform-prod \
    --sku P1V3

# Create Web App (Windows automatically selected)
az webapp create \
    --resource-group bmad-platform-prod \
    --plan bmad-platform-plan-win \
    --name bmad-platform-frontend-win
```

## Simplified Messaging Architecture

### Azure Storage Queues vs Azure Service Bus

**Why Azure Storage Queues:**
- **Simplicity:** Built into Azure Storage accounts, no separate service to manage
- **Cost-Effective:** Pay only for storage and operations, no base service cost
- **Sufficient Throughput:** Handles up to 2,000 messages/second per queue
- **Reliability:** At-least-once delivery with configurable visibility timeout
- **Integration:** Native support in Azure Functions and Python SDK

**Message Flow for Document Processing:**

```mermaid
graph LR
    subgraph "Document Upload Flow"
        USER[User Uploads Document]
        API[FastAPI Endpoint]
        QUEUE[Azure Storage Queue<br/>document-processing]
        WORKER[Azure Function<br/>Document Processor]
        STORAGE[Azure Blob Storage]
        DB[(PostgreSQL)]
    end

    USER --> API
    API --> STORAGE
    API --> QUEUE
    QUEUE --> WORKER
    WORKER --> STORAGE
    WORKER --> DB
```

#### Document Processing Flow Explanation

This diagram illustrates the simplified messaging architecture for document processing:

**Message Flow Components:**
- **User:** Initiates document upload through the web interface
- **FastAPI Endpoint:** Receives the upload request and handles initial processing
- **Azure Storage Queue:** Simple, cost-effective message queue that triggers background processing
- **Azure Function (Document Processor):** Serverless worker that processes conversion jobs
- **Azure Blob Storage:** Stores both original and converted document files
- **PostgreSQL Database:** Maintains document metadata, status, and relationships

**Processing Workflow:**
1. **Upload Initiation:** User uploads a document through the React frontend
2. **Initial Processing:** FastAPI endpoint validates the file, creates a database record, and stores the original file in Blob Storage
3. **Job Queuing:** A processing job message is added to the Azure Storage Queue with document metadata
4. **Async Processing:** Azure Function is triggered by the queue message and begins document conversion
5. **File Processing:** Function retrieves the original file from Blob Storage, performs conversion using Pandoc/python-docx
6. **Result Storage:** Converted file is stored back to Blob Storage with appropriate metadata
7. **Status Update:** Database is updated with conversion results and new file locations

**Benefits of This Approach:**
- **Simplicity:** Azure Storage Queues are much simpler than Service Bus, requiring minimal configuration
- **Cost-Effective:** Pay only for storage operations, no base service costs
- **Reliability:** At-least-once delivery ensures no messages are lost
- **Scalability:** Functions automatically scale based on queue depth
- **Monitoring:** Built-in integration with Azure Monitor for queue metrics

**Queue Configuration:**
```python
# Simple queue operations with Azure Storage SDK
from azure.storage.queue import QueueClient

# Enqueue document processing job
queue_client = QueueClient.from_connection_string(
    conn_str=connection_string,
    queue_name="document-processing"
)

message = {
    "document_id": "uuid",
    "operation": "convert",
    "source_format": "docx",
    "target_format": "markdown"
}

queue_client.send_message(json.dumps(message))
```

## MSAL Authentication & Authorization

### Authentication Architecture

**Microsoft Authentication Library (MSAL) Integration:**
- **Frontend:** MSAL.js for React applications with Azure AD integration
- **Backend:** MSAL Python for API authentication and token validation
- **SSO Support:** Seamless single sign-on with organizational Azure AD
- **Token Management:** Automatic token refresh and secure storage

### Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant React as React App<br/>(MSAL.js)
    participant AAD as Azure AD
    participant API as FastAPI Backend<br/>(MSAL Python)
    participant DB as PostgreSQL

    User->>React: Login Request
    React->>AAD: Redirect to Azure AD
    AAD->>User: Authentication Challenge
    User->>AAD: Credentials
    AAD->>React: Access Token + ID Token
    React->>API: API Request with Bearer Token
    API->>AAD: Validate Token
    AAD->>API: Token Claims
    API->>DB: Authorized Data Access
    DB->>API: Data Response
    API->>React: API Response
    React->>User: Display Data
```

#### MSAL Authentication Flow Explanation

This sequence diagram details the Microsoft Authentication Library (MSAL) integration for enterprise SSO:

**Authentication Participants:**
- **User:** End user attempting to access the platform
- **React App:** Frontend application with MSAL.js integration
- **MSAL.js:** Microsoft's JavaScript library for handling Azure AD authentication
- **Azure AD:** Microsoft's identity platform providing authentication services
- **FastAPI Backend:** Python backend API with MSAL token validation
- **PostgreSQL:** Database storing user profiles and application data

**Authentication Sequence:**
1. **Login Initiation:** User clicks login button in the React application
2. **MSAL Redirect:** MSAL.js redirects user to Azure AD login page using OAuth 2.0 authorization code flow
3. **User Authentication:** Azure AD presents authentication challenge (username/password, MFA, etc.)
4. **Credential Submission:** User provides credentials to Azure AD
5. **Token Issuance:** Azure AD validates credentials and returns access token and ID token to MSAL.js
6. **Token Storage:** MSAL.js securely stores tokens and notifies React app of successful authentication

**API Access Flow:**
7. **Authenticated Request:** React app makes API calls including Bearer token in Authorization header
8. **Token Validation:** FastAPI backend validates the JWT token with Azure AD's public keys
9. **Claims Extraction:** Azure AD returns token claims including user identity and permissions
10. **User Resolution:** Backend queries database to get or create user record based on Azure AD object ID
11. **Data Access:** Database returns user data and permissions for the authenticated user
12. **Response Delivery:** API returns requested data to React app, which displays it to the user

**Security Features:**
- **Token Refresh:** MSAL.js automatically handles token refresh before expiration
- **Silent Authentication:** Subsequent logins use cached tokens for seamless experience
- **Secure Storage:** Tokens stored in browser's secure storage with appropriate flags
- **Logout Handling:** Proper cleanup of tokens and session data on logout

**Enterprise Benefits:**
- **Single Sign-On:** Users authenticate once for all organizational applications
- **Conditional Access:** Azure AD policies can enforce MFA, device compliance, etc.
- **Audit Trail:** All authentication events logged in Azure AD for compliance
- **Group Integration:** User roles and permissions can be managed through Azure AD groups

### MSAL Configuration

**Frontend (React + MSAL.js):**
```typescript
// msal-config.ts
import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_APP_AZURE_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ['api://bmad-platform-api/Document.ReadWrite']
};
```

**Backend (FastAPI + MSAL Python):**
```python
# auth.py
from msal import ConfidentialClientApplication
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

class MSALAuth:
    def __init__(self):
        self.app = ConfidentialClientApplication(
            client_id=settings.AZURE_CLIENT_ID,
            client_credential=settings.AZURE_CLIENT_SECRET,
            authority=f"https://login.microsoftonline.com/{settings.TENANT_ID}"
        )

    async def validate_token(self, token: str) -> dict:
        # Token validation logic
        result = self.app.acquire_token_silent(
            scopes=["api://bmad-platform-api/.default"],
            account=None
        )
        return result

# Dependency for protected routes
async def get_current_user(token: str = Depends(security)):
    auth = MSALAuth()
    user_info = await auth.validate_token(token.credentials)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_info
```

## External APIs

The platform requires several critical external API integrations:

### GitHub API

- **Purpose:** Bidirectional synchronization of documents between web platform and GitHub repositories
- **Documentation:** https://docs.github.com/en/rest
- **Base URL(s):** https://api.github.com
- **Authentication:** OAuth 2.0 with personal access tokens, stored encrypted per user
- **Rate Limits:** 5,000 requests/hour for authenticated users

**Key Endpoints Used:**
- `GET /user/repos` - List user's accessible repositories for project connection
- `PUT /repos/{owner}/{repo}/contents/{path}` - Create or update markdown documents
- `POST /repos/{owner}/{repo}/hooks` - Set up webhooks for real-time change notifications

**Integration Notes:** Implements webhook handlers for real-time bidirectional sync. Handles merge conflicts when documents are modified in both locations.

### Figma API

- **Purpose:** Import Figma designs, extract design specifications, and generate technical documentation
- **Documentation:** https://www.figma.com/developers/api
- **Base URL(s):** https://api.figma.com/v1
- **Authentication:** OAuth 2.0 with personal access tokens for design file access
- **Rate Limits:** 1,000 requests/minute per access token

**Key Endpoints Used:**
- `GET /files/{file_key}` - Retrieve complete Figma file structure and metadata
- `GET /files/{file_key}/nodes` - Extract specific design components and frames
- `GET /images/{file_key}` - Export design assets and screenshots for documentation

**Integration Notes:** Implements design-to-specification workflows with automated content generation. Handles large design files with pagination and asset optimization.

### Document Conversion Services

- **Purpose:** High-fidelity bidirectional conversion between business document formats and markdown
- **Documentation:** Multiple services - Pandoc, LibreOffice API, cloud conversion services
- **Authentication:** API keys for cloud services, internal authentication for self-hosted
- **Rate Limits:** Varies by service - typically 100-500 conversions/hour per API key

**Key Endpoints Used:**
- `POST /convert` - Primary conversion endpoint with source/target format specification
- `GET /conversion/{job_id}/status` - Track conversion progress for large documents
- `GET /conversion/{job_id}/result` - Retrieve converted document with fidelity metrics

**Integration Notes:** Implements fallback chain (Pandoc → LibreOffice → Cloud services) for maximum reliability. Provides detailed fidelity scoring and conversion warnings.

## Core Workflows

### Document Upload & Conversion Workflow

```mermaid
sequenceDiagram
    participant User as Business User
    participant React as React Frontend
    participant FastAPI as FastAPI Backend
    participant Blob as Azure Blob Storage
    participant Queue as Azure Storage Queue
    participant Function as Azure Function
    participant DB as PostgreSQL
    participant GitHub as GitHub API

    User->>React: Upload .docx file
    React->>FastAPI: POST /api/v1/documents/upload
    FastAPI->>DB: Create document record
    FastAPI->>Blob: Store original file
    FastAPI->>Queue: Queue conversion job
    FastAPI->>React: Return document ID
    React->>User: Show upload success

    Queue->>Function: Trigger conversion function
    Function->>Blob: Retrieve original file
    Function->>Function: Convert docx→markdown (Pandoc)
    Function->>Blob: Store converted file
    Function->>DB: Update document status
    Function->>GitHub: Sync markdown to repository
    Function->>Queue: Send completion notification
```

### Real-time Collaborative Editing with SSE

```mermaid
sequenceDiagram
    participant User1 as User 1 (Editor)
    participant User2 as User 2 (Viewer)
    participant FastAPI as FastAPI Backend
    participant Redis as Redis Cache
    participant DB as PostgreSQL

    User2->>FastAPI: GET /api/v1/collaboration/{doc_id}/stream
    FastAPI->>User2: Establish SSE connection

    User1->>FastAPI: POST /api/v1/documents/{doc_id}/content
    FastAPI->>DB: Save document changes
    FastAPI->>Redis: Publish update event
    Redis->>FastAPI: Notify SSE handler
    FastAPI->>User2: Send SSE update
    User2->>User2: Update document view

    Note over User1,User2: Real-time collaboration without SignalR complexity
```

#### Real-Time Collaboration Flow Explanation

This diagram demonstrates the simplified real-time collaboration architecture using Server-Sent Events:

**Collaboration Participants:**
- **User 1 (Editor):** Active user making changes to the document
- **User 2 (Viewer):** Passive user viewing the document and receiving real-time updates
- **FastAPI Backend:** Python backend handling both HTTP requests and SSE streams
- **Redis Cache:** In-memory store for pub/sub messaging and session management
- **PostgreSQL Database:** Persistent storage for document content and metadata

**Real-Time Collaboration Sequence:**
1. **SSE Connection:** User 2 establishes a Server-Sent Events connection to receive real-time updates for the specific document
2. **Stream Establishment:** FastAPI creates a persistent HTTP connection and begins streaming events to User 2
3. **Document Edit:** User 1 makes changes to the document content through the standard HTTP API
4. **Content Persistence:** FastAPI saves the changes to PostgreSQL database for durability
5. **Event Publishing:** FastAPI publishes the update event to Redis using pub/sub pattern
6. **Event Notification:** Redis notifies the SSE handler about the new update event
7. **Stream Update:** FastAPI sends the update to User 2 through the established SSE connection
8. **UI Update:** User 2's browser receives the SSE event and updates the document view in real-time

**Technical Implementation Details:**
- **SSE Format:** Events sent as `data: {JSON}\n\n` format following SSE specification
- **Connection Management:** Browser automatically handles reconnection if connection drops
- **Event Types:** Different event types for content changes, cursor movements, user presence
- **Heartbeat:** Periodic heartbeat messages to keep connections alive and detect disconnections

**Advantages Over SignalR:**
- **Native Browser Support:** No additional JavaScript libraries required
- **HTTP-Based:** Works through firewalls and proxies without special configuration
- **Simpler Infrastructure:** No need for separate SignalR service or complex hub management
- **Cost-Effective:** No additional Azure service costs, uses existing FastAPI infrastructure
- **Debugging:** Standard HTTP tools work for troubleshooting SSE connections

**Scalability Considerations:**
- **Redis Pub/Sub:** Enables horizontal scaling across multiple FastAPI instances
- **Connection Pooling:** Redis connections pooled for efficient resource usage
- **Event Filtering:** Only relevant events sent to each user's SSE stream
- **Memory Management:** Automatic cleanup of inactive SSE connections

### MSAL Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant React as React App
    participant MSAL as MSAL.js
    participant AAD as Azure AD
    participant FastAPI as FastAPI Backend
    participant DB as PostgreSQL

    User->>React: Click Login
    React->>MSAL: loginPopup()
    MSAL->>AAD: Redirect to Azure AD
    AAD->>User: Authentication prompt
    User->>AAD: Enter credentials
    AAD->>MSAL: Return access token
    MSAL->>React: Token acquired

    React->>FastAPI: API call with Bearer token
    FastAPI->>AAD: Validate token
    AAD->>FastAPI: Token claims
    FastAPI->>DB: Get/create user record
    DB->>FastAPI: User data
    FastAPI->>React: API response
```

### Document Format Translation Workflow

```mermaid
sequenceDiagram
    participant User as User
    participant API as FastAPI API
    participant Queue as Storage Queue
    participant Container as Container Instance
    participant Blob as Blob Storage
    participant DB as PostgreSQL

    User->>API: Request format conversion
    API->>Queue: Queue conversion job
    API->>User: Return job ID

    Queue->>Container: Trigger processing container
    Container->>Blob: Download source document
    Container->>Container: Run Pandoc conversion
    Container->>Container: Quality assessment
    Container->>Blob: Upload converted document
    Container->>DB: Update conversion status
    Container->>Queue: Send completion event

    Note over Container: Heavy processing in isolated container
```

#### Document Format Translation Workflow Explanation

This diagram illustrates the comprehensive document conversion process using Azure Container Instances:

**Translation Workflow Participants:**
- **User:** Initiates document format conversion request
- **FastAPI API:** Main backend API handling conversion requests
- **Azure Storage Queue:** Message queue for asynchronous job processing
- **Azure Container Instance:** Dedicated container for heavy document processing
- **Azure Blob Storage:** Object storage for source and converted documents
- **PostgreSQL Database:** Metadata and status tracking for conversion jobs

**Conversion Process Flow:**
1. **Conversion Request:** User requests document conversion through the web interface (e.g., DOCX to Markdown)
2. **Job Creation:** FastAPI API validates the request, creates a conversion job record, and assigns a unique job ID
3. **Queue Submission:** Conversion job details are added to Azure Storage Queue for asynchronous processing
4. **User Response:** API immediately returns the job ID to user for status tracking, enabling non-blocking operation

**Background Processing:**
5. **Container Activation:** Azure Storage Queue triggers an Azure Container Instance with the conversion job
6. **File Retrieval:** Container downloads the source document from Azure Blob Storage using the provided URL
7. **Format Conversion:** Container executes conversion using specialized tools:
   - **Pandoc:** For markdown, HTML, and various text formats
   - **python-docx:** For Microsoft Word document manipulation
   - **Custom scripts:** For complex formatting preservation
8. **Quality Assessment:** Container performs fidelity analysis comparing source and converted documents
9. **Result Storage:** Converted document is uploaded to Azure Blob Storage with appropriate metadata
10. **Status Update:** Database is updated with conversion results, file locations, and quality metrics
11. **Completion Notification:** Completion event is sent to queue for potential user notification

**Technical Advantages:**
- **Isolation:** Each conversion runs in a separate container, preventing resource conflicts
- **Scalability:** Multiple containers can process conversions simultaneously
- **Resource Optimization:** Containers are created on-demand and destroyed after completion
- **Custom Environment:** Each container can have specific tools and dependencies for different conversion types
- **Error Handling:** Failed conversions don't affect other operations or the main API

**Conversion Quality Features:**
- **Fidelity Scoring:** Automated assessment of conversion accuracy
- **Format Validation:** Verification that output files are valid in target format
- **Metadata Preservation:** Retention of document properties, author information, and timestamps
- **Error Reporting:** Detailed logs for troubleshooting failed conversions

**Performance Characteristics:**
- **Parallel Processing:** Multiple conversions can run simultaneously
- **Resource Scaling:** Container resources allocated based on document size and complexity
- **Timeout Handling:** Long-running conversions have configurable timeout limits
- **Retry Logic:** Failed conversions can be automatically retried with different parameters

## Database Schema

Based on the Azure Database for PostgreSQL and SQLAlchemy models defined, here's the concrete database schema with Alembic migrations:

### Core Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with MSAL authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    azure_ad_object_id VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    github_username VARCHAR(255),
    github_access_token TEXT, -- Encrypted at application level
    figma_access_token TEXT,  -- Encrypted at application level
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table for workspace management
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    github_repo_url TEXT,
    github_branch VARCHAR(255) DEFAULT 'main',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    settings JSONB NOT NULL DEFAULT '{
        "auto_sync": true,
        "default_format": "markdown",
        "collaboration_mode": "open"
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project members for collaboration
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Documents table for multi-format document management
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'prd', 'architecture', 'user_story', 'test_plan',
        'design_spec', 'business_case', 'market_research'
    )),
    primary_format VARCHAR(20) NOT NULL CHECK (primary_format IN (
        'markdown', 'docx', 'xlsx', 'pdf', 'figma'
    )),
    content_hash VARCHAR(64), -- SHA-256 hash for integrity
    metadata JSONB NOT NULL DEFAULT '{}',
    sync_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (sync_status IN (
        'synced', 'pending', 'conflict', 'error'
    )),
    github_path TEXT, -- Path in GitHub repository
    figma_file_id VARCHAR(255), -- Figma file identifier
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document versions for format-specific content and history
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN (
        'markdown', 'docx', 'xlsx', 'pdf', 'figma'
    )),
    content_url TEXT NOT NULL, -- Azure Blob Storage URL
    file_size BIGINT NOT NULL,
    conversion_metadata JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, version_number, format)
);

-- Collaboration sessions for real-time editing
CREATE TABLE collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('markdown', 'docx', 'xlsx', 'pdf')),
    cursor_position JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Indexes and Constraints

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_azure_ad_object_id ON users(azure_ad_object_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);

CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_sync_status ON documents(sync_status);
CREATE INDEX idx_documents_created_by ON documents(created_by);

CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_format ON document_versions(format);

CREATE INDEX idx_collaboration_sessions_document_id ON collaboration_sessions(document_id);
CREATE INDEX idx_collaboration_sessions_active ON collaboration_sessions(is_active) WHERE is_active = true;

-- Full-text search indexes for document content
CREATE INDEX idx_documents_name_fts ON documents USING gin(to_tsvector('english', name));
CREATE INDEX idx_documents_metadata_fts ON documents USING gin(metadata);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on sensitive tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID from JWT token
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    -- Extract user ID from JWT token in application context
    -- This would be set by the application when processing requests
    RETURN current_setting('app.current_user_id', true)::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for projects
CREATE POLICY "Users can view projects they own or are members of" ON projects
    FOR SELECT USING (
        owner_id = get_current_user_id() OR
        id IN (SELECT project_id FROM project_members WHERE user_id = get_current_user_id())
    );

CREATE POLICY "Users can modify projects they own" ON projects
    FOR ALL USING (owner_id = get_current_user_id());

-- RLS policies for documents
CREATE POLICY "Users can view documents in accessible projects" ON documents
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE
            owner_id = get_current_user_id() OR
            id IN (SELECT project_id FROM project_members WHERE user_id = get_current_user_id())
        )
    );

CREATE POLICY "Users can modify documents in projects they can edit" ON documents
    FOR ALL USING (
        project_id IN (
            SELECT p.id FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            WHERE p.owner_id = get_current_user_id()
            OR (pm.user_id = get_current_user_id() AND pm.role IN ('owner', 'editor'))
        )
    );
```

## Frontend Architecture

### Component Architecture

The frontend employs a hierarchical component structure optimized for multi-format document editing:

```
src/
├── components/
│   ├── ui/                     # Shadcn/ui base components
│   ├── document/               # Document-specific components
│   │   ├── document-editor/
│   │   │   ├── markdown-editor.tsx
│   │   │   ├── docx-preview.tsx
│   │   │   └── format-switcher.tsx
│   │   ├── document-list.tsx
│   │   └── document-upload.tsx
│   ├── collaboration/          # Real-time collaboration
│   │   ├── cursor-overlay.tsx
│   │   └── participant-list.tsx
│   └── project/               # Project management
│       ├── project-dashboard.tsx
│       └── member-management.tsx
```

### State Management Architecture

```typescript
// Document Store - Zustand
interface DocumentState {
  documents: Record<string, Document>;
  activeDocumentId: string | null;
  collaborationSessions: Record<string, CollaborationSession>;
  selectedFormat: DocumentFormat;
  isEditing: boolean;

  // Actions
  setActiveDocument: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  joinCollaboration: (documentId: string) => void;
}

// Project Store - Zustand
interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  members: Record<string, ProjectMember[]>;

  // Actions
  setActiveProject: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
}
```

### Routing Architecture

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── callback/page.tsx
├── (dashboard)/
│   ├── projects/
│   │   ├── page.tsx                    # Project list
│   │   ├── [id]/
│   │   │   ├── page.tsx               # Project dashboard
│   │   │   ├── documents/
│   │   │   │   └── [documentId]/
│   │   │   │       └── page.tsx       # Document editor
│   │   │   └── settings/page.tsx      # Project settings
│   │   └── new/page.tsx               # Create project
│   └── profile/page.tsx
└── api/trpc/[trpc]/route.ts
```

## Backend Architecture

### Service Architecture

The backend employs a **serverless architecture** with Next.js API routes:

```
api/
├── trpc/[trpc]/route.ts              # Main tRPC handler
├── auth/
│   ├── github/callback/route.ts      # GitHub OAuth callback
│   └── figma/callback/route.ts       # Figma OAuth callback
├── webhooks/
│   ├── github/route.ts               # GitHub webhook handler
│   └── supabase/route.ts             # Supabase webhook handler
├── jobs/
│   ├── convert-document/route.ts     # Document conversion job
│   └── sync-github/route.ts          # GitHub sync job
└── health/route.ts                   # Health check endpoint
```

### Database Architecture

```typescript
// Document Repository Pattern
export class DocumentRepository {
  private supabase = createServiceClient();

  async createDocument(input: CreateDocumentInput): Promise<Document> {
    const { data, error } = await this.supabase
      .from('documents')
      .insert({
        project_id: input.projectId,
        name: input.name,
        type: input.type,
        primary_format: input.format,
        created_by: input.userId,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create document: ${error.message}`);
    return data;
  }

  async updateDocumentContent(
    documentId: string,
    format: string,
    contentUrl: string,
    userId: string
  ): Promise<DocumentVersion> {
    // Create new version and update document timestamp
  }
}
```

## Infrastructure and Deployment

### Infrastructure as Code

- **Tool:** Azure Resource Manager (ARM) Templates with Bicep
- **Location:** `infrastructure/` directory in repository root
- **Approach:** Declarative infrastructure definition with parameterized templates for different environments

### Deployment Strategy

- **Strategy:** Blue-Green deployment with Azure DevOps Pipelines
- **CI/CD Platform:** Azure DevOps with GitHub integration
- **Pipeline Configuration:** `.azure-pipelines/` directory with YAML pipeline definitions

### Environments

- **Development:** Local development with Docker Compose and Azure Emulators
- **Staging:** Azure Resource Group `bmad-platform-staging` with reduced capacity
- **Production:** Azure Resource Group `bmad-platform-prod` with high availability and auto-scaling

### Environment Promotion Flow

```
Development (Local) → Staging (Azure) → Production (Azure)
     ↓                    ↓                    ↓
Docker Compose      ARM Templates      ARM Templates
Azure Emulators     Standard Tier      Premium Tier
```

### Rollback Strategy

- **Primary Method:** Blue-Green deployment slots in Azure App Service
- **Trigger Conditions:** Health check failures, error rate > 5%, performance degradation > 50%
- **Recovery Time Objective:** < 5 minutes for frontend, < 2 minutes for backend services

### Azure Deployment Pipeline

```mermaid
graph LR
    subgraph "Source Control"
        GIT[GitHub Repository]
    end

    subgraph "CI/CD Pipeline - Azure DevOps"
        BUILD[Build Stage<br/>- Python tests<br/>- Docker images<br/>- ARM validation]
        DEPLOY_STAGING[Deploy to Staging<br/>- ARM deployment<br/>- Function deployment<br/>- Integration tests]
        DEPLOY_PROD[Deploy to Production<br/>- Blue-Green swap<br/>- Health checks<br/>- Monitoring alerts]
    end

    subgraph "Azure Staging Environment"
        STAGING[Staging Resources<br/>- App Service<br/>- Functions<br/>- Database]
    end

    subgraph "Azure Production Environment"
        PROD[Production Resources<br/>- App Service (Blue/Green)<br/>- Functions<br/>- Database with replicas]
    end

    GIT --> BUILD
    BUILD --> DEPLOY_STAGING
    DEPLOY_STAGING --> STAGING
    DEPLOY_STAGING --> DEPLOY_PROD
    DEPLOY_PROD --> PROD
```

#### Azure Deployment Pipeline Explanation

This diagram illustrates the complete CI/CD pipeline using Azure DevOps for automated deployment:

**Pipeline Components:**

**Source Control:**
- **GitHub Repository:** Central code repository containing all application code, infrastructure templates, and configuration files
- **Branch Strategy:** Main branch for production, develop branch for staging, feature branches for development

**CI/CD Pipeline Stages:**

**Build Stage:**
- **Python Tests:** Executes comprehensive test suite using pytest with coverage reporting
- **Docker Images:** Builds container images for both frontend (Node.js) and backend (Python) applications
- **ARM Validation:** Validates Azure Resource Manager (Bicep) templates for infrastructure changes
- **Security Scanning:** Performs static code analysis and dependency vulnerability scanning
- **Artifact Creation:** Packages application code, Docker images, and infrastructure templates

**Deploy to Staging:**
- **ARM Deployment:** Deploys or updates Azure infrastructure using validated Bicep templates
- **Function Deployment:** Deploys Azure Functions for background processing and webhooks
- **Integration Tests:** Runs comprehensive integration tests against staging environment
- **Performance Testing:** Executes load tests to validate system performance under expected load
- **Security Testing:** Performs dynamic security testing against deployed staging environment

**Deploy to Production:**
- **Blue-Green Swap:** Uses Azure App Service deployment slots for zero-downtime deployment
- **Health Checks:** Validates application health before switching traffic to new deployment
- **Monitoring Alerts:** Configures Application Insights alerts and monitoring dashboards
- **Rollback Capability:** Maintains ability to quickly rollback to previous version if issues detected

**Environment Flow:**
- **Staging Environment:** Mirrors production configuration with reduced capacity for cost optimization
- **Production Environment:** Full-scale deployment with high availability, auto-scaling, and disaster recovery

**Pipeline Benefits:**
- **Automated Quality Gates:** Each stage must pass before proceeding to next stage
- **Infrastructure as Code:** All infrastructure changes version-controlled and automated
- **Zero-Downtime Deployment:** Blue-green deployment ensures continuous availability
- **Comprehensive Testing:** Multiple testing layers catch issues before production
- **Monitoring Integration:** Automatic setup of monitoring and alerting for new deployments

**Deployment Triggers:**
- **Automatic:** Commits to main branch trigger staging deployment
- **Manual Approval:** Production deployment requires manual approval gate
- **Rollback:** Automatic rollback triggers on health check failures or error rate spikes

## Project Structure

Based on Python backend architecture and Azure deployment requirements, here's the comprehensive project structure:

```
bmad-web-platform/
├── .azure-pipelines/               # Azure DevOps CI/CD pipelines
│   ├── ci-pipeline.yml             # Build, test, and validation
│   ├── deploy-staging.yml          # Staging deployment pipeline
│   └── deploy-production.yml       # Production deployment pipeline
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Base UI components
│   │   │   ├── document/           # Document editing components
│   │   │   ├── collaboration/      # Real-time collaboration
│   │   │   └── project/            # Project management
│   │   ├── pages/                  # React Router pages
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API service clients
│   │   ├── stores/                 # State management (Zustand)
│   │   └── utils/                  # Frontend utilities
│   ├── public/                     # Static assets
│   ├── tests/                      # Frontend tests (Jest + RTL)
│   ├── package.json
│   ├── Dockerfile                  # Frontend container definition
│   └── web.config                  # Azure App Service configuration
├── backend/                        # Python backend services
│   ├── src/
│   │   ├── api/                    # FastAPI application
│   │   │   ├── routers/            # API route handlers
│   │   │   ├── dependencies/       # Dependency injection
│   │   │   ├── middleware/         # Custom middleware
│   │   │   └── main.py             # FastAPI app initialization
│   │   ├── services/               # Business logic services
│   │   │   ├── document_service.py
│   │   │   ├── translation_service.py
│   │   │   ├── github_service.py
│   │   │   ├── collaboration_service.py
│   │   │   ├── queue_service.py    # Azure Storage Queue operations
│   │   │   └── auth_service.py     # MSAL authentication service
│   │   ├── models/                 # SQLAlchemy models
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── repositories/           # Data access layer
│   │   ├── utils/                  # Backend utilities
│   │   └── config/                 # Configuration management
│   ├── functions/                  # Azure Functions
│   │   ├── document_processor/     # Document conversion function
│   │   ├── github_webhook/         # GitHub webhook handler
│   │   ├── collaboration_hub/      # SignalR hub function
│   │   └── requirements.txt        # Function dependencies
│   ├── tests/                      # Backend tests (pytest)
│   │   ├── unit/                   # Unit tests
│   │   ├── integration/            # Integration tests
│   │   └── fixtures/               # Test fixtures
│   ├── alembic/                    # Database migrations
│   │   ├── versions/               # Migration files
│   │   └── alembic.ini             # Alembic configuration
│   ├── pyproject.toml              # Poetry configuration
│   ├── Dockerfile                  # Backend container definition
│   └── requirements.txt            # Production dependencies
├── shared/                         # Shared code and types
│   ├── python/                     # Python shared modules
│   │   ├── models/                 # Shared data models
│   │   ├── constants/              # Shared constants
│   │   └── utils/                  # Shared utilities
│   └── typescript/                 # TypeScript shared types
│       ├── types/                  # Interface definitions
│       └── constants/              # Shared constants
├── infrastructure/                 # Infrastructure as Code
│   ├── bicep/                      # Azure Bicep templates
│   │   ├── main.bicep              # Main infrastructure template
│   │   ├── modules/                # Reusable Bicep modules
│   │   └── parameters/             # Environment-specific parameters
│   ├── arm-templates/              # ARM template alternatives
│   └── scripts/                    # Deployment scripts
├── docs/                           # Documentation
│   ├── prd.md                      # Product Requirements Document
│   ├── architecture.md             # This architecture document
│   ├── api/                        # API documentation
│   └── deployment/                 # Deployment guides
├── scripts/                        # Build and utility scripts
│   ├── build.sh                    # Build script
│   ├── deploy.sh                   # Deployment script
│   └── setup-dev.sh                # Development environment setup
├── docker-compose.yml              # Local development environment
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## Development Workflow

### Local Development Setup

#### Prerequisites

```bash
# Install Node.js (via nvm)
nvm install 18.18.0
nvm use 18.18.0

# Install pnpm (faster package manager for monorepos)
npm install -g pnpm@8.10.0

# Install Nx CLI globally
npm install -g nx@17.0.0

# Install Supabase CLI
npm install -g supabase@1.110.0
```

#### Initial Setup

```bash
# Clone and setup
git clone https://github.com/your-org/bmad-web-platform.git
cd bmad-web-platform

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# Start Supabase local development
supabase start

# Run database migrations
supabase db reset

# Build shared packages
nx run-many --target=build --projects=shared,ui,config,bmad-core
```

#### Development Commands

```bash
# Start all services
pnpm run dev

# Start frontend only
nx serve web

# Run tests
pnpm run test              # All tests
pnpm run test:unit         # Unit tests only
pnpm run test:e2e          # End-to-end tests

# Database operations
pnpm run db:migrate        # Run pending migrations
pnpm run db:reset          # Reset database
pnpm run db:studio         # Open Supabase Studio

# Build for production
pnpm run build
```

### Environment Configuration

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FIGMA_CLIENT_ID=your_figma_client_id
FIGMA_CLIENT_SECRET=your_figma_client_secret

# Backend (.env)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel (optimized for Next.js applications)
- **Build Command:** `nx build web`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Vercel Edge Network with global distribution

**Backend Deployment:**
- **Platform:** Vercel Functions (serverless API routes)
- **Deployment Method:** Automatic deployment via Git integration

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3000/api | Local development |
| Staging | https://bmad-platform-staging.vercel.app | https://bmad-platform-staging.vercel.app/api | Pre-production testing |
| Production | https://bmad-platform.vercel.app | https://bmad-platform.vercel.app/api | Live environment |

## Security

### Security Architecture Overview

The platform implements defense-in-depth security with Azure-native services and MSAL authentication:

- **Identity & Access:** MSAL + Azure AD for enterprise SSO
- **API Security:** FastAPI with JWT validation and rate limiting
- **Data Protection:** Encryption at rest and in transit
- **Network Security:** Azure Front Door with WAF
- **Secrets Management:** Azure Key Vault for all sensitive data

### Authentication & Authorization

**MSAL Integration:**
```python
# Backend MSAL configuration
from msal import ConfidentialClientApplication
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

class MSALAuthenticator:
    def __init__(self):
        self.app = ConfidentialClientApplication(
            client_id=settings.AZURE_CLIENT_ID,
            client_credential=settings.AZURE_CLIENT_SECRET,
            authority=f"https://login.microsoftonline.com/{settings.TENANT_ID}"
        )

    async def validate_token(self, token: str) -> dict:
        try:
            # Validate JWT token with Azure AD
            result = jwt.decode(
                token,
                key=self.get_public_key(),
                algorithms=["RS256"],
                audience=settings.AZURE_CLIENT_ID
            )
            return result
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

# Dependency for protected routes
async def get_current_user(token: str = Depends(HTTPBearer())) -> User:
    auth = MSALAuthenticator()
    token_data = await auth.validate_token(token.credentials)

    # Get or create user from Azure AD object ID
    user = await user_service.get_or_create_from_azure_ad(
        azure_ad_object_id=token_data["oid"],
        email=token_data["preferred_username"],
        name=token_data["name"]
    )
    return user
```

### Input Validation & API Security

**Pydantic Validation with Security:**
```python
from pydantic import BaseModel, Field, validator
import re

class DocumentCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: DocumentType
    content: Optional[str] = Field(None, max_length=10_000_000)  # 10MB limit

    @validator('name')
    def validate_name(cls, v):
        # Sanitize document name - prevent path traversal
        if not re.match(r'^[a-zA-Z0-9\s\-_\.]+$', v):
            raise ValueError('Document name contains invalid characters')
        return v.strip()

    @validator('content')
    def validate_content(cls, v):
        if v:
            # Basic XSS prevention
            dangerous_patterns = ['<script', 'javascript:', 'onload=', 'onerror=']
            for pattern in dangerous_patterns:
                if pattern.lower() in v.lower():
                    raise ValueError('Content contains potentially dangerous elements')
        return v
```

**Rate Limiting & CORS:**
```python
from slowapi import Limiter
from fastapi.middleware.cors import CORSMiddleware

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/documents/upload")
@limiter.limit("10/minute")
async def upload_document(request: Request, ...):
    pass

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bmad-platform.azurewebsites.net",
        "https://bmad-platform-staging.azurewebsites.net"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"]
)
```

### Data Protection & Secrets Management

**Azure Key Vault Integration:**
```python
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

class SecretManager:
    def __init__(self):
        credential = DefaultAzureCredential()
        self.client = SecretClient(
            vault_url=f"https://{settings.KEY_VAULT_NAME}.vault.azure.net/",
            credential=credential
        )

    async def get_secret(self, secret_name: str) -> str:
        secret = self.client.get_secret(secret_name)
        return secret.value

# Usage
secret_manager = SecretManager()
github_token = await secret_manager.get_secret("github-api-token")
```

**Security Headers:**
```python
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' https://login.microsoftonline.com; "
            "connect-src 'self' https://login.microsoftonline.com https://api.github.com"
        )
        return response
```

## Performance Optimization

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** < 500KB initial bundle, < 200KB per route chunk
- **Loading Strategy:** Progressive loading with skeleton screens, lazy loading for document content
- **Caching Strategy:** Browser caching with service workers, React Query for server state caching
- **CDN Integration:** Azure CDN for static assets and document previews

**Backend Performance:**
- **Response Time Target:** < 200ms for API responses, < 10 seconds for document conversion
- **Database Optimization:** Connection pooling with SQLAlchemy, proper indexing, query optimization
- **Caching Strategy:** Redis caching for document previews (1 hour TTL), API responses (15 minutes TTL)
- **Async Processing:** Background jobs with Azure Storage Queues for heavy operations

**Azure-Specific Optimizations:**
```python
# Database connection pooling
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import QueuePool

engine = create_async_engine(
    database_url,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Redis caching with Azure Cache for Redis
import aioredis
from functools import wraps

async def cached(ttl: int = 3600):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"

            # Try to get from cache
            cached_result = await redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

            # Execute function and cache result
            result = await func(*args, **kwargs)
            await redis_client.setex(cache_key, ttl, json.dumps(result, default=str))
            return result
        return wrapper
    return decorator

@cached(ttl=3600)
async def get_document_preview(document_id: UUID) -> dict:
    # Expensive operation that benefits from caching
    pass
```

## Monitoring and Observability

### Azure Monitoring Stack

**Application Insights Integration:**
```python
from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure import metrics_exporter
import logging

# Configure Application Insights logging
logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(
    connection_string=settings.APPLICATIONINSIGHTS_CONNECTION_STRING
))

# Custom metrics
metrics_exporter = metrics_exporter.new_metrics_exporter(
    connection_string=settings.APPLICATIONINSIGHTS_CONNECTION_STRING
)

class MetricsCollector:
    @staticmethod
    def track_document_conversion(document_type: str, duration: float, success: bool):
        metrics_exporter.add_telemetry({
            'name': 'document_conversion',
            'value': duration,
            'properties': {
                'document_type': document_type,
                'success': success
            }
        })

    @staticmethod
    def track_api_request(endpoint: str, method: str, status_code: int, duration: float):
        metrics_exporter.add_telemetry({
            'name': 'api_request',
            'value': duration,
            'properties': {
                'endpoint': endpoint,
                'method': method,
                'status_code': status_code
            }
        })

# Usage in FastAPI middleware
@app.middleware("http")
async def monitoring_middleware(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time
    MetricsCollector.track_api_request(
        endpoint=request.url.path,
        method=request.method,
        status_code=response.status_code,
        duration=duration
    )

    return response
```

### Key Performance Indicators

**System Metrics:**
- **API Response Time:** P95 < 500ms, P99 < 1s
- **Document Conversion Time:** Average < 10s, P95 < 30s
- **Database Query Performance:** Average < 50ms
- **Cache Hit Rate:** > 80% for document previews
- **Error Rate:** < 0.5% for critical operations

**Business Metrics:**
- **Document Processing Success Rate:** > 99%
- **Real-time Collaboration Latency:** < 100ms
- **GitHub Sync Success Rate:** > 98%
- **User Session Duration:** Track engagement patterns

**Azure-Specific Monitoring:**
```python
# Custom health check endpoint
@app.get("/health")
async def health_check():
    checks = {
        "database": await check_database_health(),
        "redis": await check_redis_health(),
        "blob_storage": await check_blob_storage_health(),
        "key_vault": await check_key_vault_health()
    }

    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503

    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if all_healthy else "unhealthy",
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

async def check_database_health() -> bool:
    try:
        async with get_database() as db:
            await db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
```

### Alerting and Incident Response

**Azure Monitor Alerts:**
- **High Error Rate:** > 1% error rate for 5 minutes
- **Slow Response Time:** P95 > 1s for 10 minutes
- **Database Connection Issues:** Connection failures > 5% for 2 minutes
- **Document Conversion Failures:** > 5% failure rate for 15 minutes

**Incident Response Runbook:**
1. **Automated Response:** Scale up Azure App Service instances
2. **Notification:** Alert on-call engineer via Azure Monitor
3. **Diagnostics:** Check Application Insights for error patterns
4. **Escalation:** Page team lead if not resolved in 30 minutes

## Test Strategy and Standards

### Testing Philosophy

- **Test-Driven Development:** Write tests before implementation for critical business logic
- **Coverage Goals:** 90% code coverage for backend services, 80% for frontend components
- **Test Pyramid:** Focus on unit tests, selective integration tests, minimal E2E tests

### Testing Pyramid

```
           E2E Tests (Playwright)
          /                    \
    Integration Tests (pytest + TestClient)
   /                                      \
Backend Unit Tests (pytest)    Frontend Unit Tests (Jest + RTL)
```

### Backend Testing Strategy (Python)

**Unit Tests with pytest:**
```python
# tests/unit/test_document_service.py
import pytest
from unittest.mock import AsyncMock, Mock
from uuid import uuid4
from src.services.document_service import DocumentService
from src.models.document import Document, DocumentType, DocumentFormat

@pytest.fixture
async def document_service():
    mock_repo = AsyncMock()
    mock_user = Mock()
    return DocumentService(mock_repo, mock_user)

@pytest.mark.asyncio
async def test_create_document_success(document_service):
    # Arrange
    document_data = {
        "name": "Test Document",
        "type": DocumentType.PRD,
        "format": DocumentFormat.MARKDOWN
    }
    expected_document = Document(id=uuid4(), **document_data)
    document_service.repository.create.return_value = expected_document

    # Act
    result = await document_service.create_document(document_data)

    # Assert
    assert result.name == "Test Document"
    assert result.type == DocumentType.PRD
    document_service.repository.create.assert_called_once()

@pytest.mark.asyncio
async def test_create_document_validation_error(document_service):
    # Test validation error handling
    with pytest.raises(ValidationError):
        await document_service.create_document({"name": ""})
```

**Integration Tests with FastAPI TestClient:**
```python
# tests/integration/test_document_api.py
import pytest
from httpx import AsyncClient
from fastapi import status
from src.main import app
from tests.conftest import override_get_current_user, test_user

@pytest.mark.asyncio
async def test_upload_document_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Override authentication for testing
        app.dependency_overrides[get_current_user] = override_get_current_user

        files = {"file": ("test.docx", b"fake docx content", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
        data = {
            "project_id": str(uuid4()),
            "name": "Test Document",
            "type": "prd",
            "format": "docx"
        }

        response = await client.post("/api/v1/documents/upload", files=files, data=data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["name"] == "Test Document"

@pytest.mark.asyncio
async def test_document_conversion_flow():
    # Test complete document conversion workflow
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Upload document
        upload_response = await client.post("/api/v1/documents/upload", ...)
        document_id = upload_response.json()["id"]

        # Request conversion
        conversion_response = await client.post(
            "/api/v1/conversion/convert",
            json={
                "document_id": document_id,
                "target_format": "markdown"
            }
        )

        assert conversion_response.status_code == status.HTTP_202_ACCEPTED
        job_id = conversion_response.json()["job_id"]

        # Check conversion status
        status_response = await client.get(f"/api/v1/conversion/{job_id}/status")
        assert status_response.status_code == status.HTTP_200_OK
```

**Database Testing with pytest-asyncio:**
```python
# tests/repositories/test_document_repository.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.document_repository import DocumentRepository
from src.models.document import Document

@pytest.mark.asyncio
async def test_document_repository_create(async_session: AsyncSession):
    # Arrange
    repo = DocumentRepository(async_session)
    document_data = {
        "name": "Test Document",
        "project_id": uuid4(),
        "type": DocumentType.PRD,
        "format": DocumentFormat.MARKDOWN,
        "created_by": uuid4()
    }

    # Act
    document = await repo.create(document_data)

    # Assert
    assert document.id is not None
    assert document.name == "Test Document"

    # Verify in database
    saved_document = await repo.get_by_id(document.id)
    assert saved_document is not None
    assert saved_document.name == "Test Document"
```

### Frontend Testing Strategy (React)

**Component Unit Tests:**
```typescript
// tests/components/DocumentEditor.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentEditor } from '@/components/DocumentEditor';
import { useDocumentStream } from '@/hooks/useDocumentStream';

jest.mock('@/hooks/useDocumentStream');

describe('DocumentEditor', () => {
  beforeEach(() => {
    (useDocumentStream as jest.Mock).mockReturnValue({
      updates: [],
      sendUpdate: jest.fn(),
      isConnected: true
    });
  });

  it('renders document content correctly', () => {
    render(<DocumentEditor documentId="test-id" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('sends updates on content change', async () => {
    const mockSendUpdate = jest.fn();
    (useDocumentStream as jest.Mock).mockReturnValue({
      updates: [],
      sendUpdate: mockSendUpdate,
      isConnected: true
    });

    render(<DocumentEditor documentId="test-id" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'New content' } });

    await waitFor(() => {
      expect(mockSendUpdate).toHaveBeenCalledWith({
        type: 'content_change',
        content: 'New content'
      });
    });
  });
});
```

### End-to-End Testing with Playwright

```typescript
// tests/e2e/document-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Document Management Workflow', () => {
  test('complete document upload and conversion flow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.click('[data-testid="login-button"]');

    // Upload document
    await page.goto('/projects/test-project');
    await page.setInputFiles('[data-testid="file-upload"]', 'test-files/sample.docx');
    await page.fill('[data-testid="document-name"]', 'Test Document');
    await page.click('[data-testid="upload-button"]');

    // Verify upload success
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();

    // Wait for conversion
    await expect(page.locator('[data-testid="conversion-complete"]')).toBeVisible({ timeout: 30000 });

    // Verify document appears in list
    await expect(page.locator('text=Test Document')).toBeVisible();
  });

  test('real-time collaboration', async ({ browser }) => {
    // Create two browser contexts for different users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Both users navigate to same document
    await page1.goto('/documents/test-document-id');
    await page2.goto('/documents/test-document-id');

    // User 1 makes edit
    await page1.fill('[data-testid="document-editor"]', 'User 1 edit');

    // Verify User 2 sees the update
    await expect(page2.locator('[data-testid="document-editor"]')).toHaveValue('User 1 edit');
  });
});
```

### Test Configuration

**pytest configuration (pytest.ini):**
```ini
[tool:pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    --strict-markers
    --strict-config
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=90
```

**Test fixtures (conftest.py):**
```python
# tests/conftest.py
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from src.database import get_database
from src.main import app

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def async_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with AsyncSession(engine) as session:
        yield session

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
```

## Coding Standards

### Critical Backend Rules (Python)

- **Type Hints:** All functions must have complete type hints using Python 3.11+ syntax
- **Pydantic Models:** Use Pydantic for all API request/response schemas and data validation
- **Database Access:** Always use SQLAlchemy ORM through repository pattern, never raw SQL
- **Error Handling:** All endpoints must use FastAPI exception handlers and return structured errors
- **Authentication:** All protected endpoints must use MSAL dependency injection
- **Async/Await:** Use async/await for all I/O operations (database, external APIs, file operations)
- **Environment Variables:** Access only through Pydantic Settings, never os.environ directly
- **Logging:** Use structured logging with correlation IDs for all operations

### Critical Frontend Rules (React)

- **MSAL Integration:** Always use MSAL hooks for authentication, never custom auth logic
- **API Calls:** Use axios with interceptors for token management and error handling
- **State Management:** Use React Query for server state, Zustand for client state
- **Error Boundaries:** Wrap all major components in error boundaries
- **TypeScript:** Strict mode enabled, no 'any' types allowed in production code

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| **Components** | PascalCase | - | `DocumentEditor.tsx` |
| **Hooks** | camelCase with 'use' | - | `useDocumentStream.ts` |
| **API Routes** | - | snake_case | `/api/v1/documents/upload` |
| **Database Tables** | - | snake_case | `document_versions` |
| **Python Functions** | - | snake_case | `convert_document_format()` |
| **Python Classes** | - | PascalCase | `DocumentService` |
| **Pydantic Models** | - | PascalCase | `DocumentResponse` |

### Python-Specific Standards

```python
# Type hints are mandatory
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

async def convert_document(
    document_id: UUID,
    target_format: DocumentFormat,
    current_user: User
) -> ConversionJobResponse:
    """Convert document to target format with proper error handling."""
    pass

# Pydantic models for all data structures
class DocumentCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: DocumentType
    format: DocumentFormat

    class Config:
        use_enum_values = True

# Repository pattern for database access
class DocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, document_data: DocumentCreateRequest) -> Document:
        # Implementation with proper error handling
        pass

# Dependency injection for services
async def get_document_service(
    db: AsyncSession = Depends(get_database),
    current_user: User = Depends(get_current_user)
) -> DocumentService:
    return DocumentService(DocumentRepository(db), current_user)
```

### Code Quality Tools

**Python Backend:**
```toml
# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.isort]
profile = "black"
line_length = 100

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

**Frontend (TypeScript):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Error Handling Strategy

### Error Response Format

```python
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ValidationError(BaseModel):
    field: str
    message: str
    code: str

class ErrorResponse(BaseModel):
    error: Dict[str, Any]

    @classmethod
    def create(
        cls,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        validation_errors: Optional[List[ValidationError]] = None
    ):
        return cls(error={
            "code": code,
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat(),
            "validation_errors": validation_errors or []
        })
```

### FastAPI Error Handling

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import http_exception_handler
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError
import logging
import uuid

app = FastAPI()

# Custom exception classes
class DocumentNotFoundError(Exception):
    pass

class ConversionFailedError(Exception):
    def __init__(self, message: str, details: Dict[str, Any] = None):
        self.message = message
        self.details = details or {}

class AuthenticationError(Exception):
    pass

# Global exception handlers
@app.exception_handler(DocumentNotFoundError)
async def document_not_found_handler(request: Request, exc: DocumentNotFoundError):
    return JSONResponse(
        status_code=404,
        content=ErrorResponse.create(
            code="DOCUMENT_NOT_FOUND",
            message="The requested document was not found"
        ).dict()
    )

@app.exception_handler(ConversionFailedError)
async def conversion_failed_handler(request: Request, exc: ConversionFailedError):
    return JSONResponse(
        status_code=422,
        content=ErrorResponse.create(
            code="CONVERSION_FAILED",
            message=exc.message,
            details=exc.details
        ).dict()
    )

@app.exception_handler(PydanticValidationError)
async def validation_exception_handler(request: Request, exc: PydanticValidationError):
    validation_errors = [
        ValidationError(
            field=".".join(str(loc) for loc in error["loc"]),
            message=error["msg"],
            code=error["type"]
        )
        for error in exc.errors()
    ]

    return JSONResponse(
        status_code=422,
        content=ErrorResponse.create(
            code="VALIDATION_ERROR",
            message="Invalid input data provided",
            validation_errors=validation_errors
        ).dict()
    )

@app.exception_handler(AuthenticationError)
async def auth_exception_handler(request: Request, exc: AuthenticationError):
    return JSONResponse(
        status_code=401,
        content=ErrorResponse.create(
            code="UNAUTHORIZED",
            message="Authentication required"
        ).dict()
    )

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logging.error(f"Request {request_id} failed: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content=ErrorResponse.create(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected error occurred",
                details={"request_id": request_id}
            ).dict()
        )
```

### Frontend Error Handling (React)

```typescript
// Error handling utilities for React frontend
export class ApiErrorHandler {
  static async handleApiError(error: any) {
    if (error.response) {
      const errorData = error.response.data?.error;

      switch (errorData?.code) {
        case 'UNAUTHORIZED':
          // Trigger MSAL re-authentication
          await msalInstance.loginRedirect();
          break;

        case 'VALIDATION_ERROR':
          this.showValidationErrors(errorData.validation_errors);
          break;

        case 'CONVERSION_FAILED':
          this.showConversionError(errorData);
          break;

        case 'DOCUMENT_NOT_FOUND':
          this.showNotFoundError();
          break;

        default:
          this.showGenericError(errorData);
      }
    }
  }

  static showValidationErrors(validationErrors: ValidationError[]) {
    // Display field-specific validation errors in form
    validationErrors.forEach(error => {
      console.error(`${error.field}: ${error.message}`);
    });
  }

  static showConversionError(errorData: any) {
    // Show conversion-specific error with retry option
    console.error('Document conversion failed:', errorData.details);
  }
}

// React hook for error handling
export function useErrorHandler() {
  const handleError = useCallback(async (error: any) => {
    await ApiErrorHandler.handleApiError(error);
  }, []);

  return { handleError };
}
```

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics for Core Web Vitals, Sentry for JavaScript error tracking
- **Backend Monitoring:** Vercel Functions Analytics, Supabase Dashboard for database metrics
- **Error Tracking:** Sentry for both frontend and backend error aggregation
- **Performance Monitoring:** Vercel Speed Insights, Uptime Robot for endpoint availability

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- JavaScript errors: Error rate < 0.1%
- API response times: Document operations < 500ms
- User interactions: Document upload success rate > 99%

**Backend Metrics:**
- Request rate: API calls per minute with endpoint breakdown
- Error rate: < 0.5% for critical document operations
- Response time: P95 < 1s for document operations
- Database query performance: Average query time < 50ms

**Business Metrics:**
- Document processing: Conversion success rate, fidelity scores
- Collaboration usage: Active sessions, real-time editing conflicts resolved
- Integration health: GitHub sync success rate, Figma import completion rate

---

## Summary

This comprehensive backend architecture document provides the complete technical foundation for the BMAD-Driven SDLC Platform Web UI Python backend with Azure deployment. The architecture balances rapid MVP delivery (6-9 month timeline) with enterprise scalability, leveraging modern technologies like Python 3.11, FastAPI, Azure Functions, and Azure Database for PostgreSQL to create a sophisticated document processing and collaboration platform.

Key architectural decisions prioritize:
- **Python Ecosystem:** Leveraging Python's rich document processing libraries (Pandoc, python-docx) and async capabilities
- **Azure Cloud-Native:** Full utilization of Azure services for scalability, reliability, and cost optimization
- **Simplified Architecture:** Server-Sent Events for real-time features, Azure Storage Queues for messaging
- **Enterprise Authentication:** MSAL + Azure AD integration for seamless SSO
- **Security-First:** Comprehensive security with Azure Key Vault, encryption, and proper validation
- **Performance Optimization:** Async Python with intelligent caching, CDN distribution, and monitoring
- **Developer Experience:** Type-safe Python with comprehensive testing and clear coding standards
- **Cost Efficiency:** Simplified services reduce complexity and operational costs

**Architecture Highlights:**
- **Real-Time Communication:** Server-Sent Events instead of complex SignalR setup
- **Message Processing:** Azure Storage Queues instead of Service Bus for simplicity
- **Authentication:** MSAL for enterprise SSO instead of separate B2C tenant
- **Platform Flexibility:** Support for both Linux and Windows App Service deployment
- **Comprehensive Testing:** Full test pyramid with pytest, FastAPI TestClient, and Playwright
- **Monitoring & Observability:** Azure Application Insights with custom metrics and alerting

The platform is designed to bridge the gap between business stakeholders working in familiar document formats and developers operating in technical environments, enabling seamless collaboration and efficient handoffs throughout the software development lifecycle.

## Next Steps

### Immediate Actions (Week 1-2)

1. **Azure Environment Setup**
   - Create Azure subscription and resource groups for dev/staging/prod
   - Set up Azure DevOps organization and project
   - Configure Azure AD B2C tenant for authentication
   - Establish Azure Key Vault for secrets management

2. **Development Environment**
   - Set up local development with Docker Compose
   - Configure Python virtual environments with Poetry
   - Install Azure CLI and Azure Functions Core Tools
   - Set up database schema with Alembic migrations

3. **CI/CD Pipeline Foundation**
   - Create Azure DevOps pipelines for build and deployment
   - Set up automated testing with pytest and coverage reporting
   - Configure Infrastructure as Code with Bicep templates
   - Establish monitoring and alerting with Application Insights

### Phase 1: Core Backend Services (Week 3-8)

1. **Document Management Service**
   - Implement FastAPI application with SQLAlchemy models
   - Create Azure Function for document CRUD operations
   - Set up Azure Blob Storage integration for file handling
   - Implement role-based access control with Azure AD B2C

2. **Format Translation Service**
   - Develop Python-based document conversion using Pandoc and python-docx
   - Create Azure Container Instances for heavy processing workloads
   - Implement async job processing with Azure Service Bus
   - Add conversion quality scoring and fidelity metrics

3. **GitHub Integration Service**
   - Build GitHub OAuth integration with Azure Key Vault
   - Implement bidirectional sync with conflict resolution
   - Create webhook handlers for real-time updates
   - Add automated PR creation and branch management

### Phase 2: Advanced Features (Week 9-16)

1. **Real-time Collaboration**
   - Implement Azure SignalR Service for real-time editing
   - Add operational transform for conflict resolution
   - Create session management with Redis caching
   - Build participant tracking and cursor synchronization

2. **BMAD Agent Orchestration**
   - Develop agent role switching with dynamic prompt loading
   - Implement workflow orchestration with Azure Durable Functions
   - Create template management system
   - Add guided specification creation workflows

3. **Performance Optimization**
   - Implement comprehensive caching strategies
   - Add CDN integration for global content delivery
   - Optimize database queries and indexing
   - Set up auto-scaling policies for Azure Functions

### Phase 3: Production Readiness (Week 17-24)

1. **Security Hardening**
   - Complete security audit and penetration testing
   - Implement comprehensive logging and audit trails
   - Add data encryption at rest and in transit
   - Configure network security groups and firewalls

2. **Monitoring & Observability**
   - Set up comprehensive monitoring dashboards
   - Implement custom metrics and alerting
   - Add distributed tracing for complex workflows
   - Create runbooks for incident response

3. **Documentation & Training**
   - Complete API documentation with OpenAPI/Swagger
   - Create deployment and operations guides
   - Develop troubleshooting documentation
   - Prepare team training materials

### Success Metrics

- **Development Velocity:** Complete core backend services within 8 weeks
- **Performance:** API response times < 200ms, document conversion < 10 seconds
- **Reliability:** 99.9% uptime with automated failover
- **Security:** Pass security audit with zero critical vulnerabilities
- **Scalability:** Support 500+ concurrent users with auto-scaling
