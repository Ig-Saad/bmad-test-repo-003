# Database ERD Generation Guide

## Overview
This directory contains multiple formats of the Entity Relationship Diagram (ERD) for the BMAD Web Platform database schema.

## Files Generated

### 1. `database-erd.md`
- **Format**: Markdown with Mermaid diagram
- **Use Case**: Documentation, GitHub README, technical specs
- **Viewing**: GitHub, GitLab, or any Mermaid-compatible viewer
- **Features**: Embedded diagram with detailed descriptions

### 2. `complete-database-schema.sql`
- **Format**: Complete PostgreSQL DDL
- **Use Case**: Database creation, migration scripts
- **Features**: 
  - All tables including the missing `project_members` table
  - Indexes for performance
  - Row Level Security (RLS) policies
  - Constraints and foreign keys

### 3. `database-erd-dbdiagram.dbml`
- **Format**: DBML (Database Markup Language)
- **Use Case**: Visual ERD generation
- **Tool**: https://dbdiagram.io/
- **Features**: Interactive, exportable diagrams

## How to Generate Visual ERDs

### Option 1: Using dbdiagram.io (Recommended)
1. Go to https://dbdiagram.io/
2. Copy the content from `database-erd-dbdiagram.dbml`
3. Paste into the editor
4. The visual ERD will generate automatically
5. Export as PNG, PDF, or SQL

### Option 2: Using Mermaid
1. Copy the Mermaid diagram from `database-erd.md`
2. Use any Mermaid viewer:
   - GitHub (renders automatically)
   - https://mermaid.live/
   - VS Code with Mermaid extension
   - Notion, Obsidian, etc.

### Option 3: Using Database Tools
1. Import `complete-database-schema.sql` into:
   - DBeaver (has built-in ERD generation)
   - pgAdmin
   - DataGrip
   - Any PostgreSQL client with ERD features

## Database Schema Summary

### Core Tables
- **users**: User accounts with OAuth integration
- **projects**: Document workspaces
- **project_members**: User-project many-to-many relationships
- **documents**: Multi-format document entities
- **document_versions**: Version history and format storage

### Key Features
- **Multi-tenant security** with Row Level Security
- **Multi-format document support** (Markdown, DOCX, PDF, Figma, etc.)
- **Version tracking** for all document formats
- **OAuth integration** for GitHub and Figma
- **Flexible metadata** storage using JSONB

### Relationships
- Users own projects (1:many)
- Users are members of projects (many:many via project_members)
- Projects contain documents (1:many)
- Documents have versions (1:many)
- Users create documents and versions (1:many)

## Missing Table Note
The original schema in `docs/architecture.md` referenced a `project_members` table in RLS policies but didn't define it. This has been added to complete the schema with:
- Many-to-many relationship between users and projects
- Role-based project access (admin, editor, viewer, member)
- Proper foreign key constraints and indexes

## Security Features
- Row Level Security (RLS) on all main tables
- Multi-tenant data isolation
- Encrypted OAuth token storage
- Audit trails with timestamps

## Performance Optimizations
- Strategic indexes on foreign keys
- Composite indexes for common queries
- JSONB for flexible metadata storage
- UUID primary keys for distributed systems
