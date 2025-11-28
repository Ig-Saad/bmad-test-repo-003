// BMad v6 Core Types
export enum BMadTrack {
  QUICK_FLOW = 'QUICK_FLOW',
  BMAD_METHOD = 'BMAD_METHOD',
  BROWNFIELD = 'BROWNFIELD'
}

export enum BMadPhase {
  ANALYSIS = 'ANALYSIS',
  PLANNING = 'PLANNING',
  SOLUTIONING = 'SOLUTIONING',
  IMPLEMENTATION = 'IMPLEMENTATION'
}

export enum AgentType {
  ANALYST = 'ANALYST',
  ARCHITECT = 'ARCHITECT',
  PM = 'PM',
  SM = 'SM',
  UX_DESIGNER = 'UX_DESIGNER',
  DEV = 'DEV',
  TEA = 'TEA',
  TECH_WRITER = 'TECH_WRITER'
}

// User & Authentication Types
export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  STAKEHOLDER = 'STAKEHOLDER',
  VIEWER = 'VIEWER'
}

export enum ProjectRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  azureId: string;
  email: string;
  name: string;
  givenName?: string;
  surname?: string;
  avatarUrl?: string;
  tenantId: string;
  role: UserRole;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTrack: BMadTrack;
  notifications: {
    email: boolean;
    inApp: boolean;
    agentUpdates: boolean;
    phaseTransitions: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    showMetrics: boolean;
    defaultView: 'projects' | 'tasks' | 'agents';
  };
}

// Project Types
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  selectedTrack: BMadTrack;
  complexityScore: number;
  currentPhase: BMadPhase;
  phaseProgress?: PhaseProgress[];
  githubConfig?: GitHubConfig;
  sharepointConfig?: SharePointConfig;
  ignisConfig?: IgnisConfig;
  activeAgents?: string[];
  contextData?: ProjectContext;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
}

export interface PhaseProgress {
  phase: BMadPhase;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  artifacts: string[]; // Artifact IDs
  agentEngagements: string[]; // Agent engagement IDs
}

export interface ProjectContext {
  businessDomain: string;
  technicalComplexity: 'low' | 'medium' | 'high' | 'enterprise';
  teamSize: number;
  timeline: string;
  constraints: string[];
  stakeholders: string[];
  success_criteria: string[];
}

// Integration Configuration Types
export interface GitHubConfig {
  owner: string;
  repository: string;
  branch: string;
  token: string; // Encrypted
  syncEnabled: boolean;
  autoSync: boolean;
  webhookUrl?: string;
}

export interface SharePointConfig {
  tenantId: string;
  siteId: string;
  driveId: string;
  syncEnabled: boolean;
  autoSync: boolean;
}

export interface IgnisConfig {
  endpoint: string;
  apiKey: string; // Encrypted
  projectId: string;
  syncEnabled: boolean;
}

// Artifact Types
export enum ArtifactType {
  PROJECT_BRIEF = 'PROJECT_BRIEF',
  PRD = 'PRD',
  ARCHITECTURE = 'ARCHITECTURE',
  USER_STORIES = 'USER_STORIES',
  TEST_PLAN = 'TEST_PLAN',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  BUSINESS_CASE = 'BUSINESS_CASE',
  TRAINING_MATERIAL = 'TRAINING_MATERIAL'
}

export interface Artifact {
  id: string;
  projectId: string;
  name: string;
  type: ArtifactType;
  phase: BMadPhase;
  content: string;
  metadata?: ArtifactMetadata;
  version: number;
  githubSynced: boolean;
  sharepointSynced: boolean;
  syncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtifactMetadata {
  templateVersion: string;
  agentGenerated: boolean;
  reviewRequired: boolean;
  stakeholderApproval: boolean;
  tags: string[];
  references: string[]; // Related artifact IDs
}

// Agent & Workflow Types
export interface AgentEngagement {
  id: string;
  projectId: string;
  agentId: string;
  agentName: string;
  phase: BMadPhase;
  context?: AgentContext;
  startedAt: Date;
  endedAt?: Date;
}

export interface AgentContext {
  conversationHistory: ConversationMessage[];
  workflowState: Record<string, any>;
  artifacts: string[]; // Artifact IDs worked on
  decisions: AgentDecision[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentDecision {
  id: string;
  decision: string;
  reasoning: string;
  alternatives: string[];
  confidence: number; // 0-100
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Telemetry Types
export interface TelemetryEvent {
  id: string;
  eventType: string;
  projectId?: string;
  userId?: string;
  agentId?: string;
  data?: Record<string, any>;
  timestamp: Date;
}