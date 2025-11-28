"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const axios_1 = __importDefault(require("axios"));
const authPlugin = async (fastify) => {
    // Azure AD configuration
    const azureConfig = {
        tenantId: process.env.AZURE_TENANT_ID || '',
        clientId: process.env.AZURE_CLIENT_ID || '',
        authority: process.env.AZURE_AUTHORITY || `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        graphBaseUrl: 'https://graph.microsoft.com/v1.0'
    };
    if (!azureConfig.tenantId || !azureConfig.clientId) {
        throw new Error('Azure AD configuration is missing. Please set AZURE_TENANT_ID and AZURE_CLIENT_ID environment variables.');
    }
    // Register JWT plugin
    await fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        sign: {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        },
        verify: {
            maxAge: process.env.JWT_EXPIRES_IN || '24h'
        }
    });
    // Decorate fastify instance
    fastify.decorate('azureConfig', azureConfig);
    // Authentication decorator
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return reply.code(401).send({
                    code: 'UNAUTHORIZED',
                    message: 'Missing or invalid authorization header'
                });
            }
            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            // Verify JWT token
            const payload = fastify.jwt.verify(token);
            // Get user from database
            const user = await fastify.prisma.user.findUnique({
                where: { azureId: payload.sub }
            });
            if (!user) {
                return reply.code(401).send({
                    code: 'USER_NOT_FOUND',
                    message: 'User not found in database'
                });
            }
            // Update last login time
            await fastify.prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() }
            });
            // Set user context on request
            request.user = {
                id: user.id,
                azureId: user.azureId,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId
            };
        }
        catch (error) {
            fastify.logger.error('Authentication error:', error);
            if (error instanceof Error && error.message.includes('expired')) {
                return reply.code(401).send({
                    code: 'TOKEN_EXPIRED',
                    message: 'JWT token has expired'
                });
            }
            return reply.code(401).send({
                code: 'INVALID_TOKEN',
                message: 'Invalid JWT token'
            });
        }
    });
    // Utility function to validate Azure AD token
    const validateAzureToken = async (accessToken) => {
        try {
            // Get user info from Microsoft Graph
            const response = await axios_1.default.get(`${azureConfig.graphBaseUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            fastify.logger.error('Azure token validation error:', error);
            throw new Error('Invalid Azure AD token');
        }
    };
    // Utility function to create or update user from Azure AD
    const createOrUpdateUser = async (azureUser, tenantId) => {
        const userData = {
            azureId: azureUser.id,
            email: azureUser.mail || azureUser.userPrincipalName,
            name: azureUser.displayName,
            givenName: azureUser.givenName,
            surname: azureUser.surname,
            avatarUrl: null, // Can be fetched from Graph API if needed
            tenantId: tenantId,
            role: 'STAKEHOLDER' // Default role
        };
        // Check if user exists
        const existingUser = await fastify.prisma.user.findUnique({
            where: { azureId: azureUser.id }
        });
        if (existingUser) {
            // Update existing user
            return await fastify.prisma.user.update({
                where: { azureId: azureUser.id },
                data: {
                    email: userData.email,
                    name: userData.name,
                    givenName: userData.givenName,
                    surname: userData.surname,
                    lastLoginAt: new Date()
                }
            });
        }
        else {
            // Create new user
            return await fastify.prisma.user.create({
                data: userData
            });
        }
    };
    // Role-based authorization helpers
    const requireRole = (requiredRoles) => {
        return async (request, reply) => {
            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            if (!request.user) {
                return reply.code(401).send({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                });
            }
            if (!roles.includes(request.user.role)) {
                return reply.code(403).send({
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                });
            }
        };
    };
    // Project-based authorization helper
    const requireProjectAccess = (requiredRoles) => {
        return async (request, reply) => {
            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            const projectId = request.params.projectId || request.body?.projectId;
            if (!request.user) {
                return reply.code(401).send({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                });
            }
            if (!projectId) {
                return reply.code(400).send({
                    code: 'BAD_REQUEST',
                    message: 'Project ID is required'
                });
            }
            // Check project access
            const projectUser = await fastify.prisma.projectUser.findUnique({
                where: {
                    projectId_userId: {
                        projectId: projectId,
                        userId: request.user.id
                    }
                }
            });
            if (!projectUser || !roles.includes(projectUser.role)) {
                return reply.code(403).send({
                    code: 'FORBIDDEN',
                    message: 'Insufficient project permissions'
                });
            }
        };
    };
    // Decorate helper functions
    fastify.decorate('validateAzureToken', validateAzureToken);
    fastify.decorate('createOrUpdateUser', createOrUpdateUser);
    fastify.decorate('requireRole', requireRole);
    fastify.decorate('requireProjectAccess', requireProjectAccess);
};
exports.authPlugin = authPlugin;
exports.default = (0, fastify_plugin_1.default)(authPlugin);
//# sourceMappingURL=auth.js.map