"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const rest_1 = require("@octokit/rest");
const axios_1 = __importDefault(require("axios"));
const externalServicesPlugin = async (fastify) => {
    // GitHub validation helper
    const validateGitHubConfig = async (config) => {
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
            const octokit = new rest_1.Octokit({
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
        }
        catch (error) {
            fastify.logger.error('GitHub validation error:', error);
            if (error.status === 401) {
                return {
                    valid: false,
                    error: 'Invalid GitHub token or insufficient permissions'
                };
            }
            else if (error.status === 404) {
                return {
                    valid: false,
                    error: 'Repository not found or no access'
                };
            }
            else {
                return {
                    valid: false,
                    error: `GitHub API error: ${error.message}`
                };
            }
        }
    };
    // SharePoint validation helper
    const validateSharePointConfig = async (config) => {
        try {
            // Get Azure AD token
            const tokenResponse = await axios_1.default.post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const accessToken = tokenResponse.data.access_token;
            // Test SharePoint site access
            const siteUrl = new URL(config.siteUrl);
            const hostname = siteUrl.hostname;
            const sitePath = siteUrl.pathname;
            const siteResponse = await axios_1.default.get(`https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // Get document libraries
            const drivesResponse = await axios_1.default.get(`https://graph.microsoft.com/v1.0/sites/${siteResponse.data.id}/drives`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return {
                valid: true,
                details: {
                    siteId: siteResponse.data.id,
                    siteName: siteResponse.data.displayName,
                    driveId: drivesResponse.data.value[0]?.id,
                    hasAccess: true,
                    libraries: drivesResponse.data.value.map((drive) => ({
                        id: drive.id,
                        name: drive.name,
                        type: drive.driveType
                    })),
                    lastValidated: new Date().toISOString()
                }
            };
        }
        catch (error) {
            fastify.logger.error('SharePoint validation error:', error);
            if (error.response?.status === 401) {
                return {
                    valid: false,
                    error: 'Invalid SharePoint credentials or insufficient permissions'
                };
            }
            else if (error.response?.status === 403) {
                return {
                    valid: false,
                    error: 'Access denied to SharePoint site'
                };
            }
            else if (error.response?.status === 404) {
                return {
                    valid: false,
                    error: 'SharePoint site not found'
                };
            }
            else {
                return {
                    valid: false,
                    error: `SharePoint API error: ${error.message}`
                };
            }
        }
    };
    // Ignis Platform validation helper
    const validateIgnisConfig = async (config) => {
        try {
            // Test Ignis API connection
            const response = await axios_1.default.get(`${config.endpoint}/api/health`, {
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
                    const projectResponse = await axios_1.default.get(`${config.endpoint}/api/projects/${config.projectId}`, {
                        headers: {
                            'Authorization': `Bearer ${config.apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    projectDetails = projectResponse.data;
                }
                catch (projectError) {
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
        }
        catch (error) {
            fastify.logger.error('Ignis validation error:', error);
            if (error.response?.status === 401) {
                return {
                    valid: false,
                    error: 'Invalid Ignis API key'
                };
            }
            else if (error.response?.status === 403) {
                return {
                    valid: false,
                    error: 'Insufficient permissions for Ignis Platform'
                };
            }
            else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                return {
                    valid: false,
                    error: 'Cannot connect to Ignis Platform endpoint'
                };
            }
            else {
                return {
                    valid: false,
                    error: `Ignis Platform error: ${error.message}`
                };
            }
        }
    };
    // Status check helpers (lightweight checks)
    const checkGitHubStatus = async (config) => {
        try {
            const octokit = new rest_1.Octokit({ auth: config.token });
            await octokit.rest.users.getAuthenticated();
            return {
                status: 'connected',
                lastChecked: new Date().toISOString(),
                repository: config.repository
            };
        }
        catch (error) {
            return {
                status: 'error',
                lastChecked: new Date().toISOString(),
                error: 'Connection failed'
            };
        }
    };
    const checkSharePointStatus = async (config) => {
        try {
            // Simple token validation
            const tokenResponse = await axios_1.default.post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials'
            }));
            return {
                status: 'connected',
                lastChecked: new Date().toISOString(),
                siteUrl: config.siteUrl
            };
        }
        catch (error) {
            return {
                status: 'error',
                lastChecked: new Date().toISOString(),
                error: 'Authentication failed'
            };
        }
    };
    const checkIgnisStatus = async (config) => {
        try {
            await axios_1.default.get(`${config.endpoint}/api/health`, {
                headers: { 'Authorization': `Bearer ${config.apiKey}` },
                timeout: 5000
            });
            return {
                status: 'connected',
                lastChecked: new Date().toISOString(),
                endpoint: config.endpoint
            };
        }
        catch (error) {
            return {
                status: 'error',
                lastChecked: new Date().toISOString(),
                error: 'Connection failed'
            };
        }
    };
    // Register decorators - casting to any to avoid TypeScript issues
    fastify.validateGitHubConfig = validateGitHubConfig;
    fastify.validateSharePointConfig = validateSharePointConfig;
    fastify.validateIgnisConfig = validateIgnisConfig;
    fastify.checkGitHubStatus = checkGitHubStatus;
    fastify.checkSharePointStatus = checkSharePointStatus;
    fastify.checkIgnisStatus = checkIgnisStatus;
    fastify.log.info('External services validation plugin loaded');
};
exports.default = (0, fastify_plugin_1.default)(externalServicesPlugin, {
    name: 'external-services'
});
//# sourceMappingURL=externalServices.js.map