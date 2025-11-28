import { FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  validation?: any[];
}

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error: FastifyError | CustomError, request, reply) => {
    // Log the error
    fastify.logger.error('Request error', {
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
        statusCode: (error as any).statusCode
      },
      request: {
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query,
        headers: {
          'user-agent': request.headers['user-agent'],
          'content-type': request.headers['content-type']
        },
        userId: request.user?.id
      }
    });

    // Handle different types of errors
    if (error.statusCode) {
      // Already has a status code
      return reply.status(error.statusCode).send({
        code: error.code || 'ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Validation errors
    if (error.code === 'FST_ERR_VALIDATION') {
      return reply.status(400).send({
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: (error as any).validation || [],
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // JWT errors
    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
      return reply.status(401).send({
        code: 'INVALID_TOKEN',
        message: 'Invalid authorization token',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      return reply.status(401).send({
        code: 'TOKEN_EXPIRED',
        message: 'Authorization token has expired',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Rate limit errors
    if (error.code === 'FST_TOO_MANY_REQUESTS') {
      return reply.status(429).send({
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Database errors
    if (error.message?.includes('Prisma') || error.message?.includes('database')) {
      return reply.status(500).send({
        code: 'DATABASE_ERROR',
        message: 'A database error occurred',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Redis errors
    if (error.message?.includes('Redis') || error.message?.includes('ECONNREFUSED')) {
      return reply.status(503).send({
        code: 'CACHE_ERROR',
        message: 'Cache service temporarily unavailable',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Azure AD / Authentication errors
    if (error.message?.includes('Azure') || error.message?.includes('MSAL')) {
      return reply.status(401).send({
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication service error',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Network/External service errors
    if (error.message?.includes('ENOTFOUND') || error.message?.includes('ETIMEDOUT')) {
      return reply.status(503).send({
        code: 'EXTERNAL_SERVICE_ERROR',
        message: 'External service temporarily unavailable',
        timestamp: new Date().toISOString(),
        path: request.url
      });
    }

    // Generic server errors
    return reply.status(500).send({
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: error.stack?.split('\n').slice(0, 10) // Limit stack trace in dev
      })
    });
  });

  // Set not found handler
  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      code: 'NOT_FOUND',
      message: `Route ${request.method}:${request.url} not found`,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  });
};

export { errorHandlerPlugin };
export default fp(errorHandlerPlugin);