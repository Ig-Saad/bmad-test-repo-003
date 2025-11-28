import { z } from 'zod';
import { VALIDATION_RULES } from '../constants';

// User Validation Schemas
export const UserSchema = z.object({
  id: z.string().cuid(),
  azureId: z.string().min(1, 'Azure ID is required'),
  email: z.string().regex(VALIDATION_RULES.USER_EMAIL.PATTERN, 'Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  givenName: z.string().optional(),
  surname: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'STAKEHOLDER', 'VIEWER']),
  preferences: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional()
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  azureId: true,
  createdAt: true,
  updatedAt: true
});

// Project Validation Schemas
export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string()
    .min(VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH, `Name must be at least ${VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH, `Name must be at most ${VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH} characters`)
    .regex(VALIDATION_RULES.PROJECT_NAME.PATTERN, 'Name contains invalid characters'),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']),
  selectedTrack: z.enum(['QUICK_FLOW', 'BMAD_METHOD', 'BROWNFIELD']),
  complexityScore: z.number().min(0).max(100),
  currentPhase: z.enum(['ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION']),
  phaseProgress: z.array(z.record(z.any())).optional(),
  githubConfig: z.record(z.any()).optional(),
  sharepointConfig: z.record(z.any()).optional(),
  ignisConfig: z.record(z.any()).optional(),
  activeAgents: z.array(z.string()).optional(),
  contextData: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastActivityAt: z.date().optional()
});

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivityAt: true
}).partial({
  status: true,
  selectedTrack: true,
  complexityScore: true,
  currentPhase: true
});

export const UpdateProjectSchema = ProjectSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Artifact Validation Schemas
export const ArtifactSchema = z.object({
  id: z.string().cuid(),
  projectId: z.string().cuid(),
  name: z.string()
    .min(VALIDATION_RULES.ARTIFACT_NAME.MIN_LENGTH, 'Name is required')
    .max(VALIDATION_RULES.ARTIFACT_NAME.MAX_LENGTH, 'Name is too long')
    .regex(VALIDATION_RULES.ARTIFACT_NAME.PATTERN, 'Name contains invalid characters'),
  type: z.enum(['PROJECT_BRIEF', 'PRD', 'ARCHITECTURE', 'USER_STORIES', 'TEST_PLAN', 'MARKET_RESEARCH', 'BUSINESS_CASE', 'TRAINING_MATERIAL']),
  phase: z.enum(['ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION']),
  content: z.string().min(1, 'Content is required'),
  metadata: z.record(z.any()).optional(),
  version: z.number().positive(),
  githubSynced: z.boolean(),
  sharepointSynced: z.boolean(),
  syncedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateArtifactSchema = ArtifactSchema.omit({
  id: true,
  version: true,
  githubSynced: true,
  sharepointSynced: true,
  syncedAt: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateArtifactSchema = ArtifactSchema.partial().omit({
  id: true,
  projectId: true,
  createdAt: true,
  updatedAt: true
});

// Agent Engagement Validation Schemas
export const AgentEngagementSchema = z.object({
  id: z.string().cuid(),
  projectId: z.string().cuid(),
  agentId: z.string().min(1, 'Agent ID is required'),
  agentName: z.string().min(1, 'Agent name is required'),
  phase: z.enum(['ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION']),
  context: z.record(z.any()).optional(),
  startedAt: z.date(),
  endedAt: z.date().optional()
});

export const CreateAgentEngagementSchema = AgentEngagementSchema.omit({
  id: true,
  startedAt: true,
  endedAt: true
});

// API Request/Response Schemas
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

export const ProjectQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(['DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  track: z.enum(['QUICK_FLOW', 'BMAD_METHOD', 'BROWNFIELD']).optional(),
  phase: z.enum(['ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION']).optional(),
  search: z.string().optional()
});

export const ArtifactQuerySchema = PaginationQuerySchema.extend({
  projectId: z.string().cuid().optional(),
  type: z.enum(['PROJECT_BRIEF', 'PRD', 'ARCHITECTURE', 'USER_STORIES', 'TEST_PLAN', 'MARKET_RESEARCH', 'BUSINESS_CASE', 'TRAINING_MATERIAL']).optional(),
  phase: z.enum(['ANALYSIS', 'PLANNING', 'SOLUTIONING', 'IMPLEMENTATION']).optional(),
  search: z.string().optional()
});

// Authentication Schemas
export const LoginRequestSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  idToken: z.string().min(1, 'ID token is required'),
  account: z.object({
    homeAccountId: z.string(),
    environment: z.string(),
    tenantId: z.string(),
    username: z.string(),
    localAccountId: z.string(),
    name: z.string().optional(),
    idTokenClaims: z.record(z.any()).optional()
  })
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Error Schema
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
  timestamp: z.date()
});

// Telemetry Schemas
export const TelemetryEventSchema = z.object({
  id: z.string().cuid(),
  eventType: z.string().min(1, 'Event type is required'),
  projectId: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
  agentId: z.string().optional(),
  data: z.record(z.any()).optional(),
  timestamp: z.date()
});

export const CreateTelemetryEventSchema = TelemetryEventSchema.omit({
  id: true,
  timestamp: true
});

// Integration Configuration Schemas
export const GitHubConfigSchema = z.object({
  owner: z.string().min(1, 'GitHub owner is required'),
  repository: z.string().min(1, 'GitHub repository is required'),
  branch: z.string().min(1, 'GitHub branch is required'),
  token: z.string().min(1, 'GitHub token is required'),
  syncEnabled: z.boolean().default(false),
  autoSync: z.boolean().default(false),
  webhookUrl: z.string().url().optional()
});

export const SharePointConfigSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  siteId: z.string().min(1, 'Site ID is required'),
  driveId: z.string().min(1, 'Drive ID is required'),
  syncEnabled: z.boolean().default(false),
  autoSync: z.boolean().default(false)
});

export const IgnisConfigSchema = z.object({
  endpoint: z.string().url('Invalid Ignis endpoint URL'),
  apiKey: z.string().min(1, 'Ignis API key is required'),
  projectId: z.string().min(1, 'Ignis project ID is required'),
  syncEnabled: z.boolean().default(false)
});

// Utility function to validate and parse data
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Type inference helpers
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;

export type Artifact = z.infer<typeof ArtifactSchema>;
export type CreateArtifact = z.infer<typeof CreateArtifactSchema>;
export type UpdateArtifact = z.infer<typeof UpdateArtifactSchema>;

export type AgentEngagement = z.infer<typeof AgentEngagementSchema>;
export type CreateAgentEngagement = z.infer<typeof CreateAgentEngagementSchema>;

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
export type ArtifactQuery = z.infer<typeof ArtifactQuerySchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;
export type CreateTelemetryEvent = z.infer<typeof CreateTelemetryEventSchema>;

export type GitHubConfig = z.infer<typeof GitHubConfigSchema>;
export type SharePointConfig = z.infer<typeof SharePointConfigSchema>;
export type IgnisConfig = z.infer<typeof IgnisConfigSchema>;