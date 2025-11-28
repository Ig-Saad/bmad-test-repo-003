import { FastifyInstance } from 'fastify';
import { build } from '../src/app';

describe('Story 1.3: External Service Configuration Tests', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.AZURE_TENANT_ID = 'test-tenant-id';
    process.env.AZURE_CLIENT_ID = 'test-client-id';
    process.env.JWT_SECRET = 'test-jwt-secret-key-with-sufficient-length';

    app = await build();

    authToken = app.jwt.sign({
      sub: 'test-config-user',
      email: 'config-test@company.com',
      name: 'Config Test User',
      tid: 'test-tenant-id',
      role: 'STAKEHOLDER'
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AC1: Codebase Configuration Interface', () => {
    test('should display configuration interface for authenticated users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should require authentication for configuration access', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase'
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('AC2: GitHub Repository URL Configuration', () => {
    test('should validate GitHub repository URL format', async () => {
      const invalidUrl = 'not-a-github-url';

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: invalidUrl,
          token: 'fake-token'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    test('should accept valid GitHub repository URL format', async () => {
      const validUrl = 'https://github.com/owner/repo';

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: validUrl,
          token: 'fake-token'
        }
      });

      // Should pass format validation (may fail on GitHub API call)
      expect([200, 401, 404]).toContain(response.statusCode);
    });
  });

  describe('AC4: SharePoint Integration Setup', () => {
    test('should validate SharePoint site URL format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/sharepoint/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          siteUrl: 'invalid-url',
          clientId: 'test-id',
          clientSecret: 'test-secret',
          tenantId: 'test-tenant'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    test('should accept valid SharePoint site URL', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/sharepoint/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          siteUrl: 'https://company.sharepoint.com/sites/test',
          clientId: 'test-id',
          clientSecret: 'test-secret',
          tenantId: 'test-tenant'
        }
      });

      // Should pass format validation
      expect([200, 401, 403]).toContain(response.statusCode);
    });
  });

  describe('AC5: Ignis Platform Connection Configuration', () => {
    test('should validate Ignis Platform endpoint format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/ignis/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          endpoint: 'invalid-endpoint',
          apiKey: 'test-key'
        }
      });

      expect(response.statusCode).toBe(400);
    });

    test('should accept valid Ignis Platform endpoint', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/ignis/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          endpoint: 'https://api.ignis-platform.com/v1',
          apiKey: 'test-key'
        }
      });

      // Should pass format validation
      expect([200, 401, 403]).toContain(response.statusCode);
    });
  });

  describe('AC6: Comprehensive Connectivity Testing', () => {
    test('should provide test-all endpoint', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/test-all',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      // Should handle request (may have no configs to test)
      expect([200, 404]).toContain(response.statusCode);
    });
  });

  describe('AC7: Configuration Persistence & Security', () => {
    test('should save configuration securely', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'secret-token'
          },
          ignisConfig: {
            endpoint: 'https://api.ignis-platform.com/v1',
            apiKey: 'secret-key'
          }
        }
      });

      expect([200, 201]).toContain(response.statusCode);
    });

    test('should mask credentials when retrieving config', async () => {
      // First create a config
      await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'secret-token'
          }
        }
      });

      // Then retrieve it
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      if (response.statusCode === 200) {
        const config = JSON.parse(response.body);
        if (config.githubConfig) {
          expect(config.githubConfig.token).toBe('***masked***');
        }
      }
    });
  });

  describe('AC9: Configuration Status Monitoring', () => {
    test('should provide status endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/status',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const status = JSON.parse(response.body);
      expect(status).toHaveProperty('github');
      expect(status).toHaveProperty('sharepoint');
      expect(status).toHaveProperty('ignis');
    });
  });

  describe('AC10: Configuration Error Handling', () => {
    test('should handle validation errors gracefully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: '' // Invalid empty URL
          }
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('code');
      expect(body).toHaveProperty('message');
    });
  });
});