# BMad v6-Powered SDLC Platform Web UI - POC Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Validate the "Upstream SDLC Orchestration Platform" concept through functional demonstration of BMad v6 methodology accessibility via web interfaces for upstream activities (ideation, planning, solutioning)
- Prove non-technical stakeholders can effectively use BMad v6's scale-adaptive intelligence and specialized agent orchestration through familiar web interfaces for upstream SDLC activities
- Demonstrate seamless integration between web platform and existing BMad v6 IDE workflows with clear handoff points for downstream development activities
- Validate comprehensive telemetry capture and real-time data transmission to Ignis Platform for analytics and monitoring
- Achieve 85% task completion rate for end-to-end workspace creation, artifact generation, and dual-action GitHub synchronization within 2 hours with minimal technical support
- Prove 60-70% token consumption reduction through dynamic file-level agent loading (specific workflows, tasks, agent definitions) with sub-3-second response times
- Validate workspace creation workflows for both Greenfield and Brownfield projects with proper BMad framework setup and working branch configuration
- Establish foundation for full MVP development with clear validation metrics and user feedback

### Background Context

The BMad v6 framework provides revolutionary AI-driven agile workflows with scale-adaptive intelligence, 12 specialized agents, and proven 4-phase methodology, but accessibility barriers prevent non-technical stakeholders from leveraging these powerful capabilities for upstream SDLC activities (ideation, planning, solutioning). This POC addresses the critical gap by demonstrating how web-based interfaces can democratize BMad v6's sophisticated agent orchestration and methodology for upstream activities while maintaining full integration with existing IDE workflows for downstream development.

The POC validates the core hypothesis that non-technical stakeholders (product managers, business analysts, GTM teams) will readily adopt BMad v6's proven methodology for upstream SDLC activities when provided with familiar web interfaces and document formats, eliminating the technical barriers that currently limit access to scale-adaptive intelligence and specialized agent expertise, with clear handoff points to BMad v6 IDE workflows for downstream development. The POC web UI itself will be generated using the BMad framework, providing concrete validation of the framework's capability for complex application development.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-11-17 | 1.0 | Initial POC PRD creation based on poc-brief.md | Business Analyst |

## Requirements

### Functional

**FR1:** The system shall provide user authentication via EntraID/Azure AD Single Sign-On (SSO) for enterprise integration with JWT-based session-less architecture and workspace creation capabilities with clear distinction between workspace-level (project-level) configuration and account-level management.

**FR2:** The system shall implement workspace creation workflows for both Greenfield projects (GitHub repository creation, user configuration, BMad framework installation, workflow initialization, BMad working branch creation, application metadata updates) and Brownfield projects (existing code repository configuration, BMad framework setup, workflow configuration, BMad working branch creation).

**FR3:** The system shall implement intelligent agent orchestration from BMad v6's ecosystem, presenting only contextually relevant agents (Analyst, PM, Architect, UX Expert) based on project phase, with dynamic file-level loading of specific workflows, tasks, and agent definitions through MCP tool calling or function calling capabilities.

**FR4:** The system shall demonstrate complete 4-phase BMad v6 methodology execution through web interface for upstream activities: Configuration (workspace setup), Ideation (brainstorming, research), Product Definition (PRD, architecture), and Planning (epics, stories, estimation).

**FR5:** The system shall provide AI-powered document generation following BMad v6 templates with comprehensive in-platform viewing, editing capabilities, and version control for all generated artifacts.

**FR6:** The system shall implement dual-action GitHub integration:
   - **Save Action:** Persist artifacts to BMad working branch for iterative work
   - **Publish Action:** Persist artifacts to working branch, then merge to main branch with diff visualization (future phase: accept/reject individual diffs)

**FR7:** The system shall implement MCP tools or function calling capabilities equivalent to desktop environment tools (createFile, editFile, createDirectory, changes/diff) to support dynamic file-level loading of agent components (specific workflows, tasks, agent definitions).

**FR8:** The system shall demonstrate document storage in GitHub repositories with foundation for future SharePoint integration via Model Context Protocol (MCPs), proving platform extensibility and enterprise document workflow capabilities.

**FR9:** The system shall implement comprehensive enterprise observability integration using OpenTelemetry Protocol (OTLP) with configurable destinations for user behavior analytics, workflow performance monitoring, token consumption tracking and reporting (including dynamic file-level loading metrics), and seamless Ignis Platform ecosystem integration.

**FR10:** The system shall support multi-LLM integration (GPT-4, Claude, Gemini) with agent-specific context management and conversational AI interface for workflow guidance.

**FR11:** The system shall implement dynamic phase progress tracking with automatic completion detection and real-time progress updates based on agent interactions and document generation.

### Non Functional

**NFR1:** Dynamic file-level agent loading (specific workflows, tasks, agent definitions) shall achieve sub-3-second response times with 60-70% token consumption reduction through MCP tool calling or function calling compared to loading complete agent bundles or all 12 agents simultaneously.

**NFR2:** The system shall achieve 95% accuracy in automatic phase completion detection and real-time progress updates during workflow execution for upstream SDLC activities.

**NFR3:** Document generation shall complete within 30 seconds for standard BMad v6 artifacts (project brief, PRD, architecture document) with proper template structure preservation.

**NFR4:** The system shall maintain 99% uptime for dual-action GitHub synchronization (Save to working branch, Publish with merge to main) during POC testing period with zero data loss, demonstrating foundation for future SharePoint integration via MCPs.

**NFR5:** Workspace creation workflows shall complete within 20 minutes for both Greenfield (repository creation, BMad installation, working branch setup) and Brownfield (existing repository configuration, BMad setup, working branch creation) scenarios.

**NFR6:** The system shall support 5-10 concurrent users during POC validation with responsive performance and stable workflow execution.

**NFR7:** Web application shall achieve sub-2-second page load times and support modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with responsive design.

**NFR8:** The system shall provide comprehensive error handling and recovery for integration failures, document processing issues, and workflow interruptions with clear user feedback.

**NFR9:** All telemetry data transmission using OpenTelemetry Protocol (OTLP) shall be real-time with 100% successful data capture and transmission validation during testing period, including token utilization metrics, dynamic loading performance, and performance reporting.

## User Interface Design Goals

### Overall UX Vision

The POC interface shall demonstrate the "Upstream SDLC Orchestration Platform" concept through intuitive, context-aware interfaces that present BMad v6's sophisticated capabilities for upstream activities (ideation, planning, solutioning) without overwhelming non-technical users. The design emphasizes intelligent simplicity - complex AI-driven agent orchestration presented through familiar web interfaces that guide users through proven methodology without requiring technical expertise, with clear handoff points to BMad v6 IDE workflows for downstream development.

### Key Interaction Paradigms

**Intelligent Agent Guidance:** Context-aware agent selection and progressive engagement that starts with 2-3 relevant agents and dynamically suggests additional expertise as project complexity evolves, with dynamic file-level loading of specific workflows, tasks, and agent definitions to eliminate cognitive overload and token consumption while maintaining access to specialized capabilities.

**Workspace-Centric Navigation:** Clear distinction between workspace-level (project-level) operations and account-level management, with guided workspace creation workflows for Greenfield and Brownfield projects including BMad framework setup and working branch configuration.

**Dual-Action GitHub Workflow:** Clear visual distinction between Save action (persist to working branch for iterative work) and Publish action (merge to main branch with diff visualization), supporting iterative development with final publication control.

**Phase-Based Navigation:** Clear visual progression through BMad v6's 4-phase methodology for upstream activities with automatic phase completion detection and seamless transitions between Configuration, Ideation, Product Definition, and Planning phases.

**Conversational Workflow:** Chat-based interface with multi-LLM support that provides natural language interaction with BMad v6 agents while maintaining structured workflow execution and artifact generation.

### Core Screens and Views

**Authentication & Setup:** EntraID/Azure AD SSO login with workspace creation workflows (Greenfield: repository creation, BMad installation, working branch setup; Brownfield: existing repository configuration, BMad setup, working branch creation), integration configuration for GitHub token-based access and Ignis Platform ecosystem, and clear distinction between workspace-level configuration and account-level management.

**Project Dashboard:** Phase progress visualization for upstream activities, active agent display, document generation status, dual-action GitHub workflow indicators (Save/Publish), and integration synchronization status with real-time updates.

**Agent Chat Interface:** Conversational AI interface with agent-specific context, workflow guidance, document generation capabilities, and dynamic file-level loading indicators integrated with BMad v6 methodology execution for upstream activities.

**Document Viewer/Editor:** In-platform viewing and editing of generated artifacts with version control, BMad v6 template structure preservation, dual-action workflow buttons (Save to working branch, Publish to main with diff), and synchronization status indicators.

**Integration Status Dashboard:** Real-time monitoring of dual-action GitHub synchronization (working branch and main branch status), document storage status, and OpenTelemetry Protocol (OTLP) telemetry transmission to Ignis Platform ecosystem with clear status indicators and troubleshooting guidance.

### Accessibility: WCAG AA

The POC interface shall meet WCAG AA compliance standards for accessibility, supporting screen readers, keyboard navigation, and high contrast modes across all workflow interfaces and document management features.

### Branding

The POC shall utilize the existing Ignis design system with TailwindCSS styling, maintaining professional enterprise-grade visual design that emphasizes trust, reliability, and intelligent simplicity while clearly distinguishing between different workflow phases and agent interactions.

### Target Device and Platforms: Web Responsive

Primary focus on desktop environments for comprehensive workflow execution, with responsive design supporting tablet usage for document review and basic interaction. Mobile support limited to read-only document viewing and basic status monitoring.

## Technical Assumptions

### Repository Structure: Monorepo

The POC shall use a monorepo structure to manage the React frontend, Node.js backend services, BMad v6 integration components, and integration utilities in a single repository, supporting rapid development and coordinated deployment for validation purposes.

### Service Architecture

**Microservices within Monorepo:** The POC shall implement focused services for:
- BMad v6 Agent Orchestration Service (context-aware agent selection and workflow coordination)
- Document Generation Service (BMad v6 template processing and artifact creation)
- GitHub Integration Service (repository synchronization and workflow handoff)
- SharePoint Integration Service (document management and enterprise workflow validation)
- Ignis Platform Telemetry Service (comprehensive data capture and real-time transmission)
- Authentication Service (EntraID/Azure AD SSO and JWT-based session-less architecture)

Each service shall be independently testable while sharing common libraries for BMad v6 integration, document processing, and external API management.

### Testing Requirements

**POC Validation Testing:** The system shall implement targeted testing for:
- Unit tests for core BMad v6 integration logic, agent orchestration, and document generation workflows
- Integration tests for GitHub/SharePoint synchronization, Ignis Platform telemetry transmission, and multi-LLM agent interactions
- End-to-end tests for complete 4-phase workflow execution, user authentication, and artifact generation validation
- Performance testing for agent loading optimization, token consumption reduction, and concurrent user scenarios
- User acceptance testing with target personas for workflow validation and usability confirmation

### Additional Technical Assumptions and Requests

**Frontend Framework:** React 18+ with Next.js 14 framework, TailwindCSS for styling (matching existing POC design system), TypeScript for type safety, and responsive design components for desktop/tablet usage. Web UI generated using BMad framework for methodology consistency.

**Backend Technology:** Node.js 20+ with Fastify Web Server for high-performance parallel request processing, supporting BMad v6 agent orchestration, document processing workflows, and multi-LLM integration with agent-specific prompt management. Fully dockerized deployment architecture.

**Database Strategy:** PostgreSQL 15 for structured data (projects, users, agent configurations, workflow state) with Redis 7 for agent definition caching and real-time data processing. JWT-based session-less architecture for stateless user context management.

**BMad v6 Integration:** Direct integration with existing BMad v6 framework components, agent definition loading, template system access, and workflow orchestration while maintaining methodology integrity throughout web implementation.

**API Integration Architecture:** RESTful APIs for GitHub, SharePoint, and Ignis Platform integration with webhook support for real-time synchronization, comprehensive error handling, and secure credential management for all third-party connections.

**Security and Compliance:** EntraID/Azure AD Single Sign-On (SSO) authentication for enterprise integration, GitHub token-based repository access, JWT-based session-less architecture, OpenTelemetry Protocol (OTLP) for secure telemetry transmission, role-based access control, and comprehensive audit logging for enterprise validation.

**Performance and Scalability:** Optimized for POC validation with 5-10 concurrent users, agent definition caching for performance, selective loading optimization for token consumption reduction, and cloud-native deployment readiness for future scaling.

**Development and Deployment:** Rapid development cycle with automated testing, BMad v6 integration validation, and streamlined deployment for POC demonstration and user testing scenarios.

## Epic List

**Epic 1: POC Foundation & Authentication**
Establish core POC infrastructure with GitHub OAuth authentication, basic project setup, and BMad v6 integration foundation.

**Epic 2: Intelligent Agent Orchestration & 4-Phase Workflow**
Implement context-aware agent selection from BMad v6 ecosystem and complete 4-phase methodology demonstration through web interface.

**Epic 3: Document Generation & BMad v6 Template Integration**
Enable AI-powered artifact creation following BMad v6 templates with comprehensive viewing, editing, and version control capabilities.

**Epic 4: Strategic Integration Validation**
Implement GitHub and SharePoint integrations with bidirectional synchronization to prove platform extensibility and enterprise workflow capabilities.

**Epic 5: Ignis Platform Telemetry & Performance Optimization**
Integrate comprehensive telemetry capture with real-time Ignis Platform transmission and validate agent loading performance optimization.

## Epic 1: POC Foundation & Authentication

**Epic Goal:** Establish the foundational POC infrastructure with secure GitHub OAuth authentication, basic project workspace creation, and BMad v6 framework integration. This epic delivers the essential platform foundation that enables users to securely access the system, configure codebase connections, and begin leveraging BMad v6 methodology through web interfaces, providing immediate validation of the core "SDLC IDE over Web" concept.

### Story 1.1: EntraID/Azure AD SSO Authentication & JWT Architecture

As a non-technical stakeholder,
I want to sign in using my enterprise Azure AD account with secure authentication,
so that I can access the POC platform with consistent enterprise identity integration and validate repository access.

#### Acceptance Criteria
1. EntraID/Azure AD Single Sign-On (SSO) authentication implemented with secure user login and enterprise profile integration
2. JWT-based session-less architecture with secure token handling, refresh capabilities, and proper logout functionality
3. Basic user profile display showing GitHub account information and repository access permissions
4. Session persistence across browser sessions with appropriate security timeouts
5. Error handling for authentication failures with clear user feedback and retry mechanisms
6. Integration readiness validation showing GitHub API connectivity and permission verification

### Story 1.2: Codebase Configuration Setup

As a project manager,
I want to configure codebase-level settings including GitHub repository connections and integration endpoints,
so that I can establish the foundation for BMad v6 workflow execution and document synchronization.

#### Acceptance Criteria
1. Codebase configuration interface with clear distinction from project-level management
2. GitHub repository URL configuration with validation and connection testing
3. Repository access verification with branch selection and permission validation
4. Basic integration endpoint configuration for SharePoint and Ignis Platform connections
5. Configuration validation with connectivity testing and error reporting
6. Configuration persistence with secure credential storage and management

### Story 1.3: BMad v6 Framework Integration Foundation

As a developer,
I want the POC to integrate with BMad v6 framework components and agent definitions,
so that the web platform can access proven methodology templates and agent orchestration capabilities.

#### Acceptance Criteria
1. BMad v6 framework component integration with agent definition loading capabilities
2. Template system access with BMad v6 artifact templates and workflow definitions
3. Agent configuration synchronization with context-aware loading preparation
4. Basic workflow orchestration engine with phase management and transition logic
5. Integration validation with BMad v6 methodology integrity verification
6. Error handling for framework integration issues with diagnostic information and recovery options

## Epic 2: Intelligent Agent Orchestration & 4-Phase Workflow

**Epic Goal:** Implement BMad v6's intelligent agent orchestration system with context-aware agent selection and complete 4-phase methodology demonstration. This epic validates the core value proposition by proving that non-technical stakeholders can effectively leverage BMad v6's scale-adaptive intelligence and specialized agent expertise through intuitive web interfaces, demonstrating the complete workflow from project ideation through planning phases.

### Story 2.1: Context-Aware Agent Selection Engine

As a non-technical stakeholder,
I want the system to intelligently recommend only relevant agents based on my project context and current phase,
so that I can access specialized expertise without being overwhelmed by all 12 BMad v6 agents simultaneously.

#### Acceptance Criteria
1. Intelligent agent orchestration engine that analyzes project context and recommends 2-3 relevant agents initially
2. Context-aware agent selection from BMad v6 ecosystem (Analyst, PM, Architect, UX Expert) based on current workflow phase
3. Progressive agent engagement that dynamically suggests additional agents as project complexity evolves
4. Agent role switching capabilities with proper context preservation and workflow continuity
5. Clear agent expertise descriptions and recommendations with rationale for suggested agent combinations
6. Token optimization through selective agent loading with performance benchmarking and validation

### Story 2.2: Configuration Phase Implementation

As a project manager,
I want to complete project setup with integration configuration through guided workflow,
so that I can establish the foundation for BMad v6 methodology execution with proper tool connections.

#### Acceptance Criteria
1. Configuration phase interface with guided project setup workflow and integration configuration
2. GitHub repository connection with branch selection and document path structure definition
3. SharePoint integration setup with document library configuration and authentication validation
4. Ignis Platform connection configuration with telemetry endpoint setup and data transmission testing
5. Configuration validation with connectivity testing and integration verification
6. Phase completion detection with automatic progression to Ideation phase upon successful configuration

### Story 2.3: Ideation Phase with AI-Assisted Workflows

As a business analyst,
I want to conduct AI-assisted brainstorming, market research, and competitive analysis through web interface,
so that I can leverage BMad v6's proven methodology for comprehensive project ideation and research.

#### Acceptance Criteria
1. Ideation phase interface with AI-assisted brainstorming capabilities and structured workflow guidance
2. Market research prompt generation with AI-powered research guidance and information gathering
3. Competitive analysis workflows with template-based analysis and documentation generation
4. Collaborative ideation features with team input collection and synthesis capabilities
5. Document generation for ideation artifacts following BMad v6 templates and methodology standards
6. Phase progress tracking with automatic completion detection and transition to Product Definition phase

### Story 2.4: Product Definition Phase with PRD & Architecture Generation

As a product manager,
I want to create comprehensive PRD and technical architecture documentation through AI guidance,
so that I can generate complete product specifications using BMad v6's proven templates and methodology.

#### Acceptance Criteria
1. Product Definition phase interface with PRD creation workflow and AI-powered guidance
2. Technical architecture generation with agent-assisted specification creation and validation
3. Requirements elicitation with structured questioning and comprehensive requirement capture
4. Document generation following BMad v6 PRD and architecture templates with proper structure preservation
5. Review and validation workflows with stakeholder feedback integration and approval tracking
6. Phase completion detection with automatic progression to Planning phase upon artifact completion

### Story 2.5: Planning Phase with Epic & Story Generation

As a project manager,
I want to generate epics, features, and user stories with story point estimation through AI assistance,
so that I can create comprehensive project planning artifacts using BMad v6's proven planning methodology.

#### Acceptance Criteria
1. Planning phase interface with epic and story generation workflow and AI-powered assistance
2. Feature breakdown with structured epic creation and story decomposition capabilities
3. User story generation following BMad v6 story templates with proper acceptance criteria definition
4. Story point estimation with AI-assisted sizing and complexity analysis
5. Planning artifact generation with comprehensive project breakdown and timeline estimation
6. Phase completion detection with handoff preparation for development teams using existing BMad v6 IDE workflows

## Epic 3: Document Generation & BMad v6 Template Integration

**Epic Goal:** Enable comprehensive AI-powered document generation following BMad v6 templates with in-platform viewing, editing, and version control capabilities. This epic validates the platform's ability to maintain BMad v6 methodology integrity while providing familiar document management experiences, ensuring generated artifacts meet framework standards and support seamless collaboration workflows.

### Story 3.1: BMad v6 Template-Based Document Generation

As a business user,
I want to generate comprehensive project artifacts using BMad v6 templates through AI assistance,
so that I can create high-quality specifications that follow proven methodology standards without technical expertise.

#### Acceptance Criteria
1. AI-powered document generation using BMad v6 template library with proper structure preservation
2. Template selection interface with context-aware recommendations based on project type and current phase
3. Guided document creation with AI assistance for content generation and methodology compliance
4. Document structure validation ensuring BMad v6 framework completeness criteria are met
5. Content quality verification with automated checking against template requirements and standards
6. Generation progress tracking with real-time status updates and completion notifications

### Story 3.2: In-Platform Document Viewing & Editing

As a project stakeholder,
I want to view and edit generated documents within the web platform with comprehensive formatting support,
so that I can review, modify, and collaborate on specifications without external tools or format conversion.

#### Acceptance Criteria
1. Rich document viewer with support for BMad v6 markdown artifacts and proper formatting display
2. In-platform editing capabilities with real-time preview and formatting preservation
3. Document structure navigation with section-based editing and content organization
4. Collaborative editing features with comment integration and review workflow support
5. Version control with change tracking, revision history, and rollback capabilities
6. Document validation with real-time checking against BMad v6 template requirements and methodology standards

## Epic 4: Strategic Integration Validation

**Epic Goal:** Implement GitHub and SharePoint integrations with bidirectional synchronization to prove platform extensibility and enterprise workflow capabilities. This epic validates the critical integration requirements that enable seamless handoff to development teams and enterprise document management, demonstrating the platform's ability to bridge business and technical workflows.

### Story 4.1: GitHub Repository Synchronization

As a developer,
I want automatic synchronization of generated documents with GitHub repositories,
so that I can access specifications through existing BMad v6 IDE workflows and maintain development workflow continuity.

#### Acceptance Criteria
1. Bidirectional GitHub synchronization with automatic commit and push of generated markdown documents
2. Repository structure management with proper folder organization following BMad v6 methodology
3. Commit message generation with document metadata, phase information, and change descriptions
4. Branch management with configurable target branches and merge conflict resolution
5. Synchronization status tracking with real-time updates and error handling for integration failures
6. Workflow handoff validation ensuring seamless transition to existing BMad v6 IDE environments

### Story 4.2: SharePoint Document Management Integration

As an enterprise user,
I want to publish and manage documents in SharePoint with proper metadata and version control,
so that I can integrate with existing enterprise document workflows and governance processes.

#### Acceptance Criteria
1. SharePoint integration with document upload, folder management, and metadata synchronization
2. Document library configuration with proper folder structure and enterprise taxonomy alignment
3. Version control integration with SharePoint versioning and approval workflow support
4. Metadata management with automatic tagging based on document type, phase, and project information
5. Access control synchronization with SharePoint permissions and enterprise security requirements
6. Publishing workflow with approval processes and audit trail generation for enterprise compliance

## Epic 5: Ignis Platform Telemetry & Performance Optimization

**Epic Goal:** Integrate comprehensive telemetry capture with real-time Ignis Platform transmission and validate agent loading performance optimization. This epic proves the platform's ecosystem connectivity and performance capabilities, ensuring seamless integration with the broader Ignis Platform while demonstrating significant efficiency improvements through intelligent agent orchestration.

### Story 5.1: Comprehensive Telemetry Integration

As a platform administrator,
I want comprehensive telemetry data captured and transmitted to Ignis Platform in real-time,
so that I can monitor user behavior, workflow performance, and platform optimization opportunities.

#### Acceptance Criteria
1. Comprehensive telemetry capture including user interactions, workflow progression, agent utilization, and document generation metrics
2. Real-time data transmission to Ignis Platform with secure authentication and data integrity validation
3. Performance monitoring with response times, token consumption tracking, and system resource utilization
4. User behavior analytics with workflow completion rates, feature usage patterns, and engagement metrics
5. Error tracking and diagnostic data collection with automated issue detection and reporting
6. Telemetry validation with 100% successful data transmission verification during testing period

### Story 5.2: Agent Loading Performance Optimization

As a system user,
I want optimized agent loading with reduced token consumption and fast response times,
so that I can experience efficient workflow execution without performance degradation or excessive resource usage.

#### Acceptance Criteria
1. Selective agent loading implementation with context-aware agent definition loading based on project requirements
2. Token consumption optimization achieving 60-70% reduction compared to loading all 12 agents simultaneously
3. Response time optimization with sub-3-second agent loading and workflow execution performance
4. Caching strategy implementation with intelligent agent definition caching and background refresh capabilities
5. Performance benchmarking with concurrent user testing and scalability validation for 5-10 users
6. Optimization validation with measurable performance improvements and resource efficiency demonstration
