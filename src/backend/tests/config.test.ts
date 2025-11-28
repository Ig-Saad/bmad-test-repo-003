import { FastifyInstance } from 'fastify';
import { build } from '../src/app';

describe('External Service Configuration Tests', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.AZURE_TENANT_ID = 'test-tenant-id';
    process.env.AZURE_CLIENT_ID = 'test-client-id';
    process.env.JWT_SECRET = 'test-jwt-secret-key-with-sufficient-length';
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

    app = await build();

    // Create auth token for testing
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
    test('should display empty configuration for new users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const config = JSON.parse(response.body);
      expect(config.githubConfig).toBeUndefined();
      expect(config.sharepointConfig).toBeUndefined();
      expect(config.ignisConfig).toBeUndefined();
    });

    test('should distinguish between codebase and project-level settings', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      // The codebase endpoint should only return codebase-level configs
      expect(body).not.toHaveProperty('projectConfigs');
    });
  });

  describe('AC2: GitHub Repository URL Configuration', () => {
    test('should validate GitHub repository URL format', async () => {
      const invalidUrls = [
        'not-a-url',
        'https://gitlab.com/owner/repo',
        'https://github.com/invalid',
        'github.com/owner/repo' // Missing protocol
      ];

      for (const url of invalidUrls) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/config/github/validate',
          headers: {
            authorization: `Bearer ${authToken}`
          },
          payload: {
            repositoryUrl: url,
            token: 'fake-token'
          }
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.code).toBe('INVALID_URL_FORMAT');
      }
    });

    test('should validate correct GitHub repository URL format', async () => {
      const validUrls = [
        'https://github.com/owner/repo',
        'https://github.com/owner/repo.git',
        'https://github.com/owner/repo/'
      ];

      for (const url of validUrls) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/config/github/validate',
          headers: {
            authorization: `Bearer ${authToken}`
          },
          payload: {
            repositoryUrl: url,
            token: 'fake-token-for-format-test'
          }
        });

        // Should pass format validation but may fail on actual GitHub API
        expect(response.statusCode).toBeOneOf([200, 401, 404]);
      }
    });
  });

  describe('AC3: Repository Access Verification', () => {
    test('should handle invalid GitHub token gracefully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: 'https://github.com/octocat/Hello-World',
          token: 'invalid-token'
        }
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('GITHUB_AUTH_FAILED');
      expect(body.message).toContain('Invalid GitHub token');
    });

    test('should handle non-existent repository', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: 'https://github.com/nonexistent/repository',
          token: 'fake-token'
        }
      });

      expect(response.statusCode).toBeOneOf([404, 401]); // Could be auth or not found
      const body = JSON.parse(response.body);
      expect(body.code).toBeOneOf(['REPOSITORY_NOT_FOUND', 'GITHUB_AUTH_FAILED']);
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
          siteUrl: 'invalid-sharepoint-url',
          clientId: 'test-client-id',
          clientSecret: 'test-secret',
          tenantId: 'test-tenant'
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('INVALID_SHAREPOINT_URL');
    });

    test('should accept valid SharePoint site URL format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/sharepoint/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          siteUrl: 'https://company.sharepoint.com/sites/testsite',
          clientId: 'test-client-id',
          clientSecret: 'test-secret',
          tenantId: 'test-tenant'
        }
      });

      // Should pass format validation but may fail on actual SharePoint API
      expect(response.statusCode).toBeOneOf([200, 401, 403]);
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
          apiKey: 'test-api-key'
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('INVALID_ENDPOINT_FORMAT');
    });

    test('should handle invalid Ignis API key', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/ignis/test',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          endpoint: 'https://api.ignis-platform.com/v1',
          apiKey: 'invalid-api-key'
        }
      });

      expect(response.statusCode).toBeOneOf([401, 403]);
      const body = JSON.parse(response.body);
      expect(body.code).toBeOneOf(['IGNIS_AUTH_FAILED', 'INVALID_API_KEY']);
    });
  });

  describe('AC6: Comprehensive Connectivity Testing', () => {
    test('should test all configured integrations', async () => {
      // First create a configuration
      const configResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'fake-token'
          },
          ignisConfig: {
            endpoint: 'https://api.ignis-platform.com/v1',
            apiKey: 'fake-api-key'
          }
        }
      });

      expect(configResponse.statusCode).toBe(201);

      // Then test all integrations
      const testResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/config/test-all',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(testResponse.statusCode).toBe(200);
      const results = JSON.parse(testResponse.body);
      expect(results.tests).toBeDefined();
      expect(results.tests.github).toBeDefined();
      expect(results.tests.ignis).toBeDefined();
      expect(results.overallStatus).toBeOneOf(['success', 'partial', 'failure']);
    });

    test('should provide detailed test results with error messages', async () => {
      // Create configuration with invalid credentials
      await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'invalid-token'
          }
        }
      });

      const testResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/config/test-all',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(testResponse.statusCode).toBe(200);
      const results = JSON.parse(testResponse.body);
      expect(results.tests.github.success).toBe(false);
      expect(results.tests.github.error).toBeDefined();
      expect(results.overallStatus).toBe('failure');
    });
  });

  describe('AC7: Configuration Persistence & Security', () => {
    test('should encrypt credentials before storage', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'secret-github-token'
          },
          ignisConfig: {
            endpoint: 'https://api.ignis-platform.com/v1',
            apiKey: 'secret-ignis-key'
          }
        }
      });

      expect(response.statusCode).toBe(201);

      // Check that credentials are not stored in plain text
      const config = await prisma.codebaseConfiguration.findFirst({
        where: { userId: testUserId }
      });

      expect(config).toBeDefined();
      expect(config!.githubTokenEncrypted).not.toBe('secret-github-token');
      expect(config!.ignisApiKeyEncrypted).not.toBe('secret-ignis-key');
      expect(config!.githubTokenEncrypted).toBeDefined();
      expect(config!.ignisApiKeyEncrypted).toBeDefined();
    });

    test('should mask credentials when retrieving configuration', async () => {
      // Create configuration
      await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo',
            token: 'secret-github-token'
          }
        }
      });

      // Retrieve configuration
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const config = JSON.parse(response.body);

      // Credentials should be masked
      expect(config.githubConfig.token).toBe('***masked***');
      expect(config.githubConfig.repositoryUrl).toBe('https://github.com/test/repo');
    });
  });

  describe('AC8: Configuration Updates & Modifications', () => {
    test('should update existing configuration', async () => {
      // Create initial configuration
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo1',
            token: 'token1'
          }
        }
      });

      expect(createResponse.statusCode).toBe(201);

      // Update configuration
      const updateResponse = await app.inject({
        method: 'PUT',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo2',
            token: 'token2'
          }
        }
      });

      expect(updateResponse.statusCode).toBe(200);

      // Verify update
      const getResponse = await app.inject({
        method: 'GET',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      const config = JSON.parse(getResponse.body);
      expect(config.githubConfig.repositoryUrl).toBe('https://github.com/test/repo2');
    });

    test('should maintain configuration history for rollback', async () => {
      // Create configuration
      await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo1',
            token: 'token1'
          }
        }
      });

      // Update configuration
      await app.inject({
        method: 'PUT',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            repositoryUrl: 'https://github.com/test/repo2',
            token: 'token2'
          }
        }
      });

      // Check that both configurations exist in history
      const configs = await prisma.codebaseConfiguration.findMany({
        where: { userId: testUserId },
        orderBy: { createdAt: 'desc' }
      });

      expect(configs).toHaveLength(2);
    });
  });

  describe('AC10: Configuration Error Handling', () => {
    test('should provide clear error messages for invalid input', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/codebase',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          githubConfig: {
            // Missing required fields
            repositoryUrl: ''
          }
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.message).toContain('repositoryUrl');
    });

    test('should handle network errors gracefully', async () => {
      // Mock network failure scenario
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: 'https://github.com/test/repo',
          token: 'test-token'
        }
      });

      // Should handle network errors with appropriate status codes
      expect(response.statusCode).toBeOneOf([200, 401, 404, 500, 503]);

      if (response.statusCode >= 400) {
        const body = JSON.parse(response.body);
        expect(body.code).toBeDefined();
        expect(body.message).toBeDefined();
      }
    });
  });

  describe('AC11: Configuration Validation Feedback', () => {
    test('should provide immediate validation feedback', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/config/github/validate',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          repositoryUrl: 'https://github.com/octocat/Hello-World',
          token: 'fake-token'
        }
      });

      // Should return immediate feedback regardless of success/failure
      expect(response.statusCode).toBeOneOf([200, 400, 401, 404]);
      const body = JSON.parse(response.body);

      if (response.statusCode === 200) {
        expect(body.valid).toBe(true);
        expect(body.details).toBeDefined();
      } else {
        expect(body.code).toBeDefined();
        expect(body.message).toBeDefined();
      }
    });
  });
});

describe('Configuration Status Monitoring Tests', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    app = await build();

    // Create test user
    const testUser = await app.prisma.user.create({
      data: {
        azureId: 'status-test-user',
        email: 'status@company.com',
        name: 'Status Test User',
        tenantId: 'test-tenant-id',
        role: 'STAKEHOLDER'
      }
    });

    authToken = app.jwt.sign({
      sub: testUser.azureId,
      email: testUser.email,
      role: testUser.role
    });
  });

  afterAll(async () => {
    await app.prisma.user.deleteMany();
    await app.close();
  });

  describe('AC9: Configuration Status Monitoring', () => {
    test('should provide real-time status indicators', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/config/status',
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const status = JSON.parse(response.body);

      expect(status.github).toBeDefined();
      expect(status.sharepoint).toBeDefined();
      expect(status.ignis).toBeDefined();
      expect(status.overall).toBeOneOf(['healthy', 'degraded', 'unhealthy']);
      expect(status.lastChecked).toBeDefined();
    });
  });
});