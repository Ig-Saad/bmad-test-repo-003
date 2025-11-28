-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'STAKEHOLDER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BMadTrack" AS ENUM ('QUICK_FLOW', 'BMAD_METHOD', 'BROWNFIELD');

-- CreateEnum
CREATE TYPE "BMadPhase" AS ENUM ('ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('PROJECT_BRIEF', 'PRD', 'ARCHITECTURE', 'USER_STORIES', 'TEST_PLAN', 'MARKET_RESEARCH', 'BUSINESS_CASE', 'TRAINING_MATERIAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "azure_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "given_name" TEXT,
    "surname" TEXT,
    "avatar_url" TEXT,
    "tenant_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAKEHOLDER',
    "preferences" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "selected_track" "BMadTrack" NOT NULL DEFAULT 'QUICK_FLOW',
    "complexity_score" INTEGER NOT NULL DEFAULT 0,
    "current_phase" "BMadPhase" NOT NULL DEFAULT 'ANALYSIS',
    "phase_progress" JSONB,
    "github_config" JSONB,
    "sharepoint_config" JSONB,
    "ignis_config" JSONB,
    "active_agents" JSONB,
    "context_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_activity_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_users" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artifacts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "phase" "BMadPhase" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "github_synced" BOOLEAN NOT NULL DEFAULT false,
    "sharepoint_synced" BOOLEAN NOT NULL DEFAULT false,
    "synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_engagements" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "phase" "BMadPhase" NOT NULL,
    "context" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "agent_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codebase_configs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "github_config" JSONB,
    "sharepoint_config" JSONB,
    "ignis_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codebase_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bmad_workflow_instances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT,
    "workflow_type" TEXT NOT NULL,
    "current_phase" TEXT NOT NULL,
    "phase_progress" JSONB NOT NULL DEFAULT '{}',
    "workflow_state" JSONB NOT NULL DEFAULT '{}',
    "active_agents" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bmad_workflow_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bmad_agent_interactions" (
    "id" TEXT NOT NULL,
    "workflow_instance_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "interaction_data" JSONB,
    "response_time_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bmad_agent_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bmad_template_usage" (
    "id" TEXT NOT NULL,
    "workflow_instance_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "template_type" TEXT NOT NULL,
    "usage_context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bmad_template_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "project_id" TEXT,
    "user_id" TEXT,
    "agent_id" TEXT,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_azure_id_key" ON "users"("azure_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_users_project_id_user_id_key" ON "project_users"("project_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "codebase_configs_tenant_id_key" ON "codebase_configs"("tenant_id");

-- AddForeignKey
ALTER TABLE "project_users" ADD CONSTRAINT "project_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_users" ADD CONSTRAINT "project_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bmad_workflow_instances" ADD CONSTRAINT "bmad_workflow_instances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bmad_agent_interactions" ADD CONSTRAINT "bmad_agent_interactions_workflow_instance_id_fkey" FOREIGN KEY ("workflow_instance_id") REFERENCES "bmad_workflow_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bmad_template_usage" ADD CONSTRAINT "bmad_template_usage_workflow_instance_id_fkey" FOREIGN KEY ("workflow_instance_id") REFERENCES "bmad_workflow_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
