-- BMAD Web Platform - Complete Database Schema
-- PostgreSQL with Supabase Extensions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with authentication and integration tokens
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    github_username VARCHAR(255),
    github_access_token TEXT, -- Encrypted
    figma_access_token TEXT,  -- Encrypted
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Project members table for many-to-many user-project relationships
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'viewer', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
    content_url TEXT NOT NULL, -- Supabase Storage URL
    file_size BIGINT NOT NULL,
    conversion_metadata JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, version_number, format)
);

-- Indexes for performance optimization
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_sync_status ON documents(sync_status);
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_created_by ON document_versions(created_by);

-- Row Level Security for multi-tenant security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for secure access control
CREATE POLICY "Users can view projects they own or are members of" ON projects
    FOR SELECT USING (
        owner_id = auth.uid() OR
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can view documents in accessible projects" ON documents
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE
            owner_id = auth.uid() OR
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Users can view project memberships for accessible projects" ON project_members
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE
            owner_id = auth.uid() OR
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Users can view document versions for accessible documents" ON document_versions
    FOR SELECT USING (
        document_id IN (
            SELECT id FROM documents WHERE
            project_id IN (
                SELECT id FROM projects WHERE
                owner_id = auth.uid() OR
                id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
            )
        )
    );
