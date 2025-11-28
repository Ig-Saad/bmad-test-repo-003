"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projectRoutes = async (fastify) => {
    // Get all projects
    fastify.get('/', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Get all projects for the authenticated user',
            tags: ['Projects'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for Story 1.3
        return { message: 'Project routes will be implemented in Story 1.3' };
    });
    // Create new project
    fastify.post('/', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Create a new project',
            tags: ['Projects'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for Story 1.3
        return { message: 'Project creation will be implemented in Story 1.3' };
    });
    // Get project by ID
    fastify.get('/:id', {
        preHandler: fastify.authenticate,
        schema: {
            description: 'Get project by ID',
            tags: ['Projects'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for Story 1.3
        return { message: 'Project detail routes will be implemented in Story 1.3' };
    });
};
exports.default = projectRoutes;
//# sourceMappingURL=projects.js.map