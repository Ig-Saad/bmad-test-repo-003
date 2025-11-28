import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

// Request/Response schemas
interface LoginRequest {
  accessToken: string;
  idToken?: string;
  account: {
    homeAccountId: string;
    environment: string;
    tenantId: string;
    username: string;
    localAccountId: string;
    name?: string;
    idTokenClaims?: any;
  };
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  expiresAt: string;
}

const authRoutes: FastifyPluginAsync = async (fastify) => {

  // Login endpoint - Exchange Azure AD token for JWT
  fastify.post<{
    Body: LoginRequest;
    Reply: LoginResponse | { code: string; message: string; };
  }>('/login', {
    schema: {
      description: 'Exchange Azure AD access token for JWT',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['accessToken', 'account'],
        properties: {
          accessToken: {
            type: 'string',
            description: 'Azure AD access token'
          },
          idToken: {
            type: 'string',
            description: 'Azure AD ID token (optional)'
          },
          account: {
            type: 'object',
            description: 'Azure AD account information',
            required: ['homeAccountId', 'environment', 'tenantId', 'username', 'localAccountId'],
            properties: {
              homeAccountId: { type: 'string' },
              environment: { type: 'string' },
              tenantId: { type: 'string' },
              username: { type: 'string' },
              localAccountId: { type: 'string' },
              name: { type: 'string' },
              idTokenClaims: { type: 'object' }
            }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            refreshToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                avatarUrl: { type: 'string' }
              }
            },
            expiresAt: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { accessToken, account } = request.body;

      // Validate Azure AD token and get user info
      const azureUser = await fastify.validateAzureToken(accessToken);

      // Verify tenant ID matches
      if (account.tenantId !== azureUser.tenantId) {
        return reply.code(401).send({
          code: 'TENANT_MISMATCH',
          message: 'Tenant ID mismatch'
        });
      }

      // Create or update user in database
      const user = await fastify.createOrUpdateUser(azureUser, account.tenantId);

      // Generate JWT token
      const jwtPayload = {
        id: user.id,
        azureId: user.azureId,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId
      };

      const token = fastify.jwt.sign(jwtPayload);

      // Generate refresh token (for future implementation)
      const refreshToken = fastify.jwt.sign(
        { id: user.id, azureId: user.azureId, type: 'refresh' } as any,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
      );

      // Cache user session in Redis
      const sessionKey = `session:${user.id}`;
      if (fastify.redis) {
        try {
          await fastify.redis.setEx(sessionKey, 86400, JSON.stringify({
            userId: user.id,
            azureId: user.azureId,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            loginTime: new Date().toISOString()
          }));
        } catch (error) {
          fastify.logger.warn('Failed to cache session in Redis:', error);
        }
      }

      // Log telemetry event
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'user_login',
          userId: user.id,
          data: {
            tenantId: user.tenantId,
            email: user.email,
            method: 'azure_ad'
          }
        }
      });

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl
        },
        expiresAt
      };

    } catch (error) {
      fastify.logger.error('Login error:', error);

      if (error instanceof Error && error.message.includes('Invalid Azure AD token')) {
        return reply.code(401).send({
          code: 'INVALID_AZURE_TOKEN',
          message: 'Invalid Azure AD access token'
        });
      }

      return reply.code(500).send({
        code: 'LOGIN_ERROR',
        message: 'An error occurred during login'
      });
    }
  });

  // Logout endpoint
  fastify.post('/logout', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Logout user and invalidate session',
      tags: ['Authentication'],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      if (!request.user) {
        return reply.code(401).send({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        });
      }

      // Remove session from Redis
      const sessionKey = `session:${request.user.id}`;
      if (fastify.redis) {
        try {
          await fastify.redis.del(sessionKey);
        } catch (error) {
          fastify.logger.warn('Failed to remove session from Redis:', error);
        }
      }

      // Log telemetry event
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'user_logout',
          userId: request.user.id,
          data: {
            tenantId: request.user.tenantId,
            email: request.user.email
          }
        }
      });

      return { message: 'Logged out successfully' };

    } catch (error) {
      fastify.logger.error('Logout error:', error);
      return reply.code(500).send({
        code: 'LOGOUT_ERROR',
        message: 'An error occurred during logout'
      });
    }
  });

  // Refresh token endpoint
  fastify.post<{
    Body: RefreshTokenRequest;
    Reply: { token: string; expiresAt: string; } | { code: string; message: string; };
  }>('/refresh', {
    schema: {
      description: 'Refresh JWT token using refresh token',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Refresh token'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expiresAt: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { refreshToken } = request.body;

      // Verify refresh token
      const payload = fastify.jwt.verify(refreshToken) as any;

      if (payload.type !== 'refresh') {
        return reply.code(401).send({
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid refresh token type'
        });
      }

      // Get user from database
      const user = await fastify.prisma.user.findUnique({
        where: { azureId: payload.sub }
      });

      if (!user) {
        return reply.code(401).send({
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        });
      }

      // Generate new JWT token
      const newJwtPayload = {
        id: user.id,
        azureId: user.azureId,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId
      };

      const newToken = fastify.jwt.sign(newJwtPayload);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      return {
        token: newToken,
        expiresAt
      };

    } catch (error) {
      fastify.logger.error('Token refresh error:', error);

      if (error instanceof Error && error.message.includes('expired')) {
        return reply.code(401).send({
          code: 'REFRESH_TOKEN_EXPIRED',
          message: 'Refresh token has expired'
        });
      }

      return reply.code(401).send({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token'
      });
    }
  });

  // Get current user profile
  fastify.get('/profile', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get current user profile',
      tags: ['Authentication'],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            azureId: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            givenName: { type: 'string' },
            surname: { type: 'string' },
            avatarUrl: { type: 'string' },
            role: { type: 'string' },
            tenantId: { type: 'string' },
            createdAt: { type: 'string' },
            lastLoginAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    if (!request.user) {
      return reply.code(401).send({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated'
      });
    }

    // Get full user details from database
    const user = await fastify.prisma.user.findUnique({
      where: { id: request.user.id }
    });

    if (!user) {
      return reply.code(404).send({
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    return {
      id: user.id,
      azureId: user.azureId,
      email: user.email,
      name: user.name,
      givenName: user.givenName,
      surname: user.surname,
      avatarUrl: user.avatarUrl,
      role: user.role,
      tenantId: user.tenantId,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString()
    };
  });

  // Validate token endpoint (for frontend to check token validity)
  fastify.get('/validate', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Validate current JWT token',
      tags: ['Authentication'],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return {
      valid: true,
      user: {
        id: request.user!.id,
        email: request.user!.email,
        name: request.user!.name,
        role: request.user!.role
      }
    };
  });
};

export default authRoutes;