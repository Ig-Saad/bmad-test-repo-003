import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import winston from 'winston';
import dotenv from 'dotenv';
import './types';

// Load environment variables
dotenv.config();

// Import plugins and routes
import { authPlugin } from './plugins/auth';
import { corsPlugin } from './plugins/cors';
import { helmetPlugin } from './plugins/helmet';
import { rateLimitPlugin } from './plugins/rateLimit';
import { swaggerPlugin } from './plugins/swagger';
import { telemetryPlugin } from './plugins/telemetry';
import { errorHandlerPlugin } from './plugins/errorHandler';
import externalServicesPlugin from './plugins/externalServices';
import bmadFrameworkPlugin from './plugins/bmadFramework';
import redisPlugin from './plugins/redis';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import agentRoutes from './routes/agents';
import artifactRoutes from './routes/artifacts';
import telemetryRoutes from './routes/telemetry';
import configRoutes from './routes/config';
import bmadRoutes from './routes/bmad';

// Initialize database and cache
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Redis is optional - will gracefully degrade if not available
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';
const redis = REDIS_ENABLED ? createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
}) : null;

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    ...(process.env.LOG_FILE_ENABLED === 'true' ? [
      new winston.transports.File({
        filename: process.env.LOG_FILE_PATH || './logs/application.log',
        maxsize: 20 * 1024 * 1024, // 20MB
        maxFiles: 14
      })
    ] : [])
  ],
});

// Create Fastify server
const server: FastifyInstance = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
  bodyLimit: parseInt(process.env.MAX_REQUEST_SIZE?.replace('mb', '') || '10') * 1024 * 1024,
});

// Declare decorators for TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: typeof redis | null;
    logger: winston.Logger;
  }
}

// Decorate Fastify instance
server.decorate('prisma', prisma);
server.decorate('redis', redis);
server.decorate('logger', logger);

async function start() {
  try {
    // Connect to Redis (optional)
    if (redis) {
      try {
        await redis.connect();
        logger.info('Connected to Redis');
      } catch (error) {
        logger.warn('Redis not available - running without cache:', error);
      }
    } else {
      logger.info('Redis disabled - running without cache');
    }

    // Test database connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL');

    // Register plugins
    await server.register(corsPlugin);
    await server.register(helmetPlugin);
    await server.register(rateLimitPlugin);
    await server.register(authPlugin);
    await server.register(redisPlugin);
    await server.register(externalServicesPlugin);
    await server.register(bmadFrameworkPlugin);
    await server.register(swaggerPlugin);
    await server.register(telemetryPlugin);
    await server.register(errorHandlerPlugin);

    // Register routes
    await server.register(authRoutes, { prefix: '/api/v1/auth' });
    await server.register(projectRoutes, { prefix: '/api/v1/projects' });
    await server.register(agentRoutes, { prefix: '/api/v1/agents' });
    await server.register(artifactRoutes, { prefix: '/api/v1/artifacts' });
    await server.register(telemetryRoutes, { prefix: '/api/v1/telemetry' });
    await server.register(configRoutes, { prefix: '/api/v1/config' });
    await server.register(bmadRoutes, { prefix: '/api/v1/bmad' });

    // Health check endpoint
    server.get('/health', async (request, reply) => {
      try {
        await prisma.$queryRaw`SELECT 1`;

        let redisStatus = 'disabled';
        if (redis) {
          try {
            await redis.ping();
            redisStatus = 'connected';
          } catch (error) {
            redisStatus = 'disconnected';
          }
        }

        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            database: 'connected',
            redis: redisStatus
          }
        };
      } catch (error) {
        reply.code(503);
        return {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Start server
    const host = process.env.HOST || 'localhost';
    const port = parseInt(process.env.PORT || '3001');

    await server.listen({ host, port });
    logger.info(`BMad v6 Platform API Server listening on ${host}:${port}`);
    logger.info(`API Documentation available at http://${host}:${port}/docs`);

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');

  try {
    await server.close();
    await prisma.$disconnect();
    if (redis) {
      await redis.quit();
    }
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');

  try {
    await server.close();
    await prisma.$disconnect();
    if (redis) {
      await redis.quit();
    }
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
start();