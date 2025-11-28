import { FastifyPluginAsync } from 'fastify';

const agentRoutes: FastifyPluginAsync = async (fastify) => {
  // Get available agents
  fastify.get('/', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Get available BMad v6 agents',
      tags: ['Agents'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    // Implementation placeholder for future stories
    return { message: 'Agent routes will be implemented in future stories' };
  });

  // Engage with an agent
  fastify.post('/:agentId/engage', {
    preHandler: fastify.authenticate,
    schema: {
      description: 'Engage with a BMad v6 agent',
      tags: ['Agents'],
      security: [{ BearerAuth: [] }]
    }
  }, async (request, reply) => {
    // Implementation placeholder for future stories
    return { message: 'Agent engagement will be implemented in future stories' };
  });
};

export default agentRoutes;