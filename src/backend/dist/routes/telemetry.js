"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telemetryRoutes = async (fastify) => {
    // Get telemetry events
    fastify.get('/events', {
        preHandler: [fastify.authenticate, fastify.requireRole(['ADMIN', 'PROJECT_MANAGER'])],
        schema: {
            description: 'Get telemetry events (Admin/PM only)',
            tags: ['Telemetry'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for future stories
        return { message: 'Telemetry routes will be implemented in future stories' };
    });
    // Get metrics
    fastify.get('/metrics', {
        preHandler: [fastify.authenticate, fastify.requireRole(['ADMIN'])],
        schema: {
            description: 'Get system metrics (Admin only)',
            tags: ['Telemetry'],
            security: [{ BearerAuth: [] }]
        }
    }, async (request, reply) => {
        // Implementation placeholder for future stories
        return { message: 'Metrics routes will be implemented in future stories' };
    });
};
exports.default = telemetryRoutes;
//# sourceMappingURL=telemetry.js.map