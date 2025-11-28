import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  // Redis is already decorated on the fastify instance in server.ts
  // This plugin just ensures the redis dependency is registered for other plugins

  // Add any redis-specific decorators or utilities here if needed
  fastify.log.info('Redis plugin registered');
};

export default fp(redisPlugin, {
  name: 'redis',
  dependencies: []
});