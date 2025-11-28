"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const artifactRoutes = async (fastify) => {
    // Get all artifacts
    fastify.get('/', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Get all artifacts for the authenticated user',
            tags: ['Artifacts'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for future stories
        return { message: 'Artifact routes will be implemented in future stories' };
    });
    // Create new artifact
    fastify.post('/', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Create a new artifact',
            tags: ['Artifacts'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for future stories
        return { message: 'Artifact creation will be implemented in future stories' };
    });
    // Get artifact by ID
    fastify.get('/:id', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Get artifact by ID',
            tags: ['Artifacts'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for future stories
        return { message: 'Artifact detail routes will be implemented in future stories' };
    });
};
exports.default = artifactRoutes;
//# sourceMappingURL=artifacts.js.map