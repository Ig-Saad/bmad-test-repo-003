import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import axios from 'axios';

// Azure AD configuration
interface AzureADConfig {
  tenantId: string;
  clientId: string;
  authority: string;
  graphBaseUrl: string;
}

// JWT payload interface
interface JWTPayload {
  sub: string; // Azure AD user ID
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  tid: string; // Tenant ID
  aud: string; // Audience (client ID)
  iss: string; // Issuer
  iat: number; // Issued at
  exp: number; // Expires at
}

// User context interface
interface UserContext {
  id: string;
  azureId: string;
  email: string;
  name: string;
  givenName?: string;
  surname?: string;
  avatarUrl?: string;
  tenantId: string;
  role: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    azureConfig: AzureADConfig;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Azure AD configuration (support both AZURE_* and ENTRAID_* env vars)
  const tenantId = process.env.AZURE_TENANT_ID || process.env.ENTRAID_TENANT_ID || '';
  const clientId = process.env.AZURE_CLIENT_ID || process.env.ENTRAID_CLIENT_ID || '';

  const azureConfig: AzureADConfig = {
    tenantId,
    clientId,
    authority: process.env.AZURE_AUTHORITY || process.env.ENTRAID_AUTHORITY || `https://login.microsoftonline.com/${tenantId}`,
    graphBaseUrl: 'https://graph.microsoft.com/v1.0'
  };

  // Azure AD is optional for local development
  if (!azureConfig.tenantId || !azureConfig.clientId) {
    fastify.log.warn('Azure AD configuration is missing. Authentication will use mock mode for development.');
    azureConfig.tenantId = 'dev-tenant-id';
    azureConfig.clientId = 'dev-client-id';
    azureConfig.authority = 'https://login.microsoftonline.com/dev-tenant-id';
  }

  // Register JWT plugin
  await fastify.register(jwt, {
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
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
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
      const payload = fastify.jwt.verify(token) as JWTPayload;

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

    } catch (error) {
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
  const validateAzureToken = async (accessToken: string): Promise<any> => {
    try {
      // Get user info from Microsoft Graph
      const response = await axios.get(`${azureConfig.graphBaseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      fastify.logger.error('Azure token validation error:', error);
      throw new Error('Invalid Azure AD token');
    }
  };

  // Utility function to create or update user from Azure AD
  const createOrUpdateUser = async (azureUser: any, tenantId: string) => {
    const userData = {
      azureId: azureUser.id,
      email: azureUser.mail || azureUser.userPrincipalName,
      name: azureUser.displayName,
      givenName: azureUser.givenName,
      surname: azureUser.surname,
      avatarUrl: null, // Can be fetched from Graph API if needed
      tenantId: tenantId,
      role: 'STAKEHOLDER' as const // Default role
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
    } else {
      // Create new user
      return await fastify.prisma.user.create({
        data: userData
      });
    }
  };

  // Role-based authorization helpers
  const requireRole = (requiredRoles: string | string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
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
  const requireProjectAccess = (requiredRoles: string | string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const projectId = (request.params as any).projectId || (request.body as any)?.projectId;

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

export { authPlugin };

// Extend FastifyInstance interface for TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    validateAzureToken: (accessToken: string) => Promise<any>;
    createOrUpdateUser: (azureUser: any, tenantId: string) => Promise<any>;
    requireRole: (requiredRoles: string | string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireProjectAccess: (requiredRoles: string | string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(authPlugin);