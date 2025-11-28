/**
 * Utility functions for BMad v6-Powered SDLC Platform
 */

// Date utilities
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const d = new Date(date);

  if (format === 'relative') {
    return getRelativeTime(d);
  }

  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return d.toLocaleDateString('en-US', options);
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date, 'short');
};

// String utilities
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (text: string, length: number = 100, suffix: string = '...'): string => {
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const camelCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

// Object utilities
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Array utilities
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// ID utilities
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const isValidCuid = (id: string): boolean => {
  return /^c[a-z0-9]{24}$/.test(id);
};

// URL utilities
export const buildUrl = (base: string, path: string, params?: Record<string, any>): string => {
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

export const parseQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

// Error utilities
export const createError = (code: string, message: string, details?: Record<string, any>): Error => {
  const error = new Error(message) as any;
  error.code = code;
  error.details = details;
  error.timestamp = new Date();
  return error;
};

export const isApiError = (error: any): boolean => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(`.${extension}`);
};

// Progress utilities
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

// BMad v6 specific utilities
export const getTrackDisplayName = (track: string): string => {
  const trackNames: Record<string, string> = {
    QUICK_FLOW: 'Quick Flow',
    BMAD_METHOD: 'BMad Method',
    BROWNFIELD: 'Brownfield'
  };
  return trackNames[track] || track;
};

export const getPhaseDisplayName = (phase: string): string => {
  const phaseNames: Record<string, string> = {
    ANALYSIS: 'Analysis',
    PLANNING: 'Planning',
    SOLUTIONING: 'Solutioning',
    IMPLEMENTATION: 'Implementation'
  };
  return phaseNames[phase] || phase;
};

export const getAgentDisplayName = (agentId: string): string => {
  const agentNames: Record<string, string> = {
    analyst: 'Mary (Analyst)',
    architect: 'Winston (Architect)',
    pm: 'Sarah (Project Manager)',
    sm: 'Alex (Scrum Master)',
    'ux-designer': 'Luna (UX Designer)',
    dev: 'Dev (Developer)',
    tea: 'TEA (Test Engineer)',
    'tech-writer': 'Morgan (Tech Writer)'
  };
  return agentNames[agentId] || agentId;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    DRAFT: 'gray',
    ACTIVE: 'blue',
    ON_HOLD: 'yellow',
    COMPLETED: 'green',
    ARCHIVED: 'gray',
    not_started: 'gray',
    in_progress: 'blue',
    completed: 'green',
    blocked: 'red'
  };
  return statusColors[status] || 'gray';
};

// Async utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt);
      }
    }
  }

  throw lastError!;
};

// Type guards
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = <T>(value: any): value is T[] => {
  return Array.isArray(value);
};