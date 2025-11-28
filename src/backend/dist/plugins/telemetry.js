"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetryPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const telemetryPlugin = async (fastify) => {
    // Add telemetry hooks
    fastify.addHook('onRequest', async (request, reply) => {
        // Track request start time
        request.startTime = Date.now();
    });
    fastify.addHook('onResponse', async (request, reply) => {
        // Calculate response time
        const responseTime = Date.now() - (request.startTime || Date.now());
        // Log API metrics
        fastify.logger.info('API Request', {
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            responseTime: responseTime,
            userAgent: request.headers['user-agent'],
            ip: request.ip,
            userId: request.user?.id || null
        });
        // Store telemetry event for important operations
        if (request.url.startsWith('/api/v1') && request.method !== 'GET') {
            try {
                await fastify.prisma.telemetryEvent.create({
                    data: {
                        eventType: 'api_request',
                        userId: request.user?.id || null,
                        data: {
                            method: request.method,
                            endpoint: request.url,
                            statusCode: reply.statusCode,
                            responseTime: responseTime,
                            userAgent: request.headers['user-agent'],
                            ip: request.ip
                        }
                    }
                });
            }
            catch (error) {
                // Silently fail - don't let telemetry errors break the API
                fastify.logger.warn('Failed to store telemetry event:', error);
            }
        }
    });
    fastify.addHook('onError', async (request, reply, error) => {
        // Log errors with context
        fastify.logger.error('API Error', {
            method: request.method,
            url: request.url,
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code
            },
            userId: request.user?.id || null,
            ip: request.ip
        });
        // Store error telemetry
        try {
            await fastify.prisma.telemetryEvent.create({
                data: {
                    eventType: 'api_error',
                    userId: request.user?.id || null,
                    data: {
                        method: request.method,
                        endpoint: request.url,
                        error: {
                            message: error.message,
                            code: error.code,
                            statusCode: error.statusCode
                        },
                        userAgent: request.headers['user-agent'],
                        ip: request.ip
                    }
                }
            });
        }
        catch (telemetryError) {
            // Silently fail - don't let telemetry errors break the API
            fastify.logger.warn('Failed to store error telemetry:', telemetryError);
        }
    });
    // Extend request interface for telemetry
    fastify.decorateRequest('startTime', null);
};
exports.telemetryPlugin = telemetryPlugin;
exports.default = (0, fastify_plugin_1.default)(telemetryPlugin);
//# sourceMappingURL=telemetry.js.map