import { FastifyPluginAsync } from 'fastify';

const configRoutes: FastifyPluginAsync = async (fastify) => {

  // Get codebase configuration
  fastify.get('/codebase', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get current codebase configuration',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            githubConfig: {
              type: 'object',
              properties: {
                repositoryUrl: { type: 'string' },
                owner: { type: 'string' },
                repository: { type: 'string' },
                branch: { type: 'string' },
                hasAccess: { type: 'boolean' },
                permissions: { type: 'array', items: { type: 'string' } },
                lastValidated: { type: 'string' }
              }
            },
            sharepointConfig: {
              type: 'object',
              properties: {
                siteUrl: { type: 'string' },
                driveId: { type: 'string' },
                hasAccess: { type: 'boolean' },
                libraries: { type: 'array' },
                lastValidated: { type: 'string' }
              }
            },
            ignisConfig: {
              type: 'object',
              properties: {
                endpoint: { type: 'string' },
                hasAccess: { type: 'boolean' },
                lastValidated: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      // Get user's tenant configuration
      const config = await fastify.prisma.codebaseConfig.findFirst({
        where: {
          tenantId: request.user!.tenantId
        }
      });

      if (!config) {
        return {
          githubConfig: null,
          sharepointConfig: null,
          ignisConfig: null
        };
      }

      // Return configuration without sensitive data
      return {
        id: config.id,
        githubConfig: config.githubConfig ? {
          ...config.githubConfig as any,
          token: undefined, // Don't expose tokens
          webhookSecret: undefined
        } : null,
        sharepointConfig: config.sharepointConfig ? {
          ...config.sharepointConfig as any,
          clientSecret: undefined,
          accessToken: undefined
        } : null,
        ignisConfig: config.ignisConfig ? {
          ...config.ignisConfig as any,
          apiKey: undefined
        } : null
      };

    } catch (error) {
      fastify.logger.error('Error fetching codebase config:', error);
      return reply.code(500).send({
        code: 'CONFIG_FETCH_ERROR',
        message: 'Failed to fetch codebase configuration'
      });
    }
  });

  // Save/Update codebase configuration
  fastify.post('/codebase', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Save or update codebase configuration',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          githubConfig: {
            type: 'object',
            properties: {
              repositoryUrl: { type: 'string' },
              token: { type: 'string' },
              webhookSecret: { type: 'string' }
            }
          },
          sharepointConfig: {
            type: 'object',
            properties: {
              siteUrl: { type: 'string' },
              clientId: { type: 'string' },
              clientSecret: { type: 'string' },
              tenantId: { type: 'string' }
            }
          },
          ignisConfig: {
            type: 'object',
            properties: {
              endpoint: { type: 'string' },
              apiKey: { type: 'string' },
              projectId: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { githubConfig, sharepointConfig, ignisConfig } = request.body as any;

      // Validate GitHub configuration
      if (githubConfig) {
        const githubValidation = await fastify.validateGitHubConfig(githubConfig);
        if (!githubValidation.valid) {
          return reply.code(400).send({
            code: 'GITHUB_CONFIG_INVALID',
            message: githubValidation.error
          });
        }
        githubConfig.validated = true;
        githubConfig.lastValidated = new Date();
      }

      // Validate SharePoint configuration
      if (sharepointConfig) {
        const sharepointValidation = await fastify.validateSharePointConfig(sharepointConfig);
        if (!sharepointValidation.valid) {
          return reply.code(400).send({
            code: 'SHAREPOINT_CONFIG_INVALID',
            message: sharepointValidation.error
          });
        }
        sharepointConfig.validated = true;
        sharepointConfig.lastValidated = new Date();
      }

      // Validate Ignis configuration
      if (ignisConfig) {
        const ignisValidation = await fastify.validateIgnisConfig(ignisConfig);
        if (!ignisValidation.valid) {
          return reply.code(400).send({
            code: 'IGNIS_CONFIG_INVALID',
            message: ignisValidation.error
          });
        }
        ignisConfig.validated = true;
        ignisConfig.lastValidated = new Date();
      }

      // Upsert configuration
      const config = await fastify.prisma.codebaseConfig.upsert({
        where: {
          tenantId: request.user!.tenantId
        },
        update: {
          githubConfig,
          sharepointConfig,
          ignisConfig,
          updatedAt: new Date()
        },
        create: {
          tenantId: request.user!.tenantId,
          githubConfig,
          sharepointConfig,
          ignisConfig
        }
      });

      // Log telemetry
      await fastify.prisma.telemetryEvent.create({
        data: {
          eventType: 'codebase_config_updated',
          userId: request.user!.id,
          data: {
            configId: config.id,
            hasGitHub: !!githubConfig,
            hasSharePoint: !!sharepointConfig,
            hasIgnis: !!ignisConfig
          }
        }
      });

      return {
        success: true,
        configId: config.id,
        message: 'Codebase configuration saved successfully'
      };

    } catch (error) {
      fastify.logger.error('Error saving codebase config:', error);
      return reply.code(500).send({
        code: 'CONFIG_SAVE_ERROR',
        message: 'Failed to save codebase configuration'
      });
    }
  });

  // Validate GitHub repository access
  fastify.post('/github/validate', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Validate GitHub repository access',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }],
      body: {
        type: 'object',
        required: ['repositoryUrl', 'token'],
        properties: {
          repositoryUrl: { type: 'string' },
          token: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { repositoryUrl, token } = request.body as any;
      const result = await fastify.validateGitHubConfig({ repositoryUrl, token });
      return result;
    } catch (error) {
      fastify.logger.error('GitHub validation error:', error);
      return reply.code(500).send({
        code: 'GITHUB_VALIDATION_ERROR',
        message: 'Failed to validate GitHub configuration'
      });
    }
  });

  // Test SharePoint connectivity
  fastify.post('/sharepoint/test', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Test SharePoint connectivity',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const config = request.body as any;
      const result = await fastify.validateSharePointConfig(config);
      return result;
    } catch (error) {
      fastify.logger.error('SharePoint test error:', error);
      return reply.code(500).send({
        code: 'SHAREPOINT_TEST_ERROR',
        message: 'Failed to test SharePoint connectivity'
      });
    }
  });

  // Test Ignis Platform connection
  fastify.post('/ignis/test', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Test Ignis Platform connection',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const config = request.body as any;
      const result = await fastify.validateIgnisConfig(config);
      return result;
    } catch (error) {
      fastify.logger.error('Ignis test error:', error);
      return reply.code(500).send({
        code: 'IGNIS_TEST_ERROR',
        message: 'Failed to test Ignis Platform connection'
      });
    }
  });

  // Get integration status
  fastify.get('/status', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get all integration status',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const config = await fastify.prisma.codebaseConfig.findFirst({
        where: { tenantId: request.user!.tenantId }
      });

      if (!config) {
        return {
          github: { status: 'not_configured' },
          sharepoint: { status: 'not_configured' },
          ignis: { status: 'not_configured' }
        };
      }

      // Check each integration status
      const status = {
        github: config.githubConfig ?
          await fastify.checkGitHubStatus(config.githubConfig as any) :
          { status: 'not_configured' },
        sharepoint: config.sharepointConfig ?
          await fastify.checkSharePointStatus(config.sharepointConfig as any) :
          { status: 'not_configured' },
        ignis: config.ignisConfig ?
          await fastify.checkIgnisStatus(config.ignisConfig as any) :
          { status: 'not_configured' }
      };

      return status;

    } catch (error) {
      fastify.logger.error('Error checking integration status:', error);
      return reply.code(500).send({
        code: 'STATUS_CHECK_ERROR',
        message: 'Failed to check integration status'
      });
    }
  });

  // Test all configured integrations
  fastify.post('/test-all', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Test all configured integrations',
      tags: ['Configuration'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const config = await fastify.prisma.codebaseConfig.findFirst({
        where: { tenantId: request.user!.tenantId }
      });

      if (!config) {
        return reply.code(404).send({
          code: 'CONFIG_NOT_FOUND',
          message: 'No configuration found for this tenant'
        });
      }

      const results = {
        github: null as any,
        sharepoint: null as any,
        ignis: null as any,
        overallStatus: 'success' as string
      };

      // Test GitHub if configured
      if (config.githubConfig) {
        results.github = await fastify.validateGitHubConfig(config.githubConfig as any);
        if (!results.github.valid) results.overallStatus = 'partial';
      }

      // Test SharePoint if configured
      if (config.sharepointConfig) {
        results.sharepoint = await fastify.validateSharePointConfig(config.sharepointConfig as any);
        if (!results.sharepoint.valid) results.overallStatus = 'partial';
      }

      // Test Ignis if configured
      if (config.ignisConfig) {
        results.ignis = await fastify.validateIgnisConfig(config.ignisConfig as any);
        if (!results.ignis.valid) results.overallStatus = 'partial';
      }

      return results;

    } catch (error) {
      fastify.logger.error('Error testing all integrations:', error);
      return reply.code(500).send({
        code: 'TEST_ALL_ERROR',
        message: 'Failed to test integrations'
      });
    }
  });
};

export default configRoutes;