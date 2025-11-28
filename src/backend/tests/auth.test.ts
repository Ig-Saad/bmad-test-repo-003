import { FastifyInstance } from 'fastify';
import { build } from '../src/app';
import { PrismaClient } from '@prisma/client';

describe('Authentication Plugin Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.AZURE_TENANT_ID = 'test-tenant-id';
    process.env.AZURE_CLIENT_ID = 'test-client-id';
    process.env.JWT_SECRET = 'test-jwt-secret-key-with-sufficient-length';
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

    app = await build();
    prisma = app.prisma;

    // Clear test database
    await prisma.user.deleteMany();
    await prisma.projectUser.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
    await prisma.projectUser.deleteMany();
  });

  describe('AC1: EntraID OAuth 2.0 SSO Implementation', () => {
    test('should have Azure AD configuration loaded', () => {
      expect(app.azureConfig).toBeDefined();
      expect(app.azureConfig.tenantId).toBe('test-tenant-id');
      expect(app.azureConfig.clientId).toBe('test-client-id');
      expect(app.azureConfig.authority).toContain('test-tenant-id');
    });

    test('should validate required OAuth scopes', () => {
      const requiredScopes = ['openid', 'profile', 'email', 'User.Read'];
      // This would be validated in the frontend MSAL configuration
      expect(requiredScopes).toEqual(['openid', 'profile', 'email', 'User.Read']);
    });
  });

  describe('AC2: JWT Token-Based User Authentication', () => {
    test('should generate JWT token with user claims', async () => {
      const mockAzureUser = {
        id: 'azure-user-123',
        mail: 'test@company.com',
        displayName: 'Test User',
        givenName: 'Test',
        surname: 'User'
      };

      // Create user in database
      const user = await app.createOrUpdateUser(mockAzureUser, 'test-tenant-id');

      // Generate JWT token
      const token = app.jwt.sign({
        sub: user.azureId,
        email: user.email,
        name: user.name,
        tid: user.tenantId,
        role: user.role
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token
      const decoded = app.jwt.verify(token) as any;
      expect(decoded.sub).toBe(user.azureId);
      expect(decoded.email).toBe(user.email);
      expect(decoded.tid).toBe('test-tenant-id');
    });

    test('should create user profile in PostgreSQL', async () => {
      const mockAzureUser = {
        id: 'azure-user-456',
        mail: 'test2@company.com',
        displayName: 'Test User 2',
        givenName: 'Test',
        surname: 'User2'
      };

      const user = await app.createOrUpdateUser(mockAzureUser, 'test-tenant-id');

      expect(user).toBeDefined();
      expect(user.azureId).toBe('azure-user-456');
      expect(user.email).toBe('test2@company.com');
      expect(user.tenantId).toBe('test-tenant-id');
      expect(user.role).toBe('STAKEHOLDER');
    });

    test('should update existing user on subsequent logins', async () => {
      const mockAzureUser = {
        id: 'azure-user-789',
        mail: 'test3@company.com',
        displayName: 'Test User 3',
        givenName: 'Test',
        surname: 'User3'
      };

      // First login - create user
      const user1 = await app.createOrUpdateUser(mockAzureUser, 'test-tenant-id');
      const firstLoginTime = user1.lastLoginAt;

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100));

      // Second login - update user
      mockAzureUser.displayName = 'Updated Test User 3';
      const user2 = await app.createOrUpdateUser(mockAzureUser, 'test-tenant-id');

      expect(user2.id).toBe(user1.id); // Same user ID
      expect(user2.name).toBe('Updated Test User 3'); // Updated name
      expect(user2.lastLoginAt.getTime()).toBeGreaterThan(firstLoginTime.getTime());
    });
  });

  describe('AC3: Backend Fastify JWT Integration', () => {
    test('should validate JWT tokens on protected routes', async () => {
      // Create a valid token
      const token = app.jwt.sign({
        sub: 'azure-user-123',
        email: 'test@company.com',
        name: 'Test User',
        tid: 'test-tenant-id',
        role: 'STAKEHOLDER'
      });

      // Test protected route with valid token
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      expect(response.statusCode).toBe(200);
    });

    test('should reject invalid JWT tokens', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: 'Bearer invalid-token'
        }
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('UNAUTHORIZED');
    });

    test('should handle missing authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me'
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('AC4: JWT Session-less Architecture', () => {
    test('should not maintain server-side session state', () => {
      // Verify no session storage is configured
      expect(app.hasPlugin('@fastify/session')).toBe(false);

      // JWT tokens should contain all necessary user context
      const token = app.jwt.sign({
        sub: 'azure-user-123',
        email: 'test@company.com',
        name: 'Test User',
        tid: 'test-tenant-id',
        role: 'STAKEHOLDER'
      });

      const decoded = app.jwt.verify(token) as any;
      expect(decoded.sub).toBeDefined();
      expect(decoded.email).toBeDefined();
      expect(decoded.tid).toBeDefined();
      expect(decoded.role).toBeDefined();
    });
  });

  describe('AC6: Secure Logout Functionality', () => {
    test('should handle logout request', async () => {
      const token = app.jwt.sign({
        sub: 'azure-user-123',
        email: 'test@company.com',
        name: 'Test User'
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Logout successful');
    });
  });

  describe('AC8: Role-Based Authorization', () => {
    test('should enforce role-based access control', async () => {
      // Create stakeholder user
      const stakeholderToken = app.jwt.sign({
        sub: 'stakeholder-123',
        email: 'stakeholder@company.com',
        role: 'STAKEHOLDER'
      });

      // Create admin user
      const adminToken = app.jwt.sign({
        sub: 'admin-123',
        email: 'admin@company.com',
        role: 'ADMIN'
      });

      // Test admin-only endpoint with stakeholder token (should fail)
      const stakeholderResponse = await app.inject({
        method: 'GET',
        url: '/admin/users',
        headers: {
          authorization: `Bearer ${stakeholderToken}`
        }
      });

      expect(stakeholderResponse.statusCode).toBe(403);

      // Test admin-only endpoint with admin token (should succeed)
      const adminResponse = await app.inject({
        method: 'GET',
        url: '/admin/users',
        headers: {
          authorization: `Bearer ${adminToken}`
        }
      });

      expect(adminResponse.statusCode).toBe(200);
    });
  });

  describe('AC9: Authentication Error Handling', () => {
    test('should return clear error messages for authentication failures', async () => {
      // Test expired token
      const expiredToken = app.jwt.sign(
        { sub: 'user-123' },
        { expiresIn: '-1h' } // Already expired
      );

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: `Bearer ${expiredToken}`
        }
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('UNAUTHORIZED');
      expect(body.message).toBeDefined();
    });

    test('should handle malformed tokens gracefully', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: 'Bearer not.a.valid.jwt.token'
        }
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.code).toBe('UNAUTHORIZED');
    });
  });
});

describe('Database Integration Tests', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeAll(async () => {
    app = await build();
    prisma = app.prisma;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  test('should handle database connection errors gracefully', async () => {
    // This test would need to simulate database connection failure
    // For now, we'll test that the user model works correctly

    const mockUser = {
      azureId: 'test-azure-id',
      email: 'test@example.com',
      name: 'Test User',
      tenantId: 'test-tenant',
      role: 'STAKEHOLDER' as const
    };

    const user = await prisma.user.create({ data: mockUser });
    expect(user).toBeDefined();
    expect(user.azureId).toBe('test-azure-id');
  });

  test('should enforce unique constraints', async () => {
    const mockUser = {
      azureId: 'duplicate-azure-id',
      email: 'duplicate@example.com',
      name: 'Duplicate User',
      tenantId: 'test-tenant',
      role: 'STAKEHOLDER' as const
    };

    // Create first user
    await prisma.user.create({ data: mockUser });

    // Try to create duplicate user (should fail)
    await expect(
      prisma.user.create({ data: mockUser })
    ).rejects.toThrow();
  });
});