# Story 1.1: Project Structure & Development Environment Setup

## Story Classification
- **Epic:** Epic 1 - POC Foundation & Authentication
- **Priority:** P0 (Critical - Foundation requirement)
- **Complexity:** Medium (3-5 days)
- **Dependencies:** None (Foundation story)

## User Story

**As a** development team member,
**I want** a complete project structure with Node.js Fastify backend and React frontend properly configured according to the updated architecture specifications,
**So that** I can begin implementing POC features with the correct technology stack, development environment, and EntraID integration foundation.

## Story Context & Business Value

**POC Validation Goals:**
- Establish the correct technology foundation (Node.js Fastify + React) per updated architecture
- Set up development environment with proper tooling and standards
- Create EntraID and integration resource foundation for enterprise deployment
- Enable rapid development of subsequent POC features with JWT session-less architecture

**User Personas:**
- **Primary:** Development team members implementing POC features
- **Secondary:** DevOps engineers setting up deployment pipelines
- **Tertiary:** Technical stakeholders validating architecture compliance

## Detailed Acceptance Criteria

### 🏗️ Project Structure Setup

**AC1: Backend Project Structure (Node.js Fastify)**
- **GIVEN** the project needs a Node.js Fastify backend per updated architecture
- **WHEN** the backend structure is created
- **THEN** it follows the exact structure specified in the architecture document
- **AND** includes proper directory structure: `backend/src/routes/`, `backend/src/services/`, `backend/src/models/`, `backend/src/plugins/`
- **AND** includes `auth.ts` plugin for EntraID JWT authentication integration
- **AND** includes proper configuration management with environment validation
- **AND** includes Prisma ORM models and service pattern setup

**AC2: Frontend Project Structure (React + TypeScript)**
- **GIVEN** the project needs a React frontend with EntraID integration
- **WHEN** the frontend structure is created
- **THEN** it follows React + TypeScript best practices with strict mode enabled
- **AND** includes EntraID OAuth 2.0 integration setup for Azure AD authentication
- **AND** includes proper component structure with error boundaries
- **AND** includes axios configuration with JWT token interceptors for API calls
- **AND** includes React Query for server state and Zustand for client state

**AC3: Development Environment Configuration**
- **GIVEN** developers need a consistent development environment
- **WHEN** the development environment is configured
- **THEN** it includes Docker Compose setup for local development
- **AND** includes Node.js environment with pnpm for dependency management
- **AND** includes proper environment variable configuration for EntraID and external services
- **AND** includes PostgreSQL and Redis setup with proper schema initialization

### 🔧 Development Tooling & Standards

**AC4: Code Quality & Development Standards**
- **GIVEN** the project requires high code quality standards
- **WHEN** development tooling is configured
- **THEN** it includes ESLint and Prettier for both frontend and backend code formatting
- **AND** includes TypeScript strict mode configuration for both frontend and backend
- **AND** includes pre-commit hooks for code quality enforcement
- **AND** includes Jest configuration for both backend and frontend testing
- **AND** includes React Testing Library for frontend component testing

**AC5: Cloud Integration Foundation**
- **GIVEN** the platform will deploy to cloud infrastructure per architecture
- **WHEN** cloud integration foundation is established
- **THEN** it includes containerization setup with Docker
- **AND** includes environment variable management for secrets
- **AND** includes OpenTelemetry Protocol (OTLP) configuration for monitoring
- **AND** includes proper environment configuration for dev/staging/prod
- **AND** includes object storage configuration for file handling

### 📦 Dependency Management & Build System

**AC6: Backend Dependencies & Configuration**
- **GIVEN** the backend requires specific Node.js packages per updated architecture
- **WHEN** backend dependencies are configured
- **THEN** it includes Fastify with proper async/await and TypeScript support
- **AND** includes Prisma ORM with PostgreSQL driver and Redis client
- **AND** includes @fastify/jwt for JWT token validation
- **AND** includes TypeScript for type safety and development experience
- **AND** includes Jest and testing utilities for comprehensive testing
- **AND** includes Winston for structured logging configuration

**AC7: Frontend Dependencies & Build Configuration**
- **GIVEN** the frontend requires specific React packages per updated architecture
- **WHEN** frontend dependencies are configured
- **THEN** it includes React 18.2.0 with TypeScript support
- **AND** includes OAuth 2.0 client libraries for EntraID authentication
- **AND** includes axios for API communication with JWT token interceptors
- **AND** includes React Query for server state management
- **AND** includes Zustand for client state management
- **AND** includes Next.js 14.2.5 for full-stack React framework with optimized build

### 🚀 Development Environment Validation

**AC8: Local Development Environment Verification**
- **GIVEN** the complete project structure is set up
- **WHEN** a developer runs the local development environment
- **THEN** both backend and frontend start successfully without errors
- **AND** the backend serves API endpoints with proper CORS configuration
- **AND** the frontend connects to the backend API successfully
- **AND** database migrations run successfully and create proper schema
- **AND** all development tools (linting, formatting, testing) work correctly
- **AND** environment variables are properly loaded and validated

**AC9: Documentation & Developer Experience**
- **GIVEN** developers need clear setup instructions
- **WHEN** project documentation is created
- **THEN** it includes comprehensive README with setup instructions
- **AND** includes architecture decision records (ADRs) for key technology choices
- **AND** includes API documentation structure with OpenAPI/Swagger setup
- **AND** includes development workflow documentation
- **AND** includes troubleshooting guide for common setup issues

## Tasks

### Task 1: Backend Project Structure Setup
- [ ] Create Python FastAPI project structure per architecture document
- [ ] Set up Poetry for dependency management with pyproject.toml
- [ ] Configure SQLAlchemy models and database connection
- [ ] Set up Pydantic schemas for API request/response validation
- [ ] Create auth_service.py foundation for MSAL integration
- [ ] Configure environment variable management with Pydantic Settings
- [ ] Set up logging configuration with structured logging
- [ ] Create basic health check endpoint

### Task 2: Frontend Project Structure Setup
- [ ] Create React + TypeScript project with strict mode
- [ ] Set up MSAL.js configuration for Azure AD integration
- [ ] Configure axios with interceptors for API communication
- [ ] Set up React Query for server state management
- [ ] Configure Zustand for client state management
- [ ] Set up component structure with error boundaries
- [ ] Configure routing with React Router
- [ ] Create basic authentication context and hooks

### Task 3: Development Environment Configuration
- [ ] Create Docker Compose configuration for local development
- [ ] Set up PostgreSQL database with proper schema initialization
- [ ] Configure development environment variables and secrets
- [ ] Set up Azure Key Vault integration for secrets management
- [ ] Configure Azure Application Insights for monitoring
- [ ] Create environment-specific configuration files
- [ ] Set up database migration system
- [ ] Configure CORS and security headers

### Task 4: Development Tooling & Quality Standards
- [ ] Configure ESLint and Prettier for frontend code quality
- [ ] Set up Black and isort for Python code formatting
- [ ] Configure pre-commit hooks for code quality enforcement
- [ ] Set up pytest configuration for backend testing
- [ ] Configure Jest and React Testing Library for frontend testing
- [ ] Create CI/CD pipeline foundation with GitHub Actions
- [ ] Set up code coverage reporting
- [ ] Configure static type checking with mypy for Python

### Task 5: Documentation & Developer Experience
- [ ] Create comprehensive README with setup instructions
- [ ] Document architecture decisions and technology choices
- [ ] Set up OpenAPI/Swagger documentation for API endpoints
- [ ] Create development workflow documentation
- [ ] Document environment setup and troubleshooting guide
- [ ] Create code style guide and contribution guidelines
- [ ] Set up API documentation generation
- [ ] Create developer onboarding checklist

## Dev Notes

### Technical Context
This story establishes the foundational project structure for the BMad v6 POC platform. The architecture document specifies:

- **Backend:** Python FastAPI with MSAL authentication (NOT Node.js/GitHub OAuth)
- **Frontend:** React + TypeScript with MSAL.js for Azure AD integration
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** MSAL (Microsoft Authentication Library) + Azure AD for enterprise SSO
- **Deployment:** Azure-native services with proper resource group setup

### Key Architecture Requirements
- Follow exact project structure from architecture document (lines 2772-2780)
- Use Python FastAPI backend with async/await support
- Implement MSAL Python for backend authentication
- Use MSAL.js for frontend Azure AD integration
- Set up proper Azure resource foundation for enterprise deployment

### Critical Dependencies
- Azure AD tenant configuration for MSAL authentication
- PostgreSQL database with proper schema initialization
- Azure Key Vault for secrets management
- Azure Application Insights for monitoring
- Docker Compose for local development environment

## Testing

### Unit Testing Requirements
- Python backend: pytest with >90% coverage
- React frontend: Jest + React Testing Library with >90% coverage
- Configuration validation: Environment variable loading and validation
- Database models: SQLAlchemy model validation and relationships
- API endpoints: FastAPI endpoint testing with proper async handling

### Integration Testing Requirements
- Full development environment startup (backend + frontend + database)
- API communication between frontend and backend
- Database connectivity and migration execution
- Azure service integration (Key Vault, Application Insights)
- Development tooling integration (linting, formatting, pre-commit hooks)

### Acceptance Testing Requirements
- Developer can set up complete environment in <30 minutes following README
- All development tools work correctly (linting, formatting, testing)
- Backend serves API endpoints with proper CORS configuration
- Frontend connects to backend API successfully
- Database migrations create proper schema structure

## Change Log

## Dev Agent Record

### Agent Model Used
*To be filled by development agent*

### Debug Log References
*To be filled by development agent*

### Completion Notes
*To be filled by development agent*

### File List
*To be filled by development agent - list all created/modified/deleted files*

## Status
Draft
