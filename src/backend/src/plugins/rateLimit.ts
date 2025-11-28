import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    errorResponseBuilder: (request, context) => {
      return {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Try again in ${Math.round(context.ttl / 1000)} seconds.`,
        retryAfter: context.ttl
      };
    }
  });

  // Separate rate limit for API routes
  fastify.register(async function (fastify) {
    await fastify.register(rateLimit, {
      max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '100'),
      timeWindow: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
      keyGenerator: (request) => {
        // Use user ID if authenticated, otherwise use IP
        return request.user?.id || request.ip;
      },
      errorResponseBuilder: (request, context) => {
        return {
          code: 'API_RATE_LIMIT_EXCEEDED',
          message: 'API rate limit exceeded. Please slow down your requests.',
          retryAfter: context.ttl
        };
      }
    });
  }, { prefix: '/api' });
};

export { rateLimitPlugin };
export default fp(rateLimitPlugin);