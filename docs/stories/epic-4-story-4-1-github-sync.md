# Story 4.1: Dual-Action GitHub Synchronization (Save & Publish Workflows)

## Story Classification
- **Epic:** Epic 4 - Strategic Integration Validation
- **Priority:** P0 (Critical - Development workflow integration)
- **Complexity:** High (7-9 days)
- **Dependencies:** Story 1.3 (External Service Configuration), Story 3.1 (Document Generation)

## User Story

**As a** product manager or developer working in the **Upstream SDLC Orchestration Platform**,
**I want** **dual-action GitHub synchronization** with separate Save and Publish workflows,
**So that** I can iteratively save my work to a working branch without affecting the main branch, and then publish completed work with diff review to merge changes to main, enabling seamless handoff to development teams for downstream implementation in BMad v6 IDE workflows.

## Story Context & Business Value

**POC Validation Goals:**
- Demonstrate **dual-action synchronization** model (Save: working branch only, Publish: merge to main)
- Validate diff visualization before merging to main branch (future: accept/reject individual diffs)
- Prove seamless integration between upstream web platform and downstream BMad v6 IDE workflows
- Establish clear boundary between upstream orchestration (web) and downstream development (IDE)
- Validate workspace terminology throughout synchronization workflows (workspace = project)

**User Personas:**
- **Primary:** Non-technical stakeholders working on upstream artifacts who need iterative saves
- **Secondary:** Development teams receiving specifications for downstream implementation in BMad v6 IDE
- **Tertiary:** Technical leads managing workflow handoff from upstream planning to downstream development

## Detailed Acceptance Criteria

### � Save Action - Working Branch Persistence

**AC1: Save Action to Working Branch (Iterative Work)**
- **GIVEN** a user modifies workspace artifacts in the web platform
- **WHEN** they trigger the **Save action**
- **THEN** the system commits and pushes changes to the **working branch only** (not main)
- **AND** Save action completes within **5 seconds** (SLA target)
- **AND** working branch commit includes proper commit message with artifact metadata
- **AND** save tracking updates last_save_commit SHA and pending_changes_count
- **AND** user receives confirmation with commit SHA and files changed count
- **AND** workspace state reflects "saved but not published" status

**AC2: Working Branch Management and Tracking**
- **GIVEN** a workspace has been configured with GitHub integration
- **WHEN** Save actions are performed
- **THEN** the system maintains a dedicated working branch separate from main
- **AND** working branch name follows convention (e.g., "workspace/{workspace-id}" or user-configured)
- **AND** all Save actions accumulate in working branch without affecting main
- **AND** workspace metadata tracks working branch name, last save commit, and pending changes count
- **AND** users can view working branch status and pending changes list

### 📤 Publish Action - Merge to Main with Diff Visualization

**AC3: Publish Action with Diff Visualization**
- **GIVEN** a user has saved changes to working branch and wants to publish
- **WHEN** they trigger the **Publish action**
- **THEN** the system generates **diff visualization** showing all changes (files added, modified, deleted)
- **AND** diff summary displays total changes count and detailed file list
- **AND** user can review diff before confirming publish
- **AND** Publish action commits any unsaved changes to working branch first
- **AND** Publish action then **merges working branch to main branch**
- **AND** Publish action completes within **15 seconds** (SLA target)
- **AND** workspace metadata updates last_publish_commit SHA and resets pending_changes_count to 0

**AC4: Future Enhancement - Accept/Reject Individual Diffs**
- **GIVEN** this is a POC with future enhancement noted
- **WHEN** diff visualization is displayed
- **THEN** the current POC shows complete diff for review (no selective accept/reject)
- **AND** architecture supports future enhancement to accept/reject individual file diffs
- **AND** documentation notes this planned capability for post-POC development
- **AND** data model supports tracking partial publishes in future iterations

### 🔄 Workspace Terminology Throughout

**AC5: Workspace Terminology in Synchronization APIs and UI**
- **GIVEN** the platform clarifies project = workspace
- **WHEN** displaying synchronization UI and API responses
- **THEN** all references use "workspace" terminology consistently
- **AND** API endpoints use `/workspaces/{workspaceId}/save` and `/workspaces/{workspaceId}/publish`
- **AND** GitHub commit messages reference "workspace" not "project"
- **AND** repository folder structure uses "workspaces/" or configurable naming
- **AND** user-facing messages clarify "workspace (project)" where helpful for transition

### 📁 Repository Structure Management & Organization

**AC6: Repository Structure Management with BMad v6 Methodology Compliance**
- **GIVEN** workspace artifacts need to be organized in the GitHub repository
- **WHEN** synchronization creates or updates repository structure
- **THEN** the system maintains proper folder organization following BMad v6 methodology standards
- **AND** repository structure includes appropriate folders for different artifact types (PRD, architecture, stories, etc.)
- **AND** folder organization supports both web platform upstream work and BMad v6 IDE downstream workflows
- **AND** structure management maintains consistency across different workspace types and phases

**AC7: Document Path Management with Configurable Organization**
- **GIVEN** different workspaces may require different repository organization approaches
- **WHEN** configuring document synchronization
- **THEN** the system allows configurable path management and folder structure customization
- **AND** path management supports enterprise repository standards and team preferences
- **AND** configurable organization maintains BMad v6 methodology compliance while allowing flexibility
- **AND** document paths are consistent and predictable for development team access

### 📝 Commit Management & Metadata Integration

**AC8: Commit Message Generation for Save and Publish Actions**
- **GIVEN** Save or Publish actions are executed
- **WHEN** the system creates commit messages
- **THEN** Save action generates messages like "Save: Updated PRD for workspace {name}"
- **AND** Publish action generates messages like "Publish: Merge workspace {name} changes to main"
- **AND** commit messages include workspace metadata, artifact types, and change summaries
- **AND** message generation follows conventional commit standards for searchability
- **AND** metadata integration includes workspace ID, phase information, and author details

**AC9: Change Attribution and Audit Trail Maintenance**
- **GIVEN** multiple users contribute to workspace changes
- **WHEN** synchronizing changes via Save or Publish actions
- **THEN** the system maintains proper change attribution with original author information
- **AND** audit trails track all Save and Publish actions with timestamps
- **AND** comprehensive change history preserved for compliance and tracking
- **AND** attribution accuracy ensures proper credit and responsibility across working branch and main

### 🌿 Branch Management & Workflow Integration

**AC7: Branch Management with Configurable Target Branches**
- **GIVEN** development teams use different branching strategies
**AC10: Working Branch and Main Branch Strategy**
- **GIVEN** workspace uses dual-action synchronization model
- **WHEN** configuring GitHub synchronization
- **THEN** the system maintains clear separation between working branch and main branch
- **AND** working branch is dedicated to Save actions (iterative work)
- **AND** main branch only receives changes via Publish action (merge from working branch)
- **AND** branch configuration allows custom working branch naming or default convention
- **AND** branch strategy supports team collaboration on working branch before publishing to main

**AC11: Merge Conflict Resolution During Publish**
- **GIVEN** Publish action encounters merge conflicts when merging working branch to main
- **WHEN** conflicts are detected
- **THEN** the system provides intelligent conflict resolution workflow
- **AND** conflict detection shows exactly which files conflict and why
- **AND** resolution options include manual merge, accept working branch, or accept main branch
- **AND** conflict resolution preserves BMad v6 template structure and methodology integrity
- **AND** successful resolution completes Publish action and updates main branch

### 📊 Synchronization Status & Monitoring

**AC12: Real-Time Save and Publish Status Tracking**
- **GIVEN** users perform Save or Publish actions
- **WHEN** monitoring synchronization progress
- **THEN** the system provides real-time status updates for both action types
- **AND** Save action status shows commit to working branch progress (<5s)
- **AND** Publish action status shows diff generation, merge, and completion progress (<15s)
- **AND** status displays last_save_commit SHA, last_publish_commit SHA, and pending_changes_count
- **AND** workspace UI clearly shows "saved but not published" vs "published" states

**AC13: Error Handling for Save and Publish Actions**
- **GIVEN** Save or Publish actions encounter errors
- **WHEN** integration issues occur
- **THEN** the system provides action-specific error handling and recovery
- **AND** Save action errors (network, auth, push failures) provide retry options without data loss
- **AND** Publish action errors (merge conflicts, push failures) rollback gracefully
- **AND** error messages clearly distinguish between Save failures and Publish failures
- **AND** recovery guidance specific to each action type

### ✅ Upstream to Downstream Workflow Handoff

**AC14: Downstream Handoff Validation for BMad v6 IDE**
- **GIVEN** workspace artifacts have been published to main branch
- **WHEN** validating handoff to downstream development in BMad v6 IDE
- **THEN** the system ensures seamless transition for implementation phase
- **AND** published artifacts in main branch are immediately accessible to BMad v6 IDE workflows
- **AND** artifact format, structure, and BMad v6 methodology compliance maintained
- **AND** development teams receive notification of published changes available for downstream work
- **AND** handoff includes clear indication: "Upstream planning complete, ready for downstream development"

**AC15: Development Team Access Verification**
- **GIVEN** published artifacts are in main branch
- **WHEN** development teams access through BMad v6 IDE workflows for downstream implementation
- **THEN** the system verifies proper access and workflow continuity
- **AND** access verification includes permission validation and artifact availability
- **AND** workflow continuity confirmed: upstream orchestration → downstream implementation handoff successful
- **AND** development teams can immediately begin implementation phase in BMad v6 IDE

## 🛠️ Technical Implementation Details

### Technology Stack
- **GitHub Integration:** GitHub API v4 (GraphQL), Octokit/PyGithub SDK
- **Version Control:** Git operations with dual-branch management, merge algorithms
- **Backend:** Node.js Fastify with async/await, GitHub integration services
- **Database:** PostgreSQL 15 with SQLAlchemy for sync state, Redis 7 for sync queue management

### API Endpoints Required
```typescript
// Dual-Action GitHub Synchronization
POST   /api/v1/workspaces/{workspaceId}/save           // Save action: commit to working branch (<5s SLA)
POST   /api/v1/workspaces/{workspaceId}/publish        // Publish action: merge to main with diff (<15s SLA)
GET    /api/v1/workspaces/{workspaceId}/pending-changes // Get pending changes (working vs main)
GET    /api/v1/workspaces/{workspaceId}/sync-history   // Get Save/Publish action history

// GitHub Configuration & Validation
PUT    /api/v1/workspaces/{workspaceId}/github/config  // Update GitHub sync configuration
POST   /api/v1/workspaces/{workspaceId}/github/validate // Validate repository access
GET    /api/v1/github/repositories                     // Get available repositories
GET    /api/v1/github/branches/{repoId}                // Get repository branches

// Conflict Resolution & Monitoring
POST   /api/v1/workspaces/{workspaceId}/publish/resolve // Resolve merge conflicts during Publish
GET    /api/v1/workspaces/{workspaceId}/sync/status    // Get real-time sync status
POST   /api/v1/github/webhook                          // Handle GitHub webhooks
```

### Database Schema Requirements
```sql
-- GitHub synchronization configuration with dual-action support
CREATE TABLE github_sync_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  repository_url VARCHAR(500) NOT NULL,
  repository_id VARCHAR(100) NOT NULL,
  target_branch VARCHAR(100) DEFAULT 'main',
  sync_frequency VARCHAR(50) DEFAULT 'manual', -- 'manual', 'auto', 'scheduled'
  folder_structure JSONB DEFAULT '{}',
  last_sync_commit VARCHAR(40),
  sync_status VARCHAR(50) DEFAULT 'configured',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Synchronization history and tracking
CREATE TABLE github_sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID REFERENCES github_sync_configs(id),
  sync_type VARCHAR(50) NOT NULL, -- 'push', 'pull', 'bidirectional'
  sync_status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'conflict'
  documents_synced INTEGER DEFAULT 0,
  conflicts_detected INTEGER DEFAULT 0,
  commit_hash VARCHAR(40),
  sync_details JSONB,
  error_message TEXT,
  sync_duration_ms INTEGER,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Merge conflict tracking and resolution
CREATE TABLE github_merge_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_history_id UUID REFERENCES github_sync_history(id),
  document_path VARCHAR(500) NOT NULL,
  conflict_type VARCHAR(50) NOT NULL, -- 'content', 'structure', 'metadata'
  local_content TEXT,
  remote_content TEXT,
  resolution_strategy VARCHAR(50), -- 'manual', 'local_wins', 'remote_wins', 'merged'
  resolved_content TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing Requirements

### Unit Tests
- GitHub API integration with repository operations and authentication
- Bidirectional synchronization logic with conflict detection and resolution
- Repository structure management and folder organization
- Commit message generation with metadata integration
- Branch management and merge conflict resolution algorithms

### Integration Tests
- End-to-end GitHub synchronization with real repositories
- Bidirectional sync testing with simultaneous changes from both sources
- Merge conflict resolution with various conflict scenarios
- Repository structure validation with BMad v6 methodology compliance
- Webhook handling for external repository changes

### User Acceptance Tests
- Development teams can access synchronized documents through BMad v6 IDE workflows
- Synchronization maintains document integrity and BMad v6 template structure
- Conflict resolution provides clear options and maintains document quality
- Repository organization follows team standards and methodology requirements
- Workflow handoff enables seamless development team transition

## 📊 Success Metrics & Validation

### POC Success Criteria
- **100% sync reliability:** All document changes synchronize successfully without data loss
- **95% conflict resolution:** Merge conflicts are resolved without document corruption
- **Sub-30-second sync:** Document synchronization completes within acceptable timeframes
- **100% workflow continuity:** Development teams can proceed with BMad v6 IDE workflows

### Performance Requirements
- Document synchronization: < 30 seconds for typical project documents
- Conflict detection and resolution: < 10 seconds for standard conflicts
- Repository structure validation: < 5 seconds
- Sync status updates: Real-time with < 2-second latency

## 🔗 Dependencies & Integration Points

### External Dependencies
- **GitHub API:** Repository access, commit operations, webhook handling
- **Git Operations:** Version control, merge algorithms, conflict resolution
- **BMad v6 IDE:** Workflow compatibility and document format requirements

### Internal Dependencies
- **Story 1.3:** External service configuration provides GitHub repository connection
- **Story 3.1:** Document generation provides content for synchronization
- **Authentication:** GitHub OAuth for repository access (configured after MSAL primary authentication)

## 🚨 Risk Assessment & Mitigation

### High-Risk Areas
1. **Data Loss During Sync:** Synchronization failures could result in document loss or corruption
   - **Mitigation:** Comprehensive backup, transaction rollback, conflict resolution validation

2. **Merge Conflict Complexity:** Complex conflicts could be difficult to resolve automatically
   - **Mitigation:** Intelligent conflict detection, manual resolution options, expert validation

3. **Repository Access Issues:** Authentication or permission problems could block synchronization
   - **Mitigation:** Robust error handling, permission validation, fallback access methods

### Rollback Plan
- Implement synchronization rollback capabilities for failed operations
- Maintain local document backups before synchronization attempts
- Database rollback scripts for synchronization state and history
- Manual document export options for emergency access

## ✅ Definition of Done

- [ ] All acceptance criteria verified through testing
- [ ] Unit test coverage > 90% for GitHub integration and synchronization logic
- [ ] Integration tests pass with real GitHub repositories and BMad v6 IDE workflows
- [ ] User acceptance testing completed with 3+ development teams
- [ ] Performance benchmarks met for all synchronization operations
- [ ] Conflict resolution tested with various merge scenarios
- [ ] Error handling tested for all GitHub API and network failure scenarios
- [ ] Documentation updated for GitHub synchronization setup and troubleshooting
- [ ] Monitoring implemented for synchronization success rates and performance
- [ ] Code review completed and approved by GitHub integration and workflow experts

## 📝 Notes
- GitHub synchronization success is critical for development team adoption
- Bidirectional sync reliability directly impacts workflow continuity and team productivity
- Merge conflict resolution quality affects document integrity and development efficiency
- BMad v6 IDE integration validation ensures seamless workflow handoff and methodology preservation
