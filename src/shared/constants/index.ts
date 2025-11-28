// BMad v6 Platform Constants
export const PLATFORM_CONFIG = {
  NAME: 'BMad v6-Powered SDLC Platform',
  VERSION: '1.0.0',
  API_VERSION: 'v1'
} as const;

// Server Configuration
export const SERVER_CONFIG = {
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: 'localhost',
  REQUEST_TIMEOUT: 30000,
  MAX_REQUEST_SIZE: '10mb'
} as const;

// Authentication & JWT
export const AUTH_CONFIG = {
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  SESSION_COOKIE_NAME: 'bmad-session',
  CSRF_TOKEN_NAME: 'bmad-csrf'
} as const;

// EntraID/Azure AD Configuration
export const ENTRAID_CONFIG = {
  AUTHORITY_BASE: 'https://login.microsoftonline.com',
  GRAPH_BASE_URL: 'https://graph.microsoft.com/v1.0',
  SCOPES: {
    USER_READ: 'User.Read',
    PROFILE: 'profile',
    OPENID: 'openid',
    EMAIL: 'email'
  }
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  QUERY_TIMEOUT: 30000,
  POOL_MIN: 2,
  POOL_MAX: 10,
  MIGRATION_TIMEOUT: 60000
} as const;

// Redis Configuration
export const REDIS_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour
  SESSION_TTL: 86400, // 24 hours
  CACHE_TTL: 1800, // 30 minutes
  KEY_PREFIXES: {
    SESSION: 'session:',
    CACHE: 'cache:',
    LOCK: 'lock:',
    AGENT: 'agent:'
  }
} as const;

// BMad v6 Agent Configuration
export const AGENT_CONFIG = {
  MAX_CONCURRENT_AGENTS: 3,
  AGENT_TIMEOUT: 300000, // 5 minutes
  CONTEXT_RETENTION: 86400000, // 24 hours
  DEFAULT_AGENTS: [
    'analyst',
    'architect',
    'pm',
    'sm',
    'ux-designer',
    'dev',
    'tea',
    'tech-writer'
  ]
} as const;

// Workflow Configuration
export const WORKFLOW_CONFIG = {
  PHASE_TIMEOUT: 7200000, // 2 hours
  AUTO_SAVE_INTERVAL: 300000, // 5 minutes
  ARTIFACT_VERSIONS_LIMIT: 10,
  TRACK_COMPLEXITY_THRESHOLDS: {
    QUICK_FLOW: 25,
    BMAD_METHOD: 75,
    BROWNFIELD: 100
  }
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt', '.md'],
    IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
    ARCHIVES: ['.zip', '.tar.gz', '.rar']
  },
  STORAGE_PATH: './uploads',
  TEMP_PATH: './temp'
} as const;

// OTLP Configuration
export const OTLP_CONFIG = {
  DEFAULT_ENDPOINT: 'http://localhost:4317',
  SERVICE_NAME: 'bmad-platform',
  SERVICE_VERSION: '1.0.0',
  BATCH_TIMEOUT: 5000,
  MAX_EXPORT_BATCH_SIZE: 512
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 1000,
  API_WINDOW_MS: 60 * 1000, // 1 minute
  API_MAX_REQUESTS: 100
} as const;

// CORS Configuration
export const CORS_CONFIG = {
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  CREDENTIALS: true
} as const;

// Logging Configuration
export const LOGGING_CONFIG = {
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    HTTP: 'http',
    DEBUG: 'debug'
  },
  MAX_FILE_SIZE: '20m',
  MAX_FILES: '14d',
  DATE_PATTERN: 'YYYY-MM-DD'
} as const;

// API Routes
export const API_ROUTES = {
  BASE: '/api/v1',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: '/projects/:id',
    ARTIFACTS: '/projects/:id/artifacts',
    AGENTS: '/projects/:id/agents',
    WORKFLOWS: '/projects/:id/workflows'
  },
  AGENTS: {
    BASE: '/agents',
    ENGAGE: '/agents/:agentId/engage',
    STATUS: '/agents/:agentId/status'
  },
  ARTIFACTS: {
    BASE: '/artifacts',
    BY_ID: '/artifacts/:id',
    VERSIONS: '/artifacts/:id/versions',
    SYNC: '/artifacts/:id/sync'
  },
  TELEMETRY: {
    EVENTS: '/telemetry/events',
    METRICS: '/telemetry/metrics'
  }
} as const;

// Frontend Routes
export const FRONTEND_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/[id]',
  AGENTS: '/agents',
  ARTIFACTS: '/artifacts',
  SETTINGS: '/settings',
  LOGIN: '/login'
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Business Logic
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  AGENT_UNAVAILABLE: 'AGENT_UNAVAILABLE',
  WORKFLOW_ERROR: 'WORKFLOW_ERROR',
  ARTIFACT_CONFLICT: 'ARTIFACT_CONFLICT',

  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PROJECT_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_]+$/
  },
  USER_EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },
  ARTIFACT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
    PATTERN: /^[a-zA-Z0-9\s\-_.]+$/
  }
} as const;