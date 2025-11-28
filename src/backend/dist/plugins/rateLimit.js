"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const rateLimitPlugin = async (fastify) => {
    await fastify.register(rate_limit_1.default, {
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
        await fastify.register(rate_limit_1.default, {
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
exports.rateLimitPlugin = rateLimitPlugin;
exports.default = (0, fastify_plugin_1.default)(rateLimitPlugin);
//# sourceMappingURL=rateLimit.js.map