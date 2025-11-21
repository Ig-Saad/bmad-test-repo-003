# BMad v6-Powered SDLC Platform Web UI Architecture Document

## Introduction

This document outlines the comprehensive architecture for **BMad v6-Powered SDLC Platform Web UI**, including both POC validation and full platform implementations. The architecture bridges BMad v6's revolutionary AI-driven agile methodology with web-based accessibility, enabling non-technical stakeholders to leverage scale-adaptive intelligence, intelligent agent orchestration, and proven 4-phase workflows through intuitive interfaces while maintaining seamless integration with existing BMad v6 IDE workflows.

## Related Documentation

**For POC Implementation:**
- **[POC Technical Architecture](./poc-technical-architecture.md)** - Detailed microservices architecture for 5-epic POC implementation
- **[POC PRD](./poc-prd.md)** - POC requirements, scope, and validation criteria
- **[Epic User Stories](./stories/)** - Comprehensive user story elaborations for all 5 POC epics

**For Full Platform:**
- **[Full Platform PRD](./prd.md)** - Complete platform vision and enterprise requirements
- **Current Document** - Strategic architecture and full platform technical vision

**Dual Architecture Approach:**
This document presents both POC validation architecture (4-6 week timeline) and comprehensive platform architecture (6-9 month MVP), showing clear evolution paths and shared architectural foundations. The POC validates core concepts while the full platform delivers enterprise-grade capabilities.

### Project Classification

Based on the PRD analysis, this is a **greenfield project** requiring custom architecture due to its unique requirements for:
- BMad v6 scale-adaptive intelligence integration (Quick Flow, BMad Method, Brownfield tracks)
- Intelligent agent orchestration from 12-agent ecosystem with context-aware selection
- Complete 4-phase methodology execution (Analysis → Planning → Solutioning → Implementation)
- Comprehensive artifact generation across SDLC, business, compliance, and training documentation
- Seamless BMad v6 IDE workflow integration with bidirectional synchronization
- Ignis Platform telemetry integration for ecosystem connectivity

**Decision:** Greenfield project requiring custom Node.js/React architecture optimized for cloud-native deployment, BMad v6 methodology preservation, and intelligent agent orchestration.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-11-10 | 1.0 | Initial architecture document creation | Winston (Architect) |
| 2025-11-11 | 2.0 | Updated for Python backend with Azure deployment | Winston (Architect) |
| 2025-11-17 | 3.0 | Updated for BMad v6-powered platform with POC and full architecture | Winston (Architect) |

## POC Architecture (Validation Phase)

### POC Technical Summary

The BMad v6-Powered SDLC Platform POC employs a **simplified cloud-native architecture** designed for rapid validation of core concepts within a 4-6 week timeline. The POC focuses on demonstrating intelligent agent orchestration from BMad v6's ecosystem, complete 4-phase methodology execution through web interfaces, and seamless integration with existing BMad v6 IDE workflows. Key validation points include context-aware agent selection (presenting 2-3 relevant agents initially), GitHub and SharePoint integration for bidirectional synchronization, and comprehensive Ignis Platform telemetry integration. The architecture leverages **React 18+ with Next.js 14, Node.js 20+ backend, and PostgreSQL 15** for streamlined development while maintaining BMad v6 methodology integrity and proving 60-70% token consumption reduction through selective agent loading.

### POC Cloud Infrastructure

**Provider:** Cloud-agnostic with preference for AWS/Azure/GCP based on team expertise
**Key Services:** Container-based deployment (Docker), managed PostgreSQL, Redis for caching, object storage for documents
**Deployment Strategy:** Single-region deployment with basic monitoring and logging

### POC High Level Architecture Diagram

```mermaid
graph TB
    subgraph "POC User Layer"
        POCBU[Non-Technical Users<br/>Web Interface]
        POCDEV[Technical Users<br/>Validation & Integration]
    end

    subgraph "POC Frontend - React/Next.js"
        POCWEB[React 18+ Web App<br/>Next.js 14 Framework]
        POCAGENT[Agent Selection UI<br/>Context-Aware Interface]
        POCPHASE[4-Phase Workflow<br/>Progress Tracking]
    end

    subgraph "POC Backend Services - Node.js"
        POCAPI[Node.js 20+ API<br/>Fastify Framework]
        POCORCH[BMad v6 Agent<br/>Orchestration Engine]
        POCDOC[Document Generation<br/>BMad v6 Templates]
        POCTEL[Ignis Platform<br/>Telemetry Service]
    end

    subgraph "POC Integrations"
        POCGH[GitHub Integration<br/>Repository Sync]
        POCSP[SharePoint Integration<br/>Document Management]
        POCBMAD[BMad v6 Framework<br/>Agent Definitions]
        POCIGNIS[Ignis Platform<br/>Analytics Endpoint]
    end

    subgraph "POC Data Layer"
        POCDB[(PostgreSQL 15<br/>Project & User Data)]
        POCREDIS[Redis 7<br/>Session & Cache]
        POCSTORAGE[Object Storage<br/>Documents & Artifacts]
    end

    POCBU --> POCWEB
    POCDEV --> POCWEB
    POCWEB --> POCAPI
    POCAPI --> POCORCH
    POCAPI --> POCDOC
    POCAPI --> POCTEL

    POCORCH --> POCBMAD
    POCDOC --> POCGH
    POCDOC --> POCSP
    POCTEL --> POCIGNIS

    POCAPI --> POCDB
    POCORCH --> POCREDIS
    POCDOC --> POCSTORAGE
```

### POC Architecture Components

**POC Frontend (React/Next.js):**
- **React 18+ Web Application:** Modern React with hooks and context for state management
- **Next.js 14 Framework:** Server-side rendering, API routes, and optimized performance
- **Agent Selection Interface:** Context-aware UI presenting 2-3 relevant BMad v6 agents initially
- **4-Phase Workflow Navigator:** Visual progress through Configuration, Ideation, Product Definition, Planning

**POC Backend Services (Node.js):**
- **Fastify API Server:** High-performance RESTful API with plugins for authentication and validation
- **BMad v6 Agent Orchestration:** Context-aware agent selection and progressive engagement logic
- **Document Generation Engine:** BMad v6 template processing with artifact creation capabilities
- **Ignis Platform Telemetry:** Comprehensive data capture and real-time transmission service

**POC Integration Layer:**
- **GitHub Integration:** Repository synchronization with basic commit and branch management
- **SharePoint Integration:** Document upload and metadata management via Microsoft Graph API
- **BMad v6 Framework Access:** Direct integration with agent definitions and template system
- **Ignis Platform Connectivity:** Real-time telemetry data transmission and validation

**POC Data Management:**
- **PostgreSQL 15:** Primary database for users, projects, agents, workflows, and artifacts
- **Redis 7:** Session management, agent definition caching, and performance optimization
- **Object Storage:** Document storage with version control and access management

### POC Success Validation Points

**Technical Validation:**
- 60-70% token consumption reduction through selective agent loading
- Sub-3-second response times for agent loading and workflow execution
- 100% successful bidirectional synchronization with GitHub and SharePoint
- Real-time telemetry data transmission to Ignis Platform with zero data loss

**User Experience Validation:**
- 90% user comprehension of complete workflow within 30 minutes
- 85% task completion rate for end-to-end project setup and artifact generation
- 95% accuracy in automatic phase completion detection and progress updates
- 75% user preference for web interface over traditional tools

## Full Platform Architecture (Production Implementation)

### Full Platform Technical Summary

The comprehensive BMad v6-Powered SDLC Platform employs an **enterprise-grade cloud-native microservices architecture** designed for 500+ monthly active users with complete project lifecycle orchestration capabilities. The platform implements BMad v6's full scale-adaptive intelligence engine with automatic complexity detection across three tracks (Quick Flow, BMad Method, Brownfield), intelligent agent orchestration from the complete 12-agent ecosystem, and comprehensive artifact generation spanning SDLC, business, compliance, and training documentation. The architecture leverages **React 18+ frontend, Node.js 20+ microservices, PostgreSQL 15 with Redis 7 caching, and cloud-native deployment** with advanced features including real-time collaborative editing, enterprise security, comprehensive analytics, and seamless integration with existing BMad v6 IDE workflows, GitHub repositories, Figma designs, and business tools (SharePoint, Confluence, Teams).

## High Level Architecture

### Full Platform Technical Summary

The comprehensive BMad v6-Powered SDLC Platform employs an **enterprise-grade cloud-native microservices architecture** supporting complete project lifecycle orchestration for 500+ monthly active users. The platform implements BMad v6's revolutionary scale-adaptive intelligence engine with automatic complexity detection and workflow selection across three tracks (Quick Flow, BMad Method, Brownfield), intelligent agent orchestration from the complete 12-agent ecosystem with context-aware selection and progressive engagement, and comprehensive artifact generation spanning SDLC documents, business artifacts, compliance documentation, and training materials. The architecture leverages **React 18+ frontend with Next.js 14, Node.js 20+ microservices, PostgreSQL 15 with Redis 7 caching** for enterprise-grade deployment with advanced features including real-time collaborative editing, enterprise security and compliance, comprehensive analytics and reporting, and seamless integration with existing BMad v6 IDE workflows, GitHub repositories, Figma designs, and business tools (SharePoint, Confluence, Teams) while maintaining BMad v6 methodology integrity throughout the complete 4-phase workflow execution.

### Full Platform Cloud Infrastructure

**Provider:** Cloud-agnostic with multi-cloud support (AWS/Azure/GCP)
**Key Services:** Container orchestration (Kubernetes), managed databases (PostgreSQL, Redis), object storage, API gateway, monitoring and logging
**Deployment Regions:** Multi-region deployment with global CDN for optimal performance
**Scalability:** Auto-scaling groups, load balancers, and horizontal pod autoscaling

### Repository Structure

**Structure:** Monorepo with workspace-based organization optimized for BMad v6 integration
**Monorepo Tool:** npm/yarn workspaces with Lerna for package management and versioning
**Package Organization:** Domain-driven packages with shared libraries for BMad v6 integration, agent orchestration, document processing, and comprehensive artifact generation

### Full Platform High Level Architecture Diagram

```mermaid
graph TB
    subgraph "User Layer"
        NTBU[Non-Technical Stakeholders<br/>Product Managers, Analysts, GTM]
        TECHBU[Technical Stakeholders<br/>Developers, Architects]
        COLLABU[Collaborative Users<br/>Cross-functional Teams]
    end

    subgraph "Frontend Layer - React/Next.js"
        WEB[React 18+ Web App<br/>Next.js 14 Framework]
        SCALEUI[Scale-Adaptive UI<br/>Track Selection Interface]
        AGENTUI[Intelligent Agent UI<br/>Context-Aware Selection]
        PHASEUI[4-Phase Workflow UI<br/>Progress Visualization]
        ARTIFACTUI[Artifact Generation UI<br/>Comprehensive Templates]
    end

    subgraph "API Gateway & Load Balancing"
        GATEWAY[API Gateway<br/>Rate Limiting & Auth]
        LB[Load Balancer<br/>Multi-Region Distribution]
    end

    subgraph "Core BMad v6 Services - Node.js Microservices"
        SCALEENG[Scale-Adaptive<br/>Intelligence Engine]
        AGENTORCH[Intelligent Agent<br/>Orchestration Service]
        PHASEENG[4-Phase Workflow<br/>Management Engine]
        ARTIFACTGEN[Comprehensive Artifact<br/>Generation Service]
        BMADIDE[BMad v6 IDE<br/>Integration Service]
    end

    subgraph "Integration & External Services"
        GITHUB[GitHub Integration<br/>Repository Sync]
        FIGMA[Figma Integration<br/>Design Workflows]
        SHAREPOINT[SharePoint Integration<br/>Document Management]
        IGNIS[Ignis Platform<br/>Telemetry & Analytics]
        BMADCORE[BMad v6 Framework<br/>Agent Definitions & Templates]
    end

    subgraph "Data & Storage Layer"
        PRIMARYDB[(PostgreSQL 15<br/>Primary Database)]
        CACHE[Redis 7<br/>Caching & Sessions]
        DOCSTORAGE[Object Storage<br/>Documents & Artifacts]
        ANALYTICS[(Analytics Database<br/>Telemetry & Metrics)]
    end

    subgraph "Infrastructure & Monitoring"
        MONITORING[Monitoring & Logging<br/>Performance Tracking]
        SECURITY[Security & Compliance<br/>Enterprise Features]
        BACKUP[Backup & Recovery<br/>Data Protection]
    end

    NTBU --> WEB
    TECHBU --> WEB
    COLLABU --> WEB

    WEB --> GATEWAY
    GATEWAY --> LB
    LB --> SCALEENG
    LB --> AGENTORCH
    LB --> PHASEENG
    LB --> ARTIFACTGEN
    LB --> BMADIDE

    SCALEENG --> BMADCORE
    AGENTORCH --> BMADCORE
    PHASEENG --> BMADCORE
    ARTIFACTGEN --> BMADCORE
    BMADIDE --> BMADCORE

    ARTIFACTGEN --> GITHUB
    ARTIFACTGEN --> FIGMA
    ARTIFACTGEN --> SHAREPOINT
    AGENTORCH --> IGNIS
    PHASEENG --> IGNIS

    SCALEENG --> PRIMARYDB
    AGENTORCH --> CACHE
    PHASEENG --> PRIMARYDB
    ARTIFACTGEN --> DOCSTORAGE
    BMADIDE --> PRIMARYDB

    IGNIS --> ANALYTICS
    MONITORING --> ANALYTICS
    SECURITY --> PRIMARYDB
    BACKUP --> DOCSTORAGE
```

#### Full Platform Architecture Diagram Explanation

This comprehensive architecture diagram illustrates the complete BMad v6-powered system structure and intelligent workflow orchestration:

**User Layer:**
- **Non-Technical Stakeholders:** Product managers, business analysts, and GTM teams who leverage BMad v6's scale-adaptive intelligence through familiar web interfaces
- **Technical Stakeholders:** Developers and architects who maintain existing BMad v6 IDE workflows while collaborating through the web platform
- **Collaborative Users:** Cross-functional teams utilizing the platform for complete project lifecycle orchestration with intelligent agent guidance

**Frontend Layer:**
- **React 18+ Web Application:** Modern single-page application with Next.js 14 framework providing server-side rendering and optimized performance
- **Scale-Adaptive UI:** Interface for automatic complexity detection and intelligent track selection (Quick Flow, BMad Method, Brownfield)
- **Intelligent Agent UI:** Context-aware agent selection interface presenting relevant agents from BMad v6's 12-agent ecosystem with progressive engagement
- **4-Phase Workflow UI:** Visual navigation through BMad v6's proven methodology (Analysis → Planning → Solutioning → Implementation)
- **Artifact Generation UI:** Comprehensive template-based document creation interface supporting SDLC, business, compliance, and training documentation

**Core BMad v6 Services:**
- **Scale-Adaptive Intelligence Engine:** Automatic complexity detection, track selection, and seamless workflow transitions based on project evolution
- **Intelligent Agent Orchestration Service:** Context-aware agent selection, progressive engagement, and specialized expertise coordination from the complete 12-agent ecosystem
- **4-Phase Workflow Management Engine:** Complete methodology execution with automatic phase completion detection and stakeholder handoff management
- **Comprehensive Artifact Generation Service:** Template-based document creation following BMad v6 standards with methodology integrity validation
- **BMad v6 IDE Integration Service:** Seamless bidirectional synchronization with existing BMad v6 workflows and development team handoff capabilities

**Integration & External Services:**
- **GitHub Integration:** Repository synchronization, commit management, and seamless handoff to existing BMad v6 IDE workflows
- **Figma Integration:** Design import, specification extraction, and UX Designer agent workflow integration
- **SharePoint Integration:** Enterprise document management with metadata synchronization and approval workflows
- **Ignis Platform:** Comprehensive telemetry capture, real-time data transmission, and analytics integration for ecosystem connectivity
- **BMad v6 Framework:** Direct access to agent definitions, template system, and methodology components

**Data & Storage Layer:**
- **PostgreSQL 15:** Primary database for users, projects, agents, workflows, phases, tracks, artifacts, and comprehensive metadata management
- **Redis 7:** High-performance caching for agent definitions, session management, and performance optimization
- **Object Storage:** Scalable document storage with version control, access management, and CDN integration
- **Analytics Database:** Dedicated storage for telemetry data, user behavior analytics, and performance metrics

**Infrastructure & Monitoring:**
- **Monitoring & Logging:** Comprehensive performance tracking, error monitoring, and system health management
- **Security & Compliance:** Enterprise-grade security features, audit logging, and compliance management
- **Backup & Recovery:** Data protection, disaster recovery, and business continuity planning

**Intelligent Data Flow Patterns:**
1. **Context-Aware User Experience:** Users access scale-adaptive intelligence through intuitive interfaces that present appropriate complexity levels
2. **Intelligent Agent Orchestration:** System analyzes project context and presents relevant agents with progressive engagement as complexity evolves
3. **Methodology-Driven Workflow:** BMad v6's 4-phase structure guides users through proven project execution with automatic completion detection
4. **Seamless Integration:** Bidirectional synchronization maintains workflow continuity between web platform and existing BMad v6 IDE environments
5. **Comprehensive Telemetry:** Real-time data capture and transmission to Ignis Platform for analytics, optimization, and ecosystem connectivity

### Architectural Patterns

- **Microservices Architecture:** Domain-driven service separation optimized for BMad v6 integration - _Rationale:_ Independent deployment and scaling of scale-adaptive intelligence, agent orchestration, 4-phase workflow management, and comprehensive artifact generation services
- **Intelligent Agent Orchestration Pattern:** Context-aware agent selection and progressive engagement - _Rationale:_ Optimize token consumption and user experience by presenting only relevant agents from BMad v6's 12-agent ecosystem based on project context and complexity evolution
- **Scale-Adaptive Intelligence Pattern:** Automatic complexity detection and track selection - _Rationale:_ Provide appropriate workflow depth (Quick Flow, BMad Method, Brownfield) based on project requirements while maintaining BMad v6 methodology integrity
- **4-Phase Workflow Pattern:** Structured methodology execution with automatic progression - _Rationale:_ Ensure comprehensive project coverage through BMad v6's proven Analysis → Planning → Solutioning → Implementation phases with completion detection
- **Repository Pattern:** Abstract data access logic with Node.js ORMs - _Rationale:_ Enables testing and future database migration flexibility for complex BMad v6 metadata, agent configurations, and workflow state management
- **API Gateway Pattern:** Centralized routing and load balancing - _Rationale:_ Centralized auth, rate limiting, monitoring, and versioning for multiple Node.js microservices with multi-region distribution
- **Event-Driven Architecture:** Message queues for async processing - _Rationale:_ Handle long-running artifact generation, agent orchestration, and integration synchronization without blocking user interface
- **CQRS Pattern:** Separate read/write models for complex operations - _Rationale:_ Optimize for complex agent queries, workflow state management, and artifact retrieval while maintaining write performance
- **Saga Pattern:** Orchestrate multi-step BMad v6 workflows - _Rationale:_ Ensure consistency across phase transitions, agent handoffs, artifact generation, and external integrations (GitHub, SharePoint, Ignis Platform)

## Technology Stack Comparison

### POC vs Full Platform Technology Selection

| Category | POC Technology | Full Platform Technology | Rationale |
|----------|----------------|--------------------------|-----------|
| **Frontend Framework** | React 18+ with Next.js 14 | React 18+ with Next.js 14 | Consistent technology for seamless evolution |
| **Backend Language** | Node.js 20+ | Node.js 20+ | JavaScript ecosystem alignment, rapid development |
| **Backend Framework** | Fastify | Fastify with microservices | High-performance scalable architecture with parallel request processing |
| **Database** | PostgreSQL 15 | PostgreSQL 15 with read replicas | Production-grade scaling and performance |
| **Cache** | Redis 7 | Redis 7 with clustering | Enhanced performance and availability |
| **Authentication** | Basic OAuth (GitHub) | Enterprise SSO + OAuth | Security and compliance requirements |
| **Deployment** | Single container/VM | Kubernetes with auto-scaling | Enterprise scalability and reliability |
| **Monitoring** | Basic logging | Comprehensive APM + analytics | Production monitoring and optimization |
| **Integration Scope** | GitHub + SharePoint | Full enterprise integration suite | Complete business tool ecosystem |
| **BMad v6 Integration** | Core agent orchestration | Complete 12-agent ecosystem | Full methodology implementation |

### Shared Technology Foundation

**Core Technologies (Consistent Across Both):**
- **React 18+ with Next.js 14:** Modern frontend framework with server-side rendering, API routes, and optimized performance
- **Node.js 20+:** JavaScript runtime with excellent ecosystem support for BMad v6 integration and rapid development
- **PostgreSQL 15:** Robust relational database with JSON support for complex BMad v6 metadata and workflow state
- **Redis 7:** High-performance caching for agent definitions, session management, and performance optimization
- **TypeScript:** Type safety across frontend and backend for better development experience and code quality

**BMad v6 Integration Technologies:**
- **Agent Definition Loading:** Dynamic loading of BMad v6 agent configurations with context-aware selection
- **Template System Access:** Direct integration with BMad v6 template library for comprehensive artifact generation
- **Workflow Orchestration:** Implementation of BMad v6's 4-phase methodology with automatic progression and completion detection
- **Scale-Adaptive Intelligence:** Complexity detection and track selection (Quick Flow, BMad Method, Brownfield) algorithms

## Cloud Deployment Architecture

### POC Deployment Diagram

```mermaid
graph TB
    subgraph "Internet"
        POCUSERS[POC Users<br/>5-10 Concurrent]
        POCGITHUB[GitHub API]
        POCSHAREPOINT[SharePoint API]
        POCIGNIS[Ignis Platform]
    end

    subgraph "POC Cloud Environment"
        subgraph "Load Balancing"
            POCLB[Load Balancer<br/>Basic Distribution]
        end

        subgraph "Application Layer"
            POCFRONTEND[React/Next.js App<br/>Container/VM Deployment]
            POCAPI[Node.js API Server<br/>Fastify Backend]
        end

        subgraph "BMad v6 Services"
            POCAGENT[Agent Orchestration<br/>Context-Aware Selection]
            POCWORKFLOW[4-Phase Workflow<br/>Management Service]
            POCARTIFACT[Artifact Generation<br/>BMad v6 Templates]
        end

        subgraph "Data Layer"
            POCDB[(PostgreSQL 15<br/>Single Instance)]
            POCREDIS[Redis 7<br/>Basic Caching]
            POCSTORAGE[Object Storage<br/>Document Files]
        end

        subgraph "Monitoring"
            POCLOG[Basic Logging<br/>Application Logs]
            POCMETRICS[Performance Metrics<br/>Response Times]
        end
    end

    POCUSERS --> POCLB
    POCLB --> POCFRONTEND
    POCFRONTEND --> POCAPI
    POCAPI --> POCAGENT
    POCAPI --> POCWORKFLOW
    POCAPI --> POCARTIFACT

    POCAGENT --> POCDB
    POCWORKFLOW --> POCDB
    POCARTIFACT --> POCSTORAGE
    POCAPI --> POCREDIS

    POCARTIFACT --> POCGITHUB
    POCARTIFACT --> POCSHAREPOINT
    POCAGENT --> POCIGNIS

    POCAPI --> POCLOG
    POCFRONTEND --> POCMETRICS
```

### Full Platform Deployment Diagram

```mermaid
graph TB
    subgraph "Internet & External Services"
        USERS[Global Users<br/>500+ MAU]
        GITHUB[GitHub API<br/>Enterprise Integration]
        FIGMA[Figma API<br/>Design Workflows]
        SHAREPOINT[SharePoint API<br/>Document Management]
        CONFLUENCE[Confluence API<br/>Knowledge Base]
        IGNIS[Ignis Platform<br/>Analytics & Telemetry]
        BMADIDE[BMad v6 IDE<br/>Existing Workflows]
    end

    subgraph "Global CDN & Load Balancing"
        CDN[Global CDN<br/>Multi-Region Distribution]
        GLB[Global Load Balancer<br/>Intelligent Routing]
    end

    subgraph "Production Environment - Multi-Region"
        subgraph "Container Orchestration"
            K8S[Kubernetes Cluster<br/>Auto-Scaling & Management]
            INGRESS[Ingress Controller<br/>SSL & Routing]
        end

        subgraph "Frontend Services"
            FRONTEND[React/Next.js Apps<br/>Multiple Replicas]
            STATICASSETS[Static Asset Server<br/>Optimized Delivery]
        end

        subgraph "API Gateway & Auth"
            APIGATEWAY[API Gateway<br/>Rate Limiting & Versioning]
            AUTHSERVICE[Authentication Service<br/>Enterprise SSO + OAuth]
        end

        subgraph "Core BMad v6 Microservices"
            SCALESERVICE[Scale-Adaptive<br/>Intelligence Service]
            AGENTSERVICE[Intelligent Agent<br/>Orchestration Service]
            PHASESERVICE[4-Phase Workflow<br/>Management Service]
            ARTIFACTSERVICE[Comprehensive Artifact<br/>Generation Service]
            BMADINTEGRATION[BMad v6 IDE<br/>Integration Service]
        end

        subgraph "Integration Services"
            GITHUBSERVICE[GitHub Integration<br/>Repository Sync]
            FIGMASERVICE[Figma Integration<br/>Design Import]
            SHAREPOINTSERVICE[SharePoint Integration<br/>Document Management]
            IGNISSERVICE[Ignis Platform<br/>Telemetry Service]
        end

        subgraph "Data Layer - Distributed"
            PRIMARYDB[(PostgreSQL Cluster<br/>Primary + Read Replicas)]
            CACHECLUSTER[Redis Cluster<br/>Distributed Caching]
            OBJECTSTORAGE[Distributed Object Storage<br/>Multi-Region Replication]
            ANALYTICSDB[(Analytics Database<br/>Time-Series Data)]
        end

        subgraph "Message Queue & Events"
            MESSAGEQUEUE[Message Queue<br/>Async Processing]
            EVENTBUS[Event Bus<br/>Service Communication]
        end

        subgraph "Monitoring & Security"
            MONITORING[Comprehensive Monitoring<br/>APM + Metrics]
            LOGGING[Centralized Logging<br/>Log Aggregation]
            SECURITY[Security Services<br/>Compliance & Audit]
            BACKUP[Backup & Recovery<br/>Data Protection]
        end
    end

    USERS --> CDN
    CDN --> GLB
    GLB --> INGRESS
    INGRESS --> FRONTEND
    FRONTEND --> APIGATEWAY
    APIGATEWAY --> AUTHSERVICE

    APIGATEWAY --> SCALESERVICE
    APIGATEWAY --> AGENTSERVICE
    APIGATEWAY --> PHASESERVICE
    APIGATEWAY --> ARTIFACTSERVICE
    APIGATEWAY --> BMADINTEGRATION

    SCALESERVICE --> PRIMARYDB
    AGENTSERVICE --> CACHECLUSTER
    PHASESERVICE --> PRIMARYDB
    ARTIFACTSERVICE --> OBJECTSTORAGE
    BMADINTEGRATION --> PRIMARYDB

    ARTIFACTSERVICE --> GITHUBSERVICE
    ARTIFACTSERVICE --> FIGMASERVICE
    ARTIFACTSERVICE --> SHAREPOINTSERVICE
    AGENTSERVICE --> IGNISSERVICE

    GITHUBSERVICE --> GITHUB
    FIGMASERVICE --> FIGMA
    SHAREPOINTSERVICE --> SHAREPOINT
    IGNISSERVICE --> IGNIS
    BMADINTEGRATION --> BMADIDE

    SCALESERVICE --> MESSAGEQUEUE
    AGENTSERVICE --> EVENTBUS
    IGNISSERVICE --> ANALYTICSDB

    K8S --> MONITORING
    FRONTEND --> LOGGING
    AUTHSERVICE --> SECURITY
    OBJECTSTORAGE --> BACKUP
```

#### Deployment Architecture Explanation

**POC Deployment Architecture:**

The POC deployment focuses on validation with simplified infrastructure supporting 5-10 concurrent users:

**POC Components:**
- **React/Next.js Frontend:** Container-deployed application with BMad v6 agent selection interface and 4-phase workflow navigation
- **Node.js API Server:** Fastify backend handling BMad v6 agent orchestration, workflow management, and artifact generation with parallel request processing
- **BMad v6 Services:** Context-aware agent selection, 4-phase workflow management, and template-based artifact generation
- **Data Layer:** Single PostgreSQL instance with Redis caching for agent definitions and session management
- **External Integrations:** GitHub for repository sync, SharePoint for document management, Ignis Platform for telemetry

**Full Platform Deployment Architecture:**

The production deployment supports enterprise-grade scalability with 500+ monthly active users:

**Global Infrastructure:**
- **CDN & Load Balancing:** Multi-region content delivery with intelligent routing for optimal performance
- **Container Orchestration:** Kubernetes clusters with auto-scaling and management for high availability
- **Frontend Services:** Multiple React/Next.js replicas with static asset optimization and global distribution

**Core BMad v6 Microservices:**
- **Scale-Adaptive Intelligence Service:** Automatic complexity detection and track selection (Quick Flow, BMad Method, Brownfield)
- **Intelligent Agent Orchestration Service:** Context-aware agent selection from 12-agent ecosystem with progressive engagement
- **4-Phase Workflow Management Service:** Complete methodology execution with automatic phase completion detection
- **Comprehensive Artifact Generation Service:** Template-based document creation across SDLC, business, compliance, and training documentation
- **BMad v6 IDE Integration Service:** Seamless bidirectional synchronization with existing BMad v6 workflows

**Integration Services:**
- **GitHub Integration:** Repository synchronization with existing BMad v6 IDE workflows and development team handoff
- **Figma Integration:** Design import and UX Designer agent workflow integration
- **SharePoint Integration:** Enterprise document management with metadata synchronization and approval workflows
- **Ignis Platform Telemetry:** Comprehensive data capture and real-time transmission for analytics and optimization

**Data Architecture:**
- **PostgreSQL Cluster:** Primary database with read replicas for scalability and high availability
- **Redis Cluster:** Distributed caching for agent definitions, session management, and performance optimization
- **Distributed Object Storage:** Multi-region document storage with version control and CDN integration
- **Analytics Database:** Time-series data storage for telemetry, user behavior analytics, and performance metrics

**Enterprise Features:**
- **Comprehensive Monitoring:** Application performance monitoring, distributed tracing, and custom metrics collection
- **Centralized Logging:** Log aggregation, query capabilities, and integration with incident management systems
- **Security & Compliance:** Enterprise-grade security features, audit logging, and compliance management
- **Backup & Recovery:** Data protection, disaster recovery, and business continuity planning

**Intelligent Traffic Flow Patterns:**
1. **Context-Aware User Experience:** Global users access scale-adaptive intelligence through CDN-optimized interfaces
2. **Intelligent Agent Orchestration:** System analyzes project context and presents relevant agents with progressive engagement
3. **BMad v6 Methodology Execution:** 4-phase workflow guides users through proven project execution with automatic completion detection
4. **Seamless Integration:** Bidirectional synchronization maintains workflow continuity between web platform and existing BMad v6 IDE environments
5. **Comprehensive Telemetry:** Real-time data capture and transmission to Ignis Platform for analytics and ecosystem connectivity

### Infrastructure Components

**POC Infrastructure Components:**

**Application Hosting:**
- **React/Next.js Frontend:** Container-based deployment with Node.js 20+ runtime and BMad v6 agent selection interface
- **Node.js API Server:** Fastify backend with BMad v6 agent orchestration and 4-phase workflow management
- **Basic Load Balancing:** Simple distribution for 5-10 concurrent users with health checks

**BMad v6 Services:**
- **Agent Orchestration Service:** Context-aware agent selection from BMad v6 ecosystem with progressive engagement
- **4-Phase Workflow Service:** Complete methodology execution (Configuration, Ideation, Product Definition, Planning)
- **Artifact Generation Service:** Template-based document creation using BMad v6 standards

**Data & Storage:**
- **PostgreSQL 15:** Single instance database for users, projects, agents, workflows, and artifacts
- **Redis 7:** Basic caching for agent definitions, session management, and performance optimization
- **Object Storage:** Document storage with version control and basic access management

**External Integrations:**
- **GitHub Integration:** Repository synchronization with basic commit and branch management
- **SharePoint Integration:** Document upload and metadata management via Microsoft Graph API
- **Ignis Platform Integration:** Real-time telemetry data transmission and validation

**Full Platform Infrastructure Components:**

**Frontend & CDN:**
- **React/Next.js Applications:** Multiple replicas with Next.js 14 framework, server-side rendering, and optimized performance
- **Global CDN:** Multi-region content delivery with intelligent caching and static asset optimization
- **Load Balancers:** Global load balancing with intelligent routing and SSL termination

**Core BMad v6 Microservices:**
- **Scale-Adaptive Intelligence Service:** Automatic complexity detection and track selection with seamless transitions
- **Intelligent Agent Orchestration Service:** Complete 12-agent ecosystem with context-aware selection and progressive engagement
- **4-Phase Workflow Management Service:** Full methodology execution with automatic phase completion detection
- **Comprehensive Artifact Generation Service:** Complete template library supporting SDLC, business, compliance, and training documentation
- **BMad v6 IDE Integration Service:** Seamless bidirectional synchronization with existing BMad v6 workflows

**Enterprise Data Layer:**
- **PostgreSQL Cluster:** Primary database with read replicas, automatic failover, and high availability
- **Redis Cluster:** Distributed caching with clustering, persistence, and high availability
- **Distributed Object Storage:** Multi-region storage with replication, versioning, and CDN integration
- **Analytics Database:** Time-series database for telemetry, metrics, and user behavior analytics

**Integration & Messaging:**
- **Message Queue System:** Distributed message queuing for async processing and service communication
- **Event Bus:** Event-driven architecture for real-time notifications and service coordination
- **API Gateway:** Centralized routing, rate limiting, authentication, and API versioning

**Enterprise Security & Compliance:**
- **Authentication Service:** Enterprise SSO integration with OAuth 2.0 and multi-factor authentication
- **Security Services:** Comprehensive security features, audit logging, and compliance management
- **Secrets Management:** Secure storage and rotation of API keys, certificates, and credentials

**Monitoring & Operations:**
- **Application Performance Monitoring:** Real-time monitoring, distributed tracing, and custom metrics
- **Centralized Logging:** Log aggregation, search capabilities, and integration with alerting systems
- **Backup & Recovery:** Automated backups, disaster recovery, and business continuity planning

## Tech Stack

This is the DEFINITIVE technology selection for both POC and full platform implementations:

### Cloud Infrastructure
- **Provider:** Cloud-agnostic with multi-cloud support (AWS/Azure/GCP based on team expertise and requirements)
- **POC Services:** Container deployment, managed PostgreSQL, Redis, object storage, basic monitoring
- **Full Platform Services:** Kubernetes orchestration, distributed databases, CDN, comprehensive monitoring, enterprise security
- **Deployment Strategy:** POC single-region, Full Platform multi-region with global distribution

### Technology Stack Table
**Last Updated:** 2025-11-21
**Version Verification:** All versions verified for compatibility and currency

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Framework** | React | 18.2.0 | Modern UI framework | Component-based architecture, excellent ecosystem, BMad v6 agent interface support |
| **Frontend Meta-Framework** | Next.js | 14.2.5 | Full-stack React framework | Server-side rendering, API routes, optimized performance, production-ready |
| **Frontend Styling** | TailwindCSS | 3.4.4 | Utility-first CSS framework | Rapid UI development, consistent design system, matches existing POC design |
| **Backend Language** | Node.js | 20.17.0 LTS | JavaScript runtime | Unified language stack, excellent ecosystem, rapid development for BMad v6 integration |
| **Backend Framework** | Fastify | 4.28.1 | High-performance web framework | Faster than Express.js with parallel request processing, better TypeScript support, performance optimization for BMad v6 workflows |
| **Database** | PostgreSQL | 15.8 | Primary relational database | JSON support for BMad v6 metadata, ACID compliance, excellent performance |
| **Cache** | Redis | 7.2.5 | In-memory data store | Agent definition caching, session management, performance optimization |
| **Authentication** | EntraID/Azure AD + JWT | OAuth 2.0 | Enterprise authentication | Session-less JWT architecture, enterprise SSO support, secure token-based access |
| **ORM/Query Builder** | Prisma | 5.18.0 | Database abstraction layer | Type-safe database operations, migrations, excellent TypeScript support, superior developer experience |
| **BMad v6 Integration** | Direct Framework Access | 6.0.0-alpha.12 | Agent orchestration & templates | Context-aware agent loading, template system access, methodology preservation |
| **Document Processing** | Marked + Turndown | 12.0.2 + 7.2.0 | Artifact generation engine | BMad v6 template processing, multi-format support, content fidelity |
| **Message Queue** | Redis Pub/Sub | 7.2.5 | Async processing | Background jobs, agent orchestration, integration synchronization |
| **API Documentation** | Swagger/OpenAPI | 3.1.0 | Interactive API documentation | Auto-generated docs, testing interface, developer experience |
| **Testing Framework** | Jest + React Testing Library | 29.7.0 + 15.0.7 | Unit and integration testing | Comprehensive testing for React and Node.js, BMad v6 workflow validation |
| **Code Quality** | ESLint + Prettier + TypeScript | 8.57.0 + 3.3.2 + 5.5.4 | Code quality and type safety | Consistent code style, static type checking, better developer experience |
| **Package Management** | pnpm workspaces | 9.9.0 | Monorepo management | Faster than npm/yarn, workspace organization, dependency management, build optimization |
| **Container Runtime** | Docker | 27.2.0 | Containerization | Consistent deployment, development environment parity |
| **Container Orchestration** | Kubernetes | 1.31.0 | Container management | Auto-scaling, service discovery, rolling deployments, high availability |
| **CI/CD** | GitHub Actions | Latest | Automated testing and deployment | Integrated workflows, multi-environment deployments, BMad v6 validation |
| **Monitoring** | OpenTelemetry Protocol (OTLP) | 1.25.1 | Performance and error tracking | Real-time monitoring, distributed tracing, BMad v6 workflow metrics, configurable destinations |
| **Logging** | Winston + Pino | 3.14.2 + 9.3.2 | Centralized logging | Structured logging, log aggregation, search capabilities, troubleshooting support |
| **Telemetry Integration** | Ignis Platform SDK | Latest | Analytics and telemetry | Real-time data transmission, user behavior analytics, ecosystem connectivity |

## Data Models

Based on the PRD requirements for BMad v6 scale-adaptive intelligence, intelligent agent orchestration, 4-phase workflow management, and comprehensive artifact generation, here are the core data models optimized for both POC and full platform implementations:

### User Model

**Purpose:** Represents platform users with GitHub OAuth authentication and BMad v6 workflow access

```typescript
// User entity for BMad v6-powered platform
interface User {
  id: string;                    // UUID primary key
  githubId: string;             // GitHub user ID for OAuth
  email: string;                // User email from GitHub
  name: string;                 // Display name
  avatarUrl?: string;           // GitHub avatar URL
  role: UserRole;               // Platform role
  preferences: UserPreferences; // BMad v6 workflow preferences
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  ADMIN = "admin",              // Platform administrator
  PROJECT_MANAGER = "project_manager",  // Can create and manage projects
  STAKEHOLDER = "stakeholder",  // Can participate in workflows
  VIEWER = "viewer"             // Read-only access
}

interface UserPreferences {
  preferredTrack?: BMadTrack;   // Default track preference
  favoriteAgents: string[];     // Preferred agent IDs
  notificationSettings: NotificationSettings;
  uiPreferences: UIPreferences;
}

### Project Model

**Purpose:** BMad v6 project container with scale-adaptive intelligence and 4-phase workflow management

```typescript
interface Project {
  id: string;                           // UUID primary key
  name: string;                         // Project name
  description?: string;                 // Project description
  ownerId: string;                      // User ID of project owner
  status: ProjectStatus;                // Current project status

  // BMad v6 Scale-Adaptive Intelligence
  selectedTrack: BMadTrack;             // Current track (Quick Flow, BMad Method, Brownfield)
  complexityScore: number;              // Automatic complexity assessment (0-100)
  trackHistory: TrackTransition[];      // Track change history

  // 4-Phase Workflow State
  currentPhase: BMadPhase;              // Current phase in workflow
  phaseProgress: PhaseProgress[];       // Progress tracking for each phase
  completedPhases: BMadPhase[];         // Successfully completed phases

  // Integration Configuration
  githubConfig?: GitHubIntegration;     // GitHub repository configuration
  sharepointConfig?: SharePointIntegration; // SharePoint document management
  figmaConfig?: FigmaIntegration;       // Figma design integration
  ignisConfig: IgnisIntegration;        // Ignis Platform telemetry

  // Agent Orchestration
  activeAgents: string[];               // Currently engaged agent IDs
  agentHistory: AgentEngagement[];      // Agent interaction history
  contextData: ProjectContext;          // Context for agent selection

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

enum ProjectStatus {
  DRAFT = "draft",                      // Initial project setup
  ACTIVE = "active",                    // Active development
  ON_HOLD = "on_hold",                  // Temporarily paused
  COMPLETED = "completed",              // Project finished
  ARCHIVED = "archived"                 // Archived project
}

enum BMadTrack {
  QUICK_FLOW = "quick_flow",            // Rapid prototyping track
  BMAD_METHOD = "bmad_method",          // Full methodology track
  BROWNFIELD = "brownfield"             // Existing system enhancement
}

enum BMadPhase {
  ANALYSIS = "analysis",                // Optional brainstorming and research
  PLANNING = "planning",                // Required PRD and tech-spec creation
  SOLUTIONING = "solutioning",          // Architecture, security, DevOps
  IMPLEMENTATION = "implementation"     // Story-centric development
}

interface PhaseProgress {
  phase: BMadPhase;
  status: PhaseStatus;
  completionPercentage: number;
  requiredArtifacts: string[];          // Required artifact types
  completedArtifacts: string[];        // Completed artifact IDs
  estimatedHours?: number;
  actualHours?: number;
  startedAt?: Date;
  completedAt?: Date;
}

enum PhaseStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  COMPLETED = "completed",
  BLOCKED = "blocked"
}

### Agent Model

**Purpose:** BMad v6 intelligent agent definitions and orchestration state

```typescript
interface Agent {
  id: string;                           // Agent identifier
  name: string;                         // Agent name (e.g., "Mary", "Winston")
  title: string;                        // Agent title (e.g., "Business Analyst", "Architect")
  icon: string;                         // Agent icon/emoji
  specialization: AgentSpecialization;  // Primary expertise area
  capabilities: AgentCapability[];      // List of agent capabilities
  contextRequirements: ContextRequirement[]; // Context needed for optimal performance

  // Agent Configuration
  promptTemplates: PromptTemplate[];    // Agent-specific prompt templates
  workflowPatterns: WorkflowPattern[];  // Preferred workflow patterns
  outputFormats: string[];              // Supported output formats

  // Performance Metrics
  averageResponseTime: number;          // Average response time in seconds
  tokenConsumption: TokenMetrics;       // Token usage statistics
  successRate: number;                  // Task completion success rate

  // Metadata
  version: string;                      // Agent version
  lastUpdated: Date;
  isActive: boolean;
}

enum AgentSpecialization {
  BUSINESS_ANALYSIS = "business_analysis",
  PROJECT_MANAGEMENT = "project_management",
  ARCHITECTURE = "architecture",
  UX_DESIGN = "ux_design",
  DEVELOPMENT = "development",
  TESTING = "testing",
  DEVOPS = "devops",
  SECURITY = "security",
  DATA_ANALYSIS = "data_analysis",
  TECHNICAL_WRITING = "technical_writing",
  PRODUCT_STRATEGY = "product_strategy",
  MARKET_RESEARCH = "market_research"
}

interface AgentEngagement {
  id: string;
  projectId: string;
  agentId: string;
  phase: BMadPhase;
  startedAt: Date;
  endedAt?: Date;
  context: EngagementContext;
  artifacts: string[];                  // Generated artifact IDs
  tokenConsumption: number;
  performanceMetrics: PerformanceMetrics;
}

### Artifact Model

**Purpose:** BMad v6 comprehensive artifact management with template-based generation

```typescript
interface Artifact {
  id: string;                           // UUID primary key
  projectId: string;                    // Associated project
  name: string;                         // Artifact name
  type: ArtifactType;                   // Artifact classification
  category: ArtifactCategory;           // Artifact category
  phase: BMadPhase;                     // Associated BMad phase

  // Content Management
  content: string;                      // Markdown content
  templateId?: string;                  // BMad v6 template used
  version: number;                      // Version number
  status: ArtifactStatus;               // Current status

  // Generation Metadata
  generatedBy: string;                  // Agent ID that generated artifact
  generationContext: GenerationContext; // Context used for generation
  qualityScore: number;                 // Quality assessment (0-100)
  completenessScore: number;            // Completeness assessment (0-100)

  // Collaboration
  reviewers: string[];                  // User IDs of reviewers
  approvers: string[];                  // User IDs of approvers
  comments: Comment[];                  // Review comments

  // Integration
  githubPath?: string;                  // GitHub file path
  sharepointUrl?: string;               // SharePoint document URL
  figmaFileId?: string;                 // Figma file reference

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt?: Date;
  approvedAt?: Date;
}

enum ArtifactType {
  // SDLC Documents
  PROJECT_BRIEF = "project_brief",
  PRD = "prd",
  TECHNICAL_SPECIFICATION = "technical_specification",
  ARCHITECTURE_DOCUMENT = "architecture_document",
  USER_STORIES = "user_stories",
  TEST_PLAN = "test_plan",
  DEPLOYMENT_GUIDE = "deployment_guide",

  // Business Documents
  MARKET_RESEARCH = "market_research",
  BUSINESS_CASE = "business_case",
  COMPETITIVE_ANALYSIS = "competitive_analysis",
  STAKEHOLDER_ANALYSIS = "stakeholder_analysis",

  // Compliance Documents
  SECURITY_ASSESSMENT = "security_assessment",
  PRIVACY_IMPACT_ASSESSMENT = "privacy_impact_assessment",
  COMPLIANCE_CHECKLIST = "compliance_checklist",

  // Training Documents
  USER_MANUAL = "user_manual",
  TRAINING_GUIDE = "training_guide",
  API_DOCUMENTATION = "api_documentation"
}

enum ArtifactCategory {
  SDLC = "sdlc",
  BUSINESS = "business",
  COMPLIANCE = "compliance",
  TRAINING = "training"
}

enum ArtifactStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}
### Workflow Model

**Purpose:** BMad v6 workflow execution state and transition management

```typescript
interface Workflow {
  id: string;                           // UUID primary key
  projectId: string;                    // Associated project
  track: BMadTrack;                     // Current track
  currentPhase: BMadPhase;              // Current phase

  // Phase Management
  phases: WorkflowPhase[];              // Phase definitions and progress
  transitions: PhaseTransition[];       // Phase transition history

  // Agent Orchestration
  activeAgents: AgentAssignment[];      // Currently active agents
  agentHistory: AgentEngagement[];      // Complete agent interaction history

  // Workflow State
  status: WorkflowStatus;               // Overall workflow status
  completionPercentage: number;         // Overall completion (0-100)
  estimatedCompletionDate?: Date;       // Projected completion

  // Performance Metrics
  startedAt: Date;
  lastActivityAt: Date;
  totalHours: number;
  tokenConsumption: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowPhase {
  phase: BMadPhase;
  status: PhaseStatus;
  requiredArtifacts: ArtifactRequirement[];
  completedArtifacts: string[];         // Artifact IDs
  assignedAgents: string[];             // Agent IDs
  estimatedHours: number;
  actualHours: number;
  startedAt?: Date;
  completedAt?: Date;
  blockers: Blocker[];
}

interface PhaseTransition {
  id: string;
  fromPhase?: BMadPhase;                // null for initial phase
  toPhase: BMadPhase;
  triggeredBy: TransitionTrigger;
  triggeredAt: Date;
  triggeredByUser?: string;             // User ID if manual
  completionCriteria: CompletionCriteria[];
  artifacts: string[];                  // Artifacts that triggered transition
}

enum WorkflowStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

enum TransitionTrigger {
  AUTOMATIC = "automatic",              // Triggered by completion criteria
  MANUAL = "manual",                    // Triggered by user
  AGENT_RECOMMENDATION = "agent_recommendation"
}

### Integration Model

**Purpose:** External system integration configuration and status

```typescript
interface Integration {
  id: string;
  projectId: string;
  type: IntegrationType;
  name: string;
  configuration: IntegrationConfig;
  status: IntegrationStatus;

  // Sync State
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncFrequency: SyncFrequency;

  // Error Handling
  lastError?: IntegrationError;
  retryCount: number;
  maxRetries: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

enum IntegrationType {
  GITHUB = "github",
  SHAREPOINT = "sharepoint",
  FIGMA = "figma",
  IGNIS_PLATFORM = "ignis_platform",
  BMAD_IDE = "bmad_ide"
}

interface GitHubIntegration extends IntegrationConfig {
  repositoryUrl: string;
  branch: string;
  accessToken: string;                  // Encrypted
  webhookUrl?: string;
  syncPaths: SyncPath[];
}

interface SharePointIntegration extends IntegrationConfig {
  siteUrl: string;
  libraryName: string;
  accessToken: string;                  // Encrypted
  folderStructure: FolderMapping[];
}

interface IgnisIntegration extends IntegrationConfig {
  endpoint: string;
  apiKey: string;                       // Encrypted
  telemetryTypes: TelemetryType[];
  batchSize: number;
  transmissionInterval: number;         // seconds
}

## API Specification

Based on Node.js/Fastify framework selected in the Tech Stack, here's the comprehensive REST API specification for the BMad v6-powered platform:

### Fastify Application Structure

```typescript
import Fastify from 'fastify';
import { authenticate, authorize } from '../plugins/auth';
import { validateRequest } from '../plugins/validation';
import { BMadTrack, BMadPhase, AgentSpecialization } from '../types';

const fastify = Fastify({
  logger: true,
  trustProxy: true,
});

// Register plugins
await fastify.register(import('@fastify/jwt'), {
  secret: process.env.JWT_SECRET!
});
await fastify.register(authenticate);
await fastify.register(import('./routes/projects'), { prefix: '/api/v1' });
await fastify.register(import('./routes/agents'), { prefix: '/api/v1' });
await fastify.register(import('./routes/artifacts'), { prefix: '/api/v1' });
await fastify.register(import('./routes/workflows'), { prefix: '/api/v1' });

// OpenAPI/Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BMad v6-Powered SDLC Platform API',
      version: '1.0.0',
      description: 'Scale-adaptive intelligence and intelligent agent orchestration platform'
    }
  },
  apis: ['./routes/*.ts']
};
```

### Core API Endpoints

**BMad v6 Scale-Adaptive Intelligence Endpoints:**

```typescript
// Project and Track Management
interface CreateProjectRequest {
  name: string;
  description?: string;
  githubRepoUrl?: string;
  initialComplexity?: number;
  preferredTrack?: BMadTrack;
}

interface ProjectResponse {
  id: string;
  name: string;
  selectedTrack: BMadTrack;
  currentPhase: BMadPhase;
  complexityScore: number;
  phaseProgress: PhaseProgress[];
  activeAgents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/v1/projects
router.post('/projects', validateRequest(CreateProjectRequest), async (req, res) => {
  /**
   * Create new BMad v6 project with scale-adaptive intelligence
   * - Analyze initial complexity
   * - Select appropriate track (Quick Flow, BMad Method, Brownfield)
   * - Initialize 4-phase workflow
   * - Recommend initial agents
   */
  const project = await projectService.createProject(req.body, req.user);
  res.status(201).json(project);
});

// GET /api/v1/projects/{projectId}/track-analysis
router.get('/projects/:projectId/track-analysis', async (req, res) => {
  /**
   * Get scale-adaptive intelligence analysis
   * - Current complexity assessment
   * - Track recommendation rationale
   * - Potential track transitions
   */
  const analysis = await scaleAdaptiveService.analyzeProject(req.params.projectId);
  res.json(analysis);
});

// PUT /api/v1/projects/{projectId}/track
router.put('/projects/:projectId/track', async (req, res) => {
  /**
   * Transition project track based on complexity evolution
   * - Validate transition criteria
   * - Update workflow requirements
   * - Adjust agent recommendations
   */
  const { newTrack, reason } = req.body;
  const result = await scaleAdaptiveService.transitionTrack(
    req.params.projectId,
    newTrack,
    reason
  );
  res.json(result);
});
```

**Intelligent Agent Orchestration Endpoints:**

```typescript
interface AgentSelectionRequest {
  projectId: string;
  phase: BMadPhase;
  context?: ProjectContext;
  maxAgents?: number;
}

interface AgentRecommendationResponse {
  recommendedAgents: AgentRecommendation[];
  rationale: string;
  contextAnalysis: ContextAnalysis;
  progressiveEngagementPlan: EngagementPlan;
}

// GET /api/v1/projects/{projectId}/agent-recommendations
router.get('/projects/:projectId/agent-recommendations', async (req, res) => {
  /**
   * Get context-aware agent recommendations
   * - Analyze project context and current phase
   * - Recommend 2-3 most relevant agents initially
   * - Provide progressive engagement plan
   */
  const recommendations = await agentOrchestrationService.getRecommendations(
    req.params.projectId,
    req.query
  );
  res.json(recommendations);
});

// POST /api/v1/projects/{projectId}/agents/{agentId}/engage
router.post('/projects/:projectId/agents/:agentId/engage', async (req, res) => {
  /**
   * Engage specific agent for project phase
   * - Load agent context and capabilities
   * - Initialize agent-specific workflow
   * - Track engagement metrics
   */
  const engagement = await agentOrchestrationService.engageAgent(
    req.params.projectId,
    req.params.agentId,
    req.body.context
  );
  res.json(engagement);
});

// GET /api/v1/agents/{agentId}/performance
router.get('/agents/:agentId/performance', async (req, res) => {
  /**
   * Get agent performance metrics
   * - Token consumption statistics
   * - Response time analytics
   * - Success rate metrics
   */
  const metrics = await agentService.getPerformanceMetrics(req.params.agentId);
  res.json(metrics);
});
```

**4-Phase Workflow Management Endpoints:**

```typescript
interface PhaseTransitionRequest {
  projectId: string;
  fromPhase?: BMadPhase;
  toPhase: BMadPhase;
  completionCriteria: CompletionCriteria[];
  artifacts: string[];
}

// GET /api/v1/projects/{projectId}/workflow
router.get('/projects/:projectId/workflow', async (req, res) => {
  /**
   * Get complete workflow state
   * - Current phase and progress
   * - Phase completion criteria
   * - Required and completed artifacts
   * - Next phase requirements
   */
  const workflow = await workflowService.getWorkflowState(req.params.projectId);
  res.json(workflow);
});

// POST /api/v1/projects/{projectId}/phases/transition
router.post('/projects/:projectId/phases/transition', async (req, res) => {
  /**
   * Transition to next phase
   * - Validate completion criteria
   * - Update agent recommendations
   * - Initialize next phase requirements
   */
  const transition = await workflowService.transitionPhase(
    req.params.projectId,
    req.body
  );
  res.json(transition);
});

// GET /api/v1/projects/{projectId}/phases/{phase}/requirements
router.get('/projects/:projectId/phases/:phase/requirements', async (req, res) => {
  /**
   * Get phase-specific requirements
   * - Required artifact types
   * - Recommended agents
   * - Completion criteria
   * - Estimated timeline
   */
  const requirements = await workflowService.getPhaseRequirements(
    req.params.projectId,
    req.params.phase
  );
  res.json(requirements);
});
```
**Comprehensive Artifact Generation Endpoints:**

```typescript
interface ArtifactGenerationRequest {
  projectId: string;
  type: ArtifactType;
  templateId?: string;
  context: GenerationContext;
  agentId: string;
  phase: BMadPhase;
}

interface ArtifactResponse {
  id: string;
  name: string;
  type: ArtifactType;
  category: ArtifactCategory;
  content: string;
  status: ArtifactStatus;
  qualityScore: number;
  completenessScore: number;
  generatedBy: string;
  createdAt: Date;
}

// POST /api/v1/projects/{projectId}/artifacts/generate
router.post('/projects/:projectId/artifacts/generate', async (req, res) => {
  /**
   * Generate comprehensive artifacts using BMad v6 templates
   * - SDLC documents (PRD, architecture, user stories, test plans)
   * - Business documents (market research, business cases, presentations)
   * - Compliance documentation (security assessments, privacy impact)
   * - Training materials (user manuals, API documentation)
   */
  const artifact = await artifactService.generateArtifact(
    req.params.projectId,
    req.body
  );
  res.status(201).json(artifact);
});

// GET /api/v1/projects/{projectId}/artifacts
router.get('/projects/:projectId/artifacts', async (req, res) => {
  /**
   * Get all project artifacts with filtering
   * - Filter by type, category, phase, status
   * - Include quality and completeness scores
   * - Support pagination and sorting
   */
  const artifacts = await artifactService.getProjectArtifacts(
    req.params.projectId,
    req.query
  );
  res.json(artifacts);
});

// PUT /api/v1/artifacts/{artifactId}/content
router.put('/artifacts/:artifactId/content', async (req, res) => {
  /**
   * Update artifact content with version control
   * - Maintain BMad v6 template structure
   * - Validate methodology compliance
   * - Track changes and reviewers
   */
  const { content, comment } = req.body;
  const updatedArtifact = await artifactService.updateContent(
    req.params.artifactId,
    content,
    comment,
    req.user
  );
  res.json(updatedArtifact);
});

// GET /api/v1/templates
router.get('/templates', async (req, res) => {
  /**
   * Get BMad v6 template library
   * - Filter by phase, track, artifact type
   * - Include template metadata and structure
   * - Support search and categorization
   */
  const templates = await templateService.getTemplates(req.query);
  res.json(templates);
});
```

**Strategic Integration Endpoints:**

```typescript
interface IntegrationConfigRequest {
  type: IntegrationType;
  configuration: IntegrationConfig;
  syncFrequency: SyncFrequency;
}

// POST /api/v1/projects/{projectId}/integrations
router.post('/projects/:projectId/integrations', async (req, res) => {
  /**
   * Configure project integrations
   * - GitHub repository synchronization
   * - SharePoint document management
   * - Figma design workflows
   * - Ignis Platform telemetry
   */
  const integration = await integrationService.configureIntegration(
    req.params.projectId,
    req.body
  );
  res.status(201).json(integration);
});

// POST /api/v1/projects/{projectId}/sync/github
router.post('/projects/:projectId/sync/github', async (req, res) => {
  /**
   * Sync artifacts with GitHub repository
   * - Bidirectional synchronization
   * - Maintain BMad v6 IDE workflow compatibility
   * - Handle merge conflicts and version control
   */
  const syncResult = await githubService.syncProject(
    req.params.projectId,
    req.body
  );
  res.json(syncResult);
});

// POST /api/v1/projects/{projectId}/sync/sharepoint
router.post('/projects/:projectId/sync/sharepoint', async (req, res) => {
  /**
   * Sync artifacts with SharePoint
   * - Enterprise document management
   * - Metadata synchronization
   * - Approval workflow integration
   */
  const syncResult = await sharepointService.syncProject(
    req.params.projectId,
    req.body
  );
  res.json(syncResult);
});

// POST /api/v1/telemetry/ignis
router.post('/telemetry/ignis', async (req, res) => {
  /**
   * Send telemetry data to Ignis Platform
   * - User behavior analytics
   * - Workflow performance metrics
   * - Agent utilization statistics
   * - System performance data
   */
  const result = await ignisService.sendTelemetry(req.body);
  res.json(result);
});
```

## Components

Based on the BMad v6-powered architectural patterns, tech stack, and data models, here are the major logical components:

### Frontend Application (React/Next.js)

**Responsibility:** Modern React-based web application providing BMad v6 scale-adaptive intelligence interfaces, intelligent agent orchestration, 4-phase workflow navigation, and comprehensive artifact management

**Key Interfaces:**
- Scale-Adaptive Intelligence UI for automatic complexity detection and track selection
- Intelligent Agent Selection Interface with context-aware recommendations and progressive engagement
- 4-Phase Workflow Navigator with visual progress tracking and automatic completion detection
- Comprehensive Artifact Generation Interface supporting SDLC, business, compliance, and training documentation
- Real-time collaboration features with WebSocket connections and live updates

**Dependencies:** API Gateway, BMad v6 Core Services, Authentication Service, CDN for static assets

**Technology Stack:** React 18+, Next.js 14, TypeScript, TailwindCSS, WebSocket client, OAuth 2.0 client libraries

### Scale-Adaptive Intelligence Service (Node.js Microservice)

**Responsibility:** BMad v6's core intelligence engine providing automatic complexity detection, track selection (Quick Flow, BMad Method, Brownfield), and seamless track transitions based on project evolution

**Key Interfaces:**
- Project complexity analysis API with scoring algorithms and track recommendations
- Track transition management with validation criteria and workflow adjustments
- Performance optimization with track-specific workflow configurations
- Integration with agent orchestration for track-appropriate agent recommendations

**Dependencies:** PostgreSQL for project data, Redis for caching, BMad v6 Framework components

**Technology Stack:** Node.js 20+, Fastify, TypeScript, machine learning libraries for complexity analysis

### Intelligent Agent Orchestration Service (Node.js Microservice)

**Responsibility:** Context-aware agent selection from BMad v6's 12-agent ecosystem, progressive engagement management, and specialized expertise coordination

**Key Interfaces:**
- Agent recommendation API with context analysis and relevance scoring
- Agent engagement management with performance tracking and token optimization
- Progressive engagement logic presenting 2-3 relevant agents initially with dynamic expansion
- Agent performance analytics with response times, success rates, and token consumption metrics

**Dependencies:** Redis for agent definition caching, PostgreSQL for engagement history, BMad v6 agent definitions

**Technology Stack:** Node.js 20+, Fastify, TypeScript, Redis for caching, agent-specific prompt management

### 4-Phase Workflow Management Service (Node.js Microservice)

**Responsibility:** Complete BMad v6 methodology execution through Analysis → Planning → Solutioning → Implementation phases with automatic progression and completion detection

**Key Interfaces:**
- Workflow state management API with phase tracking and progress monitoring
- Phase transition logic with completion criteria validation and stakeholder notifications
- Artifact requirement management with phase-specific templates and quality validation
- Integration with agent orchestration for phase-appropriate agent recommendations

**Dependencies:** PostgreSQL for workflow state, Message Queue for async processing, Artifact Generation Service

**Technology Stack:** Node.js 20+, Fastify, TypeScript, workflow orchestration libraries

### Comprehensive Artifact Generation Service (Node.js Microservice)

**Responsibility:** Template-based artifact creation using BMad v6 standards, supporting SDLC documents, business artifacts, compliance documentation, and training materials

**Key Interfaces:**
- Artifact generation API with BMad v6 template processing and content creation
- Template library management with phase-appropriate recommendations and customization
- Quality assessment with completeness scoring and methodology compliance validation
- Version control and collaboration features with review workflows and approval tracking

**Dependencies:** Object Storage for artifacts, PostgreSQL for metadata, BMad v6 template system

**Technology Stack:** Node.js 20+, Fastify, TypeScript, markdown processing libraries, template engines

### BMad v6 IDE Integration Service (Node.js Microservice)

**Responsibility:** Seamless bidirectional synchronization with existing BMad v6 IDE workflows, maintaining workflow continuity and enabling smooth handoff to development teams

**Key Interfaces:**
- Bidirectional synchronization API with conflict resolution and merge management
- Workflow handoff management with development team notifications and artifact preparation
- Integration validation with BMad v6 IDE compatibility verification
- Performance monitoring with sync status tracking and error handling

**Dependencies:** GitHub Integration Service, PostgreSQL for sync state, BMad v6 Framework components

**Technology Stack:** Node.js 20+, Fastify, TypeScript, Git libraries, BMad v6 integration components

### GitHub Integration Service (Node.js Microservice)

**Responsibility:** Bidirectional synchronization with GitHub repositories, maintaining BMad v6 IDE workflow compatibility and seamless development team handoff

**Key Interfaces:**
- GitHub OAuth integration with repository access and webhook management
- BMad v6 artifact synchronization with markdown format preservation and metadata handling
- Conflict resolution with three-way merge and version control integration
- Development team handoff with automated PR creation and workflow notifications

**Dependencies:** GitHub API, BMad v6 IDE Integration Service, Artifact Generation Service, Secrets Management

**Technology Stack:** Node.js 20+, Fastify, TypeScript, Octokit (GitHub API client), Git libraries

### SharePoint Integration Service (Node.js Microservice)

**Responsibility:** Enterprise document management integration with metadata synchronization and approval workflow support

**Key Interfaces:**
- Microsoft Graph API integration for SharePoint document libraries
- Enterprise metadata synchronization with taxonomy alignment and governance compliance
- Approval workflow integration with stakeholder notifications and audit trails
- Document versioning with SharePoint version control and access management

**Dependencies:** Microsoft Graph API, Artifact Generation Service, Authentication Service

**Technology Stack:** Node.js 20+, Fastify, TypeScript, Microsoft Graph SDK, OAuth 2.0 client

### Ignis Platform Telemetry Service (Node.js Microservice)

**Responsibility:** Comprehensive telemetry capture and real-time transmission to Ignis Platform for analytics, optimization, and ecosystem connectivity

**Key Interfaces:**
- Real-time telemetry collection with user behavior analytics and workflow performance metrics
- Agent utilization tracking with token consumption monitoring and performance optimization
- System performance monitoring with response times, error rates, and resource utilization
- Batch transmission with data integrity validation and retry mechanisms

**Dependencies:** Ignis Platform API, Analytics Database, Message Queue for batching

**Technology Stack:** Node.js 20+, Fastify, TypeScript, analytics libraries, time-series data processing

## BMad v6 Real-Time Architecture

### WebSocket vs Server-Sent Events for BMad v6

**Why WebSocket for BMad v6:**
- **Bidirectional Communication:** Essential for agent interactions and real-time workflow updates
- **Low Latency:** Critical for responsive agent orchestration and phase transitions
- **Persistent Connections:** Optimal for continuous workflow monitoring and progress updates
- **Rich Protocol Support:** Enables complex agent communication patterns and context sharing

**BMad v6 Real-Time Workflow Flow:**

```mermaid
graph TB
    subgraph "BMad v6 Real-Time Workflow Orchestration"
        USER[User<br/>Project Orchestrator]
        AGENT[Intelligent Agent<br/>Context-Aware Selection]
        WORKFLOW[4-Phase Workflow<br/>Management Engine]
        ARTIFACTS[Artifact Generation<br/>Real-time Updates]
        INTEGRATIONS[External Integrations<br/>GitHub, SharePoint, Ignis]
    end

    subgraph "Real-Time Communication Layer"
        WS[WebSocket Server<br/>Node.js/Socket.io]
        REDIS[Redis Pub/Sub<br/>Message Broadcasting]
        QUEUE[Message Queue<br/>Async Processing]
    end

    USER -->|Agent Selection| WS
    WS -->|Context Analysis| AGENT
    AGENT -->|Workflow Update| WORKFLOW
    WORKFLOW -->|Artifact Request| ARTIFACTS
    ARTIFACTS -->|Integration Sync| INTEGRATIONS

    AGENT -->|Progress Update| REDIS
    WORKFLOW -->|Phase Transition| REDIS
    ARTIFACTS -->|Generation Complete| REDIS
    INTEGRATIONS -->|Sync Status| REDIS

    REDIS -->|Broadcast Updates| WS
    WS -->|Real-time Updates| USER

    WORKFLOW -->|Async Tasks| QUEUE
    ARTIFACTS -->|Background Processing| QUEUE
    INTEGRATIONS -->|Batch Operations| QUEUE
```

## Security Architecture

### BMad v6 Security Framework

The BMad v6-powered platform implements comprehensive security measures across all layers, ensuring enterprise-grade protection for sensitive project data, agent interactions, and external integrations.

### Authentication & Authorization

**OAuth 2.0 + JWT Implementation:**
- **GitHub OAuth Integration:** Primary authentication method with GitHub account linking
- **Enterprise SSO Support:** SAML 2.0 and OpenID Connect for enterprise identity providers
- **JWT Token Management:** Stateless authentication with secure token refresh and revocation
- **Multi-Factor Authentication:** Optional MFA for enhanced security in enterprise environments

**Role-Based Access Control (RBAC):**
```typescript
enum UserRole {
  ADMIN = "admin",                    // Platform administration
  PROJECT_MANAGER = "project_manager", // Project creation and management
  STAKEHOLDER = "stakeholder",        // Workflow participation
  VIEWER = "viewer"                   // Read-only access
}

interface Permission {
  resource: string;                   // Project, artifact, agent, workflow
  action: string;                     // create, read, update, delete, execute
  conditions?: AccessCondition[];     // Context-based access rules
}
```

**Project-Level Security:**
- **Project Ownership:** Clear ownership model with delegation capabilities
- **Team Member Permissions:** Granular permissions for project collaboration
- **Artifact-Level Access:** Fine-grained control over sensitive documents
- **Agent Access Control:** Restrictions on agent engagement based on user roles

### Data Protection

**Encryption at Rest:**
- **Database Encryption:** PostgreSQL transparent data encryption (TDE) for all sensitive data
- **Object Storage Encryption:** AES-256 encryption for all stored artifacts and documents
- **Secrets Management:** Dedicated secrets management service for API keys and credentials
- **Key Rotation:** Automated key rotation policies for enhanced security

**Encryption in Transit:**
- **TLS 1.3:** All API communications encrypted with modern TLS protocols
- **Certificate Management:** Automated certificate provisioning and renewal
- **API Gateway Security:** Centralized SSL termination and security policy enforcement
- **WebSocket Security:** Secure WebSocket connections (WSS) for real-time communications

**Data Classification:**
```typescript
enum DataClassification {
  PUBLIC = "public",                  // Publicly shareable information
  INTERNAL = "internal",              // Internal project information
  CONFIDENTIAL = "confidential",      // Sensitive business information
  RESTRICTED = "restricted"           // Highly sensitive or regulated data
}

interface DataProtectionPolicy {
  classification: DataClassification;
  encryptionRequired: boolean;
  accessLogging: boolean;
  retentionPeriod: number;           // Days
  geographicRestrictions?: string[]; // Allowed regions
}
```

### Integration Security

**External API Security:**
- **OAuth 2.0 Flows:** Secure authentication with GitHub, SharePoint, and Figma APIs
- **Token Encryption:** All external API tokens encrypted at rest with key rotation
- **Rate Limiting:** Comprehensive rate limiting to prevent abuse and ensure availability
- **Webhook Validation:** Cryptographic validation of incoming webhooks from external services

**BMad v6 Framework Security:**
- **Agent Definition Integrity:** Cryptographic verification of agent definitions and templates
- **Context Isolation:** Secure isolation of project contexts to prevent data leakage
- **Audit Logging:** Comprehensive logging of all agent interactions and workflow transitions
- **Performance Monitoring:** Security-focused monitoring to detect anomalous behavior

### Compliance & Audit

**Audit Logging:**
```typescript
interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;                     // create, read, update, delete, execute
  resource: string;                   // Affected resource
  resourceId: string;
  details: AuditDetails;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  riskScore?: number;                 // Calculated risk assessment
}

interface AuditDetails {
  previousValue?: any;                // For update operations
  newValue?: any;                     // For create/update operations
  agentId?: string;                   // For agent interactions
  phaseTransition?: PhaseTransition;  // For workflow changes
  integrationSync?: SyncOperation;    // For external integrations
}
```

**Compliance Features:**
- **GDPR Compliance:** Data subject rights, consent management, and data portability
- **SOC 2 Type II:** Security controls aligned with SOC 2 requirements
- **ISO 27001:** Information security management system compliance
- **Industry-Specific:** Healthcare (HIPAA), Financial (SOX), Government (FedRAMP) compliance options

**Data Retention & Privacy:**
- **Automated Data Lifecycle:** Configurable retention policies with automated deletion
- **Right to be Forgotten:** GDPR-compliant data deletion capabilities
- **Data Minimization:** Collection and processing of only necessary data
- **Privacy by Design:** Privacy considerations integrated into all system components

### Threat Protection

**Application Security:**
- **Input Validation:** Comprehensive input sanitization and validation
- **SQL Injection Prevention:** Parameterized queries and ORM-based data access
- **XSS Protection:** Content Security Policy (CSP) and output encoding
- **CSRF Protection:** Anti-CSRF tokens for all state-changing operations

**Infrastructure Security:**
- **Network Segmentation:** Isolated network segments for different service tiers
- **DDoS Protection:** Cloud-native DDoS protection and rate limiting
- **Intrusion Detection:** Real-time monitoring and alerting for security threats
- **Vulnerability Management:** Regular security scanning and patch management

**Monitoring & Incident Response:**
- **Security Information and Event Management (SIEM):** Centralized security monitoring
- **Anomaly Detection:** Machine learning-based detection of unusual patterns
- **Incident Response Plan:** Documented procedures for security incident handling
- **Forensic Capabilities:** Detailed logging and data preservation for investigations
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

## Data Flow Documentation

### BMad v6 Agent Orchestration Flow

This section details the complex data flows for intelligent agent orchestration, ensuring consistent implementation across all AI development agents.

#### Agent Selection and Engagement Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Frontend
    participant API as Fastify API
    participant AOS as Agent Orchestration Service
    participant SAIS as Scale-Adaptive Intelligence Service
    participant Redis as Redis Cache
    participant DB as PostgreSQL

    Note over U,DB: Context-Aware Agent Selection Process

    U->>UI: Request agent assistance
    UI->>API: POST /api/v1/projects/:id/agents/recommend
    API->>SAIS: Analyze project complexity & phase
    SAIS->>DB: Query project context & history
    DB-->>SAIS: Return project metadata
    SAIS->>AOS: Request optimal agent selection

    Note over AOS,Redis: Intelligence Selection Algorithm

    AOS->>Redis: Check cached agent definitions
    Redis-->>AOS: Return agent capabilities
    AOS->>AOS: Apply 60-70% token reduction logic
    AOS->>AOS: Select 2-3 contextually relevant agents

    AOS-->>API: Return recommended agents
    API-->>UI: Agent recommendations with rationale
    UI-->>U: Display agent options

    Note over U,DB: Agent Engagement Process

    U->>UI: Select specific agent
    UI->>API: POST /api/v1/projects/:id/agents/engage
    API->>AOS: Engage selected agent
    AOS->>Redis: Load agent prompt & context
    AOS->>DB: Log agent engagement
    AOS-->>API: Agent engagement confirmation
    API-->>UI: Ready for agent interaction
```

#### 4-Phase Workflow Progression Flow

```mermaid
sequenceDiagram
    participant Agent as BMad v6 Agent
    participant WMS as Workflow Management Service
    participant ArtSvc as Artifact Service
    participant GitSvc as GitHub Service
    participant ShareSvc as SharePoint Service
    participant DB as PostgreSQL

    Note over Agent,DB: Phase Progression Management

    Agent->>WMS: Request phase transition
    WMS->>DB: Validate current phase completion
    DB-->>WMS: Phase validation results

    alt Phase Requirements Met
        WMS->>WMS: Update phase status
        WMS->>ArtSvc: Generate phase artifacts

        Note over ArtSvc,ShareSvc: Artifact Generation & Sync

        ArtSvc->>ArtSvc: Process BMad v6 templates
        ArtSvc->>GitSvc: Sync to GitHub repository
        ArtSvc->>ShareSvc: Sync to SharePoint

        par GitHub Sync
            GitSvc->>GitSvc: Create/update files
            GitSvc-->>ArtSvc: Sync confirmation
        and SharePoint Sync
            ShareSvc->>ShareSvc: Upload documents
            ShareSvc-->>ArtSvc: Sync confirmation
        end

        ArtSvc-->>WMS: Artifact generation complete
        WMS->>DB: Update phase status & artifacts
        WMS-->>Agent: Phase transition approved

    else Requirements Not Met
        WMS-->>Agent: Phase transition blocked
        WMS-->>Agent: Return missing requirements
    end
```

#### Multi-Epic Workflow Coordination

```mermaid
sequenceDiagram
    participant PM as Project Manager Agent
    participant Arch as Architect Agent
    participant Dev as Developer Agent
    participant WMS as Workflow Management Service
    participant ES as Event System
    participant DB as PostgreSQL

    Note over PM,DB: Cross-Epic Dependencies Management

    PM->>WMS: Initiate multi-epic workflow
    WMS->>DB: Query epic dependencies
    DB-->>WMS: Return dependency graph
    WMS->>WMS: Calculate execution order

    Note over WMS,ES: Parallel Epic Processing

    WMS->>ES: Publish epic_ready events

    par Epic A Processing
        ES->>Arch: Epic A ready notification
        Arch->>WMS: Start Epic A architecture
        WMS->>DB: Track Epic A progress
    and Epic B Processing (depends on Epic A)
        ES->>ES: Wait for Epic A milestone
        Note right of ES: Dependency blocking
    and Epic C Processing (independent)
        ES->>Dev: Epic C ready notification
        Dev->>WMS: Start Epic C development
        WMS->>DB: Track Epic C progress
    end

    Arch->>WMS: Epic A architecture complete
    WMS->>ES: Publish epic_a_architecture_done
    ES->>Dev: Epic B unblocked notification
    Dev->>WMS: Start Epic B development

    Note over PM,DB: Workflow Completion Validation

    WMS->>DB: Query all epic statuses
    DB-->>WMS: Epic completion status
    WMS->>PM: Multi-epic workflow complete
```

#### Token Consumption Optimization Flow

```mermaid
sequenceDiagram
    participant UI as React Frontend
    participant API as Fastify API
    participant AOS as Agent Orchestration Service
    participant SAIS as Scale-Adaptive Intelligence Service
    participant Cache as Redis Cache
    participant Telemetry as Ignis Platform

    Note over UI,Telemetry: Progressive Agent Loading Strategy

    UI->>API: Request project agents
    API->>SAIS: Analyze project complexity
    SAIS->>SAIS: Determine required agent subset

    Note over SAIS,Cache: Token Optimization Logic

    SAIS->>Cache: Check agent definition cache
    alt Cache Hit (Optimized Loading)
        Cache-->>SAIS: Return cached agent subset
        SAIS->>AOS: Load minimal agent set (30-40% tokens)
    else Cache Miss (Full Analysis)
        SAIS->>SAIS: Analyze full agent ecosystem
        SAIS->>Cache: Cache optimized subset
        SAIS->>AOS: Load contextual agents
    end

    AOS-->>API: Agent loading complete
    API->>Telemetry: Report token consumption metrics
    API-->>UI: Ready for agent interaction

    Note over UI,Telemetry: Validation: 60-70% Token Reduction

    Telemetry->>Telemetry: Calculate baseline vs optimized
    Telemetry->>Telemetry: Validate reduction target met
```

### Integration Data Flows

#### GitHub Repository Synchronization

```mermaid
flowchart TD
    A[Artifact Generated] --> B{Sync Configuration}
    B -->|Bidirectional| C[GitHub Service]
    B -->|One-way| D[SharePoint Service]

    C --> E[Create/Update Files]
    C --> F[Handle Conflicts]
    C --> G[Commit & Push]

    F --> H{Conflict Resolution}
    H -->|Auto-merge| I[Apply Merge Strategy]
    H -->|Manual| J[Flag for Review]

    D --> K[Upload Documents]
    D --> L[Update Metadata]
    D --> M[Notify Stakeholders]

    G --> N[Update Project Status]
    K --> N
    N --> O[Trigger Ignis Telemetry]
```

#### Enterprise Integration Pattern

```mermaid
flowchart LR
    subgraph "BMad v6 Platform"
        WF[Workflow Engine]
        AG[Agent Orchestrator]
        AS[Artifact Service]
    end

    subgraph "Enterprise Systems"
        AD[Azure AD/EntraID]
        GH[GitHub Enterprise]
        SP[SharePoint]
        CO[Confluence]
    end

    subgraph "Ignis Ecosystem"
        TE[Telemetry Engine]
        AN[Analytics Dashboard]
        AL[Alert System]
    end

    WF -->|JWT Auth| AD
    AG -->|Repository Access| GH
    AS -->|Document Sync| SP
    AS -->|Knowledge Base| CO

    WF -->|Usage Metrics| TE
    AG -->|Performance Data| TE
    AS -->|Sync Status| TE

    TE --> AN
    TE --> AL
```

## Implementation Patterns

This section provides comprehensive patterns and conventions to ensure consistent implementation across all AI agents working on the BMad v6-Powered SDLC Platform.

### Naming Patterns

#### API Routes
```typescript
// RESTful API route naming convention
GET    /api/v1/projects                    // List projects
GET    /api/v1/projects/:id               // Get specific project
POST   /api/v1/projects                   // Create project
PUT    /api/v1/projects/:id               // Update project
DELETE /api/v1/projects/:id               // Delete project

// BMad v6 specific routes
GET    /api/v1/projects/:id/agents        // List available agents for project
POST   /api/v1/projects/:id/agents/engage // Engage specific agent
GET    /api/v1/projects/:id/phases        // Get project phases
POST   /api/v1/projects/:id/phases/:phase/complete // Mark phase complete

// Artifact routes
GET    /api/v1/projects/:id/artifacts     // List project artifacts
POST   /api/v1/artifacts/generate         // Generate new artifact
GET    /api/v1/artifacts/:id/download     // Download artifact
PUT    /api/v1/artifacts/:id/sync         // Sync with GitHub/SharePoint
```

#### Database Tables
```sql
-- Table naming: snake_case, plural nouns
users, projects, agents, artifacts, project_phases, agent_engagements

-- Junction tables: alphabetical order
project_users, agent_capabilities, artifact_tags

-- Columns: snake_case
user_id, created_at, updated_at, github_id, bmad_track, phase_status
```

#### React Components
```typescript
// Component files: PascalCase with descriptive names
ProjectDashboard.tsx, AgentOrchestrator.tsx, PhaseProgressIndicator.tsx

// Component props interfaces: Component name + Props
interface ProjectDashboardProps {
  project: Project;
  onPhaseChange: (phase: BMadPhase) => void;
}

// Custom hooks: camelCase starting with 'use'
useProjectPhases(), useAgentOrchestration(), useBMadWorkflow()
```

#### Service Classes
```typescript
// Service naming: PascalCase + Service suffix
class ProjectService, class AgentOrchestrationService, class ArtifactGenerationService

// Service methods: camelCase, action-oriented
createProject(), engageAgent(), generateArtifact(), syncWithGitHub()
```

### Structure Patterns

#### Component Organization
```typescript
// React component structure template
import React from 'react';
import { useProjectPhases } from '@/hooks/useProjectPhases';
import { ProjectService } from '@/services/ProjectService';
import type { Project, BMadPhase } from '@/types';

interface ComponentNameProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // 1. Hooks (state, effects, custom hooks)
  const { phases, loading, error } = useProjectPhases(projectId);

  // 2. Event handlers
  const handlePhaseChange = useCallback((phase: BMadPhase) => {
    // Handler logic
  }, []);

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 4. Early returns (loading, error states)
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // 5. Render
  return (
    <div className="component-root">
      {/* JSX content */}
    </div>
  );
}
```

#### Service Organization
```typescript
// Service class structure template
export class ServiceName {
  private repository: Repository;
  private logger: Logger;

  constructor(
    repository: Repository,
    logger: Logger = createLogger('ServiceName')
  ) {
    this.repository = repository;
    this.logger = logger;
  }

  // Public methods (main functionality)
  async publicMethod(params: Type): Promise<ReturnType> {
    this.logger.info('Method called', { params });

    try {
      // Validation
      this.validateInput(params);

      // Business logic
      const result = await this.processBusinessLogic(params);

      // Return result
      this.logger.info('Method completed successfully');
      return result;
    } catch (error) {
      this.logger.error('Method failed', { error, params });
      throw this.handleError(error);
    }
  }

  // Private methods (internal logic)
  private validateInput(params: Type): void {
    // Validation logic
  }

  private async processBusinessLogic(params: Type): Promise<ReturnType> {
    // Core business logic
  }

  private handleError(error: unknown): Error {
    // Error transformation
  }
}
```

#### Test Organization
```typescript
// Test file naming: ComponentName.test.tsx, ServiceName.test.ts
// Test structure template
describe('ComponentName', () => {
  // Setup
  const defaultProps = {
    project: mockProject,
    onPhaseChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path tests
  describe('when rendering with valid props', () => {
    it('should display project phases', () => {
      // Test implementation
    });

    it('should handle phase transitions', () => {
      // Test implementation
    });
  });

  // Edge cases
  describe('when handling errors', () => {
    it('should display error message when project fails to load', () => {
      // Error test
    });
  });

  // Integration tests
  describe('when integrating with services', () => {
    it('should call ProjectService with correct parameters', () => {
      // Integration test
    });
  });
});
```

### Format Patterns

#### API Response Format
```typescript
// Success response template
interface ApiResponse<T> {
  success: true;
  data: T;
  metadata?: {
    pagination?: PaginationMetadata;
    timing?: TimingMetadata;
    version?: string;
  };
}

// Error response template
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           // VALIDATION_ERROR, UNAUTHORIZED, etc.
    message: string;        // User-friendly message
    details?: unknown;      // Technical details for debugging
    timestamp: string;      // ISO timestamp
    requestId: string;      // Trace ID for debugging
  };
}

// Pagination format
interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

#### Date Handling
```typescript
// All dates in ISO 8601 format
const createdAt = new Date().toISOString(); // "2025-11-21T10:30:00.000Z"

// Date formatting for UI
const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(date));
```

#### Logging Format
```typescript
// Structured logging format
logger.info('Action completed', {
  action: 'project_created',
  projectId: project.id,
  userId: user.id,
  duration: 150,
  metadata: {
    bmadTrack: project.selectedTrack,
    complexity: project.complexityScore,
  },
});
```

### Communication Patterns

#### Event Names
```typescript
// Event naming convention: ENTITY_ACTION or WORKFLOW_STATE_CHANGE
const EVENT_NAMES = {
  // Project events
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_DELETED: 'project.deleted',

  // Phase events
  PHASE_STARTED: 'phase.started',
  PHASE_COMPLETED: 'phase.completed',
  PHASE_FAILED: 'phase.failed',

  // Agent events
  AGENT_ENGAGED: 'agent.engaged',
  AGENT_DISENGAGED: 'agent.disengaged',

  // Artifact events
  ARTIFACT_GENERATED: 'artifact.generated',
  ARTIFACT_SYNCED: 'artifact.synced',
} as const;
```

#### State Updates
```typescript
// Redux/Zustand state update patterns
interface ProjectState {
  projects: Record<string, Project>;
  loading: Record<string, boolean>;
  errors: Record<string, Error | null>;
}

// Action creators (if using Redux)
const projectActions = {
  setProject: (project: Project) => ({
    type: 'project/set' as const,
    payload: project,
  }),

  setLoading: (projectId: string, loading: boolean) => ({
    type: 'project/setLoading' as const,
    payload: { projectId, loading },
  }),
};

// Zustand store patterns
interface ProjectStore extends ProjectState {
  // Actions
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Selectors
  getProject: (id: string) => Project | undefined;
  getProjectsByUser: (userId: string) => Project[];
  isProjectLoading: (id: string) => boolean;
}
```

#### Inter-Service Communication
```typescript
// Service-to-service messaging pattern
interface ServiceMessage<T = unknown> {
  type: string;
  payload: T;
  metadata: {
    timestamp: string;
    source: string;
    correlationId: string;
    version: string;
  };
}

// Message handler pattern
class MessageHandler {
  async handleMessage(message: ServiceMessage): Promise<void> {
    const { type, payload, metadata } = message;

    switch (type) {
      case 'project.created':
        await this.handleProjectCreated(payload as Project);
        break;
      case 'agent.engaged':
        await this.handleAgentEngaged(payload as AgentEngagement);
        break;
      default:
        this.logger.warn('Unknown message type', { type, metadata });
    }
  }
}
```

### Lifecycle Patterns

#### Loading States
```typescript
// Loading state management pattern
interface LoadingState {
  idle: 'idle';
  loading: 'loading';
  success: 'success';
  error: 'error';
}

// Hook for async operations
function useAsyncOperation<T>() {
  const [state, setState] = useState<LoadingState>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState('loading');
    setError(null);

    try {
      const result = await operation();
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setState('error');
      throw error;
    }
  }, []);

  return {
    state,
    data,
    error,
    execute,
    isLoading: state === 'loading',
    isError: state === 'error',
    isSuccess: state === 'success',
  };
}
```

#### Error Recovery
```typescript
// Error boundary pattern for React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Component error boundary triggered', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// Retry mechanism pattern
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      logger.warn(`Operation failed, retrying (${attempt}/${maxRetries})`, { error });
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw new Error('This should never be reached');
}
```

### Location Patterns

#### URL Structure
```typescript
// URL routing patterns
const ROUTES = {
  // Main application routes
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Project routes
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PROJECT_PHASES: '/projects/:id/phases',
  PROJECT_AGENTS: '/projects/:id/agents',

  // Agent routes
  AGENT_ORCHESTRATOR: '/projects/:id/agents/:agentId',
  AGENT_WORKFLOWS: '/projects/:id/workflows',

  // Artifact routes
  ARTIFACTS: '/projects/:id/artifacts',
  ARTIFACT_EDITOR: '/projects/:id/artifacts/:artifactId/edit',

  // Settings
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
} as const;
```

#### Asset Organization
```typescript
// Asset file organization
public/
├── icons/
│   ├── agents/          # Agent-specific icons
│   ├── phases/          # Phase status icons
│   └── ui/              # General UI icons
├── images/
│   ├── logos/           # Brand assets
│   ├── illustrations/   # Feature illustrations
│   └── avatars/         # Default avatars
└── fonts/              # Custom fonts

// Asset import patterns
import AgentIcon from '@/assets/icons/agents/analyst.svg';
import PhaseIcon from '@/assets/icons/phases/planning.svg';
```

#### Configuration Placement
```typescript
// Configuration file locations
config/
├── app.config.ts        # Main application configuration
├── database.config.ts   # Database connection settings
├── auth.config.ts       # Authentication configuration
├── integrations/
│   ├── github.config.ts
│   ├── sharepoint.config.ts
│   └── ignis.config.ts
└── environments/
    ├── development.ts
    ├── staging.ts
    └── production.ts
```

### Consistency Patterns

#### UI Date Formats
```typescript
// Consistent date formatting across UI
const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',           // Nov 21, 2025
  LONG: 'MMMM d, yyyy',          // November 21, 2025
  WITH_TIME: 'MMM d, yyyy h:mm a', // Nov 21, 2025 2:30 PM
  RELATIVE: 'relative',           // 2 hours ago, yesterday, etc.
} as const;

// Usage in components
function formatProjectDate(date: string, format: keyof typeof DATE_FORMATS) {
  if (format === 'RELATIVE') {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
  return format(new Date(date), DATE_FORMATS[format]);
}
```

#### Logging Consistency
```typescript
// Standard logging interface across all services
interface Logger {
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
}

// Consistent log metadata structure
interface LogMetadata {
  userId?: string;
  projectId?: string;
  agentId?: string;
  requestId?: string;
  duration?: number;
  [key: string]: unknown;
}
```

#### User-Facing Error Messages
```typescript
// Error message consistency
const ERROR_MESSAGES = {
  // Generic errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action. Please log in and try again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',

  // Project-specific errors
  PROJECT_CREATE_FAILED: 'Failed to create project. Please try again.',
  PROJECT_UPDATE_FAILED: 'Failed to update project. Your changes were not saved.',
  PROJECT_DELETE_FAILED: 'Failed to delete project. Please try again.',

  // Agent-specific errors
  AGENT_ENGAGEMENT_FAILED: 'Failed to engage agent. Please try again.',
  AGENT_NOT_AVAILABLE: 'The selected agent is not available for this project type.',

  // Artifact errors
  ARTIFACT_GENERATION_FAILED: 'Failed to generate artifact. Please try again.',
  ARTIFACT_SYNC_FAILED: 'Failed to sync with external service. Please check your connection.',
} as const;
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
