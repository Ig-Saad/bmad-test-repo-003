# Story 2.2: Configuration Phase with Workspace Creation Workflows

## Story Classification
- **Epic:** Epic 2 - Intelligent Agent Orchestration & 4-Phase Workflow
- **Priority:** P0 (Critical - First workflow phase)
- **Complexity:** Medium (4-5 days)
- **Dependencies:** Story 1.3 (External Service Configuration), Story 2.1 (MCP Server Implementation)

## User Story

**As a** project manager or technical stakeholder,
**I want to** complete **workspace setup** (workspace = project) with integration configuration through guided workflow, supporting both **Greenfield** (new repository) and **Brownfield** (existing repository) creation approaches,
**So that** I can establish the foundation for BMad v6 methodology execution with proper tool connections and **dual-action GitHub synchronization** (Save/Publish), enabling seamless workflow progression through all 4 upstream phases.

## Story Context & Business Value

**POC Validation Goals:**
- Demonstrate complete BMad v6 4-phase methodology execution starting with Configuration
- Validate **Greenfield and Brownfield workspace creation workflows**
- Prove seamless integration setup with **dual-action GitHub synchronization** configuration
- Establish foundation for automatic phase progression and completion detection
- Clarify workspace terminology (workspace = project) throughout configuration

**User Personas:**
- **Primary:** Project managers initiating new BMad v6 workspaces (Greenfield or Brownfield)
- **Secondary:** Technical stakeholders setting up development workflows with GitHub integration
- **Tertiary:** Business analysts configuring collaboration tools for upstream SDLC activities

## Detailed Acceptance Criteria

### 🏗️ Workspace Creation Type Selection

**AC1: Workspace Creation Type Selection (Greenfield vs Brownfield)**
- **GIVEN** a user starts a new workspace in the Upstream SDLC Orchestration Platform
- **WHEN** they enter the Configuration phase
- **THEN** they see clear options to choose workspace creation type:
  - **Greenfield:** Create new GitHub repository with BMad v6 framework installation
  - **Brownfield:** Connect existing code repository and add BMad v6 framework
- **AND** each option includes description of workflow steps and expected outcomes
- **AND** UI clarifies "workspace = project" terminology for user understanding
- **AND** selection determines subsequent configuration workflow steps

### 🌱 Greenfield Workflow - New Repository Creation

**AC2: Greenfield Workflow Step 1 - GitHub Repository Creation via MCP Server**
- **GIVEN** user selects Greenfield workspace creation
- **WHEN** they proceed with repository setup
- **THEN** the MCP server creates a new GitHub repository with user-specified name through secure API operations
- **AND** repository is initialized with default README and .gitignore through MCP server file operations
- **AND** user can configure repository visibility (public/private) with MCP server handling GitHub API calls
- **AND** repository metadata (description, topics) can be set during creation through MCP server
- **AND** MCP server validates repository creation success and reports status to main application

**AC3: Greenfield Workflow Step 2 - User Configuration**
- **GIVEN** GitHub repository is created
- **WHEN** configuring workspace user settings
- **THEN** the system sets up user permissions and access controls
- **AND** workspace owner and initial team members can be configured
- **AND** user roles (owner, editor, viewer) are assigned
- **AND** notification preferences are configured

**AC4: Greenfield Workflow Step 3 - BMad Framework Installation via MCP Server**
- **GIVEN** repository and users are configured
- **WHEN** installing BMad v6 framework
- **THEN** the MCP server creates complete BMad v6 framework structure using file operations (createDirectory, createFile)
- **AND** .bmad directory structure is created with agent definitions, workflows, tasks through MCP server
- **AND** .github directory is created with workflow configurations through MCP server file operations
- **AND** BMad v6 configuration files are initialized with workspace settings using MCP server editFile operations
- **AND** MCP server commits all framework files with proper commit messages and metadata

**AC5: Greenfield Workflow Step 4 - Workflow Initialization**
- **GIVEN** BMad framework is installed
- **WHEN** initializing BMad v6 workflows
- **THEN** the system configures 4-phase workflow definitions for upstream activities
- **AND** agent orchestration settings are initialized
- **AND** template system is configured with artifact templates
- **AND** phase progression rules are established

**AC6: Greenfield Workflow Step 5 - Working Branch Creation via MCP Server**
- **GIVEN** workflows are initialized
- **WHEN** setting up dual-action GitHub synchronization
- **THEN** the MCP server creates a dedicated **working branch** (e.g., "workspace/{workspace-id}") using branch management operations
- **AND** working branch is set as default for Save actions
- **AND** main branch is preserved for Publish actions (merge target)
- **AND** branch protection rules can be configured

**AC7: Greenfield Workflow Step 6 - Application Metadata Updates**
- **GIVEN** working branch is created
- **WHEN** finalizing workspace setup
- **THEN** the system updates workspace metadata in database
- **AND** workspace record includes creation_type = 'greenfield'
- **AND** GitHub configuration (repo URL, main branch, working branch) is saved
- **AND** workspace status is set to 'active' and Configuration phase marked complete

### 🏭 Brownfield Workflow - Existing Repository Configuration

**AC8: Brownfield Workflow Step 1 - Existing Repository Configuration**
- **GIVEN** user selects Brownfield workspace creation
- **WHEN** they provide existing repository information
- **THEN** MCP server validates repository access and permissions through GitHub API
- **AND** repository metadata is fetched and displayed via MCP server operations
- **AND** existing branch structure is analyzed and displayed
- **AND** user confirms repository selection before proceeding

**AC9: Brownfield Workflow Step 2 - BMad Framework Setup**
- **GIVEN** existing repository is validated
- **WHEN** adding BMad v6 framework to existing repository
- **THEN** MCP server checks for existing .bmad and .github directories through file operations
- **AND** BMad v6 framework files are added without overwriting existing code via MCP file operations
- **AND** conflict detection identifies any naming collisions
- **AND** user can review and approve framework file additions

**AC10: Brownfield Workflow Step 3 - Workflow Configuration**
- **GIVEN** BMad framework is added to repository
- **WHEN** configuring workflows for existing codebase
- **THEN** the system initializes 4-phase workflow for upstream activities
- **AND** workflow configuration adapts to existing repository structure
- **AND** existing documentation is analyzed for potential artifact migration
- **AND** agent orchestration is configured for brownfield context

**AC11: Brownfield Workflow Step 4 - Working Branch Creation**
- **GIVEN** workflows are configured
- **WHEN** setting up dual-action synchronization for existing repository
- **THEN** MCP server creates a dedicated **working branch** for workspace activities using branch management operations
- **AND** working branch is isolated from existing development branches
- **AND** main branch (or user-selected default) is set as Publish target
- **AND** branch strategy integrates with existing repository workflow

**AC12: Brownfield Workflow Step 5 - Metadata Finalization**
- **GIVEN** working branch is created
- **WHEN** completing Brownfield workspace setup
- **THEN** the system updates workspace metadata with creation_type = 'brownfield'
- **AND** existing repository structure is preserved
- **AND** BMad v6 configuration is saved alongside existing project settings
- **AND** workspace is activated and ready for upstream SDLC activities

### 🔧 Configuration Phase Interface & Workflow

**AC13: Guided Workspace Setup Workflow**
- **GIVEN** a user proceeds through Greenfield or Brownfield configuration
- **WHEN** they navigate the workflow
- **THEN** they see a guided interface with clear step-by-step progression
- **AND** progress indicators show completed steps and remaining configuration tasks
- **AND** each step includes helpful guidance specific to Greenfield/Brownfield approach
- **AND** users can save progress and resume configuration later
- **AND** Configuration phase purpose and expected outcomes are clearly explained

**AC14: Integration Configuration Orchestration**
- **GIVEN** a user completes workspace creation (Greenfield or Brownfield)
- **WHEN** they proceed to integration configuration
- **THEN** the system guides them through GitHub dual-action sync, SharePoint, and Ignis Platform setup
- **AND** configuration steps are presented in logical order with dependency awareness
- **AND** each integration includes validation and testing before proceeding
- **AND** dual-action GitHub sync configuration (Save/Publish) is clearly explained

### 🔗 GitHub Dual-Action Synchronization Configuration

### 🔗 GitHub Dual-Action Synchronization Configuration

**AC15: Working Branch and Main Branch Configuration**
- **GIVEN** workspace (Greenfield or Brownfield) has GitHub integration
- **WHEN** configuring dual-action synchronization
- **THEN** the system clearly identifies:
  - **Working Branch:** Target for Save actions (iterative work)
  - **Main Branch:** Target for Publish actions (merge from working branch)
- **AND** users can customize working branch naming convention
- **AND** branch configuration explains Save vs Publish workflow
- **AND** branch strategy is validated for write permissions

**AC16: Save Action Configuration**
- **GIVEN** dual-action sync is being configured
- **WHEN** setting up Save action behavior
- **THEN** the system configures:
  - Auto-commit to working branch on Save
  - Commit message templates for Save actions
  - Save action SLA target (<5 seconds)
- **AND** users understand Save persists to working branch only (not main)
- **AND** Save action can be triggered manually or auto-save configured

**AC17: Publish Action Configuration**
- **GIVEN** dual-action sync is being configured
- **WHEN** setting up Publish action behavior
- **THEN** the system configures:
  - Merge from working branch to main branch on Publish
  - Diff visualization before merge
  - Publish action SLA target (<15 seconds)
- **AND** users understand Publish merges accumulated changes from working branch to main
- **AND** Publish action requires manual trigger with confirmation

**AC18: Document Path Structure Definition**
- **GIVEN** a GitHub repository is connected (Greenfield or Brownfield)
- **WHEN** users configure document organization
- **THEN** they can define path structures for different artifact types (PRD, architecture, stories)
- **AND** the system suggests BMad v6-compliant folder structures and naming conventions
- **AND** path configuration includes validation for write permissions and accessibility
- **AND** document path setup prepares for dual-action synchronization workflow

### 📄 SharePoint Integration & Document Management

**AC19: SharePoint Integration Setup with Document Library Configuration**
- **GIVEN** a workspace configures SharePoint integration
- **WHEN** they provide SharePoint site and library information
- **THEN** the system validates access and displays available document libraries
- **AND** users can select target libraries for different document types
- **AND** SharePoint permissions are validated for upload, modify, and manage operations
- **AND** document library configuration includes metadata mapping for BMad v6 artifacts

**AC20: SharePoint Authentication Validation**
- **GIVEN** SharePoint credentials are provided
- **WHEN** the system validates authentication
- **THEN** it tests document operations (list, upload, download, modify)
- **AND** authentication validation includes permission level assessment
- **AND** any authentication issues provide clear resolution guidance
- **AND** successful validation enables document synchronization capabilities

### 📊 Ignis Platform Connection & Telemetry Setup

**AC21: Ignis Platform Connection Configuration**
- **GIVEN** a workspace configures Ignis Platform integration
- **WHEN** they provide endpoint and authentication information
- **THEN** the system validates connection and tests telemetry transmission
- **AND** telemetry configuration includes data type selection and transmission frequency
- **AND** connection validation includes rate limit testing and error handling
- **AND** Ignis Platform setup prepares for comprehensive analytics and monitoring

**AC22: Data Transmission Testing & Validation**
- **GIVEN** Ignis Platform connection is configured
- **WHEN** the system performs transmission testing
- **THEN** it sends test telemetry data and validates successful receipt
- **AND** transmission testing includes error handling and retry mechanism validation
- **AND** data format and structure compliance is verified
- **AND** transmission performance is benchmarked for ongoing monitoring

### ✅ Configuration Validation & Phase Completion

**AC23: Comprehensive Connectivity Testing**
- **GIVEN** all workspace integrations are configured (Greenfield or Brownfield)
- **WHEN** the user initiates comprehensive validation
- **THEN** the system tests all connections simultaneously (GitHub dual-action sync, SharePoint, Ignis Platform)
- **AND** validation results are presented with clear success/failure indicators
- **AND** any failed validations include specific troubleshooting guidance
- **AND** partial configuration success allows users to proceed with warnings

**AC24: Integration Verification & Health Monitoring**
- **GIVEN** configuration validation is complete
- **WHEN** the system verifies integration health
- **THEN** it establishes ongoing monitoring for all configured integrations
- **AND** integration status is displayed with real-time health indicators
- **AND** any integration issues trigger alerts and resolution guidance
- **AND** dual-action sync status shows working branch and main branch health
- **AND** integration verification prepares for seamless workflow execution

**AC25: Automatic Phase Progression Detection**
- **GIVEN** all workspace configuration requirements are met (Greenfield or Brownfield complete)
- **WHEN** the system detects completion criteria
- **THEN** it automatically enables progression to the Ideation phase
- **AND** phase completion includes validation of all required integrations and dual-action sync setup
- **AND** users receive clear confirmation of successful workspace configuration
- **AND** phase transition preserves all configuration data, workspace metadata, and branch settings

## 🛠️ Technical Implementation Details

### Technology Stack
- **Frontend:** React 18+ with guided workflow UI, progress indicators, Greenfield/Brownfield selection
- **Backend:** Node.js Fastify with async/await, integration validation services, GitHub API integration
- **Database:** PostgreSQL 15 for workspace configuration, Redis 7 for validation caching
- **Integration:** GitHub API v4, SharePoint API (Graph), Ignis Platform OTLP

### API Endpoints Required
```typescript
// Workspace creation and configuration
POST   /api/v1/workspaces                           // Create new workspace (Greenfield or Brownfield)
GET    /api/v1/workspaces/{workspaceId}/config      // Get workspace configuration
PUT    /api/v1/workspaces/{workspaceId}/config      // Update workspace configuration

// Greenfield workflow endpoints (using MCP server for GitHub operations)
POST   /api/v1/workspaces/{workspaceId}/greenfield/repo-create  // Step 1: Create GitHub repo via MCP server
POST   /api/v1/workspaces/{workspaceId}/greenfield/users-config // Step 2: Configure users
POST   /api/v1/workspaces/{workspaceId}/greenfield/bmad-install // Step 3: Install BMad framework via MCP file operations
POST   /api/v1/workspaces/{workspaceId}/greenfield/workflow-init // Step 4: Initialize workflows
POST   /api/v1/workspaces/{workspaceId}/greenfield/branch-create // Step 5: Create working branch via MCP server
POST   /api/v1/workspaces/{workspaceId}/greenfield/metadata-update // Step 6: Update metadata

// Brownfield workflow endpoints (using MCP server for repository operations)
POST   /api/v1/workspaces/{workspaceId}/brownfield/repo-validate // Step 1: Validate existing repo via MCP server
POST   /api/v1/workspaces/{workspaceId}/brownfield/bmad-setup    // Step 2: Add BMad framework via MCP file operations
POST   /api/v1/workspaces/{workspaceId}/brownfield/workflow-config // Step 3: Configure workflows
POST   /api/v1/workspaces/{workspaceId}/brownfield/branch-create // Step 4: Create working branch via MCP server

// Integration configuration
POST   /api/v1/workspaces/{workspaceId}/config/github           // Configure GitHub dual-action sync
POST   /api/v1/workspaces/{workspaceId}/config/sharepoint       // Configure SharePoint integration
POST   /api/v1/workspaces/{workspaceId}/config/ignis           // Configure Ignis Platform integration
POST   /api/v1/workspaces/{workspaceId}/config/validate        // Validate all configurations
GET    /api/v1/workspaces/{workspaceId}/config/status          // Get configuration status
POST   /api/v1/workspaces/{workspaceId}/phases/complete        // Complete current phase
```

### Database Schema Requirements
```sql
-- Project configuration tracking
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  current_phase VARCHAR(50) DEFAULT 'configuration',
  phase_progress JSONB DEFAULT '{}',
  github_config JSONB,
  sharepoint_config JSONB,
  ignis_config JSONB,
  configuration_status VARCHAR(50) DEFAULT 'incomplete',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Phase progression tracking
CREATE TABLE phase_progressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  from_phase VARCHAR(50),
  to_phase VARCHAR(50) NOT NULL,
  completion_criteria JSONB,
  completion_timestamp TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

-- Configuration validation history
CREATE TABLE configuration_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  validation_type VARCHAR(50) NOT NULL, -- 'github', 'sharepoint', 'ignis', 'comprehensive'
  validation_status VARCHAR(20) NOT NULL, -- 'success', 'failure', 'warning'
  validation_details JSONB,
  validated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing Requirements

### Unit Tests
- Guided workflow progression logic and step validation
- Integration configuration validation for all service types
- Phase completion detection and automatic progression
- Configuration persistence and retrieval operations
- Error handling for integration failures and network issues

### Integration Tests
- End-to-end Configuration phase workflow completion
- Real integration testing with GitHub, SharePoint, and Ignis Platform
- Configuration validation with actual external services
- Phase progression with proper state management
- Error recovery and retry mechanisms for failed configurations

### User Acceptance Tests
- Project managers can complete Configuration phase in under 15 minutes
- Non-technical users understand and follow guided workflow
- All integration validations provide clear feedback and guidance
- Configuration errors are resolved with provided troubleshooting steps
- Phase completion automatically enables Ideation phase access

## 📊 Success Metrics & Validation

### POC Success Criteria
- **95% configuration completion:** Users successfully complete Configuration phase
- **Sub-15-minute setup:** Complete Configuration phase workflow in under 15 minutes
- **90% validation success:** Integration validations pass on first attempt
- **100% phase progression:** Successful configurations enable automatic phase progression

### Performance Requirements
- Configuration step transitions: < 1 second
- Integration validation: < 5 seconds per service
- Comprehensive validation: < 10 seconds for all integrations
- Phase completion detection: < 2 seconds

## 🔗 Dependencies & Integration Points

### External Dependencies
- **GitHub API:** Repository access, branch listing, permission validation
- **SharePoint API:** Document library access, authentication validation
- **Ignis Platform API:** Connection testing, telemetry transmission validation
- **BMad v6 Framework:** Phase definitions and completion criteria

### Internal Dependencies
- **Story 1.3:** External service configuration provides foundation for project-level setup
- **Story 2.1:** Agent selection engine provides Configuration phase agent recommendations
- **Story 2.3:** Successful Configuration phase enables Ideation phase access

## 🚨 Risk Assessment & Mitigation

### High-Risk Areas
1. **Integration Complexity:** Multiple external service configurations could overwhelm users
   - **Mitigation:** Clear step-by-step guidance, progress saving, comprehensive help documentation

2. **Validation Failures:** External service issues could block Configuration phase completion
   - **Mitigation:** Robust error handling, retry mechanisms, partial completion options

3. **User Experience:** Complex configuration could frustrate non-technical users
   - **Mitigation:** Guided workflow, clear explanations, contextual help, user testing

### Rollback Plan
- Implement configuration step rollback capabilities
- Maintain configuration history for easy restoration
- Provide manual configuration override options
- Database backup and restore procedures for project configurations

## ✅ Definition of Done

- [ ] All acceptance criteria verified through testing
- [ ] Unit test coverage > 90% for configuration workflow logic
- [ ] Integration tests pass with real external services
- [ ] User acceptance testing completed with 3+ project managers
- [ ] Performance benchmarks met for all configuration operations
- [ ] Error handling tested for all integration failure scenarios
- [ ] Documentation updated for Configuration phase workflow
- [ ] Monitoring implemented for configuration success rates
- [ ] Code review completed and approved by workflow experts
- [ ] Phase progression logic validated with BMad v6 methodology experts

## 📝 Notes
- Configuration phase success is critical for all subsequent workflow phases
- Integration setup patterns established here will be reused throughout POC
- Guided workflow approach validates BMad v6 methodology accessibility for non-technical users
- Automatic phase progression demonstrates intelligent workflow orchestration capabilities
