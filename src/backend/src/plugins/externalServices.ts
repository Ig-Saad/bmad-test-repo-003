import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Octokit } from '@octokit/rest';
import axios from 'axios';

export interface GitHubConfig {
  repositoryUrl: string;
  token: string;
  webhookSecret?: string;
}

export interface SharePointConfig {
  siteUrl: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

export interface IgnisConfig {
  endpoint: string;
  apiKey: string;
  projectId?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: any;
}

const externalServicesPlugin: FastifyPluginAsync = async (fastify) => {

  // GitHub validation helper
  const validateGitHubConfig = async (config: GitHubConfig): Promise<ValidationResult> => {
    try {
      // Parse repository URL
      const repoMatch = config.repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/)?$/);
      if (!repoMatch) {
        return {
          valid: false,
          error: 'Invalid GitHub repository URL format'
        };
      }

      const [, owner, repo] = repoMatch;

      // Initialize Octokit with token
      const octokit = new Octokit({
        auth: config.token
      });

      // Test repository access
      const { data: repository } = await octokit.rest.repos.get({
        owner,
        repo
      });

      // Get user permissions
      const { data: permissions } = await octokit.rest.repos.getCollaboratorPermissionLevel({
        owner,
        repo,
        username: repository.owner.login
      });

      return {
        valid: true,
        details: {
          owner,
          repository: repo,
          branch: repository.default_branch,
          hasAccess: true,
          permissions: [permissions.permission],
          private: repository.private,
          fullName: repository.full_name,
          lastValidated: new Date().toISOString()
        }
      };

    } catch (error: any) {
      fastify.logger.error('GitHub validation error:', error);

      if (error.status === 401) {
        return {
          valid: false,
          error: 'Invalid GitHub token or insufficient permissions'
        };
      } else if (error.status === 404) {
        return {
          valid: false,
          error: 'Repository not found or no access'
        };
      } else {
        return {
          valid: false,
          error: `GitHub API error: ${error.message}`
        };
      }
    }
  };

  // SharePoint validation helper
  const validateSharePointConfig = async (config: SharePointConfig): Promise<ValidationResult> => {
    try {
      // Get Azure AD token
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Test SharePoint site access
      const siteUrl = new URL(config.siteUrl);
      const hostname = siteUrl.hostname;
      const sitePath = siteUrl.pathname;

      const siteResponse = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Get document libraries
      const drivesResponse = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${siteResponse.data.id}/drives`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return {
        valid: true,
        details: {
          siteId: siteResponse.data.id,
          siteName: siteResponse.data.displayName,
          driveId: drivesResponse.data.value[0]?.id,
          hasAccess: true,
          libraries: drivesResponse.data.value.map((drive: any) => ({
            id: drive.id,
            name: drive.name,
            type: drive.driveType
          })),
          lastValidated: new Date().toISOString()
        }
      };

    } catch (error: any) {
      fastify.logger.error('SharePoint validation error:', error);

      if (error.response?.status === 401) {
        return {
          valid: false,
          error: 'Invalid SharePoint credentials or insufficient permissions'
        };
      } else if (error.response?.status === 403) {
        return {
          valid: false,
          error: 'Access denied to SharePoint site'
        };
      } else if (error.response?.status === 404) {
        return {
          valid: false,
          error: 'SharePoint site not found'
        };
      } else {
        return {
          valid: false,
          error: `SharePoint API error: ${error.message}`
        };
      }
    }
  };

  // Ignis Platform validation helper
  const validateIgnisConfig = async (config: IgnisConfig): Promise<ValidationResult> => {
    try {
      // Test Ignis API connection
      const response = await axios.get(`${config.endpoint}/api/health`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      // Test project access if projectId provided
      let projectDetails = null;
      if (config.projectId) {
        try {
          const projectResponse = await axios.get(
            `${config.endpoint}/api/projects/${config.projectId}`,
            {
              headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          projectDetails = projectResponse.data;
        } catch (projectError) {
          fastify.logger.warn('Project access test failed:', projectError);
        }
      }

      return {
        valid: true,
        details: {
          endpoint: config.endpoint,
          hasAccess: true,
          status: response.data.status || 'healthy',
          version: response.data.version,
          projectId: config.projectId,
          projectAccess: !!projectDetails,
          lastValidated: new Date().toISOString()
        }
      };

    } catch (error: any) {
      fastify.logger.error('Ignis validation error:', error);

      if (error.response?.status === 401) {
        return {
          valid: false,
          error: 'Invalid Ignis API key'
        };
      } else if (error.response?.status === 403) {
        return {
          valid: false,
          error: 'Insufficient permissions for Ignis Platform'
        };
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return {
          valid: false,
          error: 'Cannot connect to Ignis Platform endpoint'
        };
      } else {
        return {
          valid: false,
          error: `Ignis Platform error: ${error.message}`
        };
      }
    }
  };

  // Status check helpers (lightweight checks)
  const checkGitHubStatus = async (config: any) => {
    try {
      const octokit = new Octokit({ auth: config.token });
      await octokit.rest.users.getAuthenticated();
      return {
        status: 'connected',
        lastChecked: new Date().toISOString(),
        repository: config.repository
      };
    } catch (error) {
      return {
        status: 'error',
        lastChecked: new Date().toISOString(),
        error: 'Connection failed'
      };
    }
  };

  const checkSharePointStatus = async (config: any) => {
    try {
      // Simple token validation
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        })
      );

      return {
        status: 'connected',
        lastChecked: new Date().toISOString(),
        siteUrl: config.siteUrl
      };
    } catch (error) {
      return {
        status: 'error',
        lastChecked: new Date().toISOString(),
        error: 'Authentication failed'
      };
    }
  };

  const checkIgnisStatus = async (config: any) => {
    try {
      await axios.get(`${config.endpoint}/api/health`, {
        headers: { 'Authorization': `Bearer ${config.apiKey}` },
        timeout: 5000
      });

      return {
        status: 'connected',
        lastChecked: new Date().toISOString(),
        endpoint: config.endpoint
      };
    } catch (error) {
      return {
        status: 'error',
        lastChecked: new Date().toISOString(),
        error: 'Connection failed'
      };
    }
  };

  // Register decorators - casting to any to avoid TypeScript issues
  (fastify as any).validateGitHubConfig = validateGitHubConfig;
  (fastify as any).validateSharePointConfig = validateSharePointConfig;
  (fastify as any).validateIgnisConfig = validateIgnisConfig;
  (fastify as any).checkGitHubStatus = checkGitHubStatus;
  (fastify as any).checkSharePointStatus = checkSharePointStatus;
  (fastify as any).checkIgnisStatus = checkIgnisStatus;

  fastify.log.info('External services validation plugin loaded');
};

// Type declarations for the decorators
declare module 'fastify' {
  interface FastifyInstance {
    validateGitHubConfig(config: any): Promise<any>;
    validateSharePointConfig(config: any): Promise<any>;
    validateIgnisConfig(config: any): Promise<any>;
    checkGitHubStatus(config: any): Promise<any>;
    checkSharePointStatus(config: any): Promise<any>;
    checkIgnisStatus(config: any): Promise<any>;
  }
}

export default fp(externalServicesPlugin, {
  name: 'external-services'
});