"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./types");
// Load environment variables
dotenv_1.default.config();
// Import plugins and routes
const auth_1 = require("./plugins/auth");
const cors_1 = require("./plugins/cors");
const helmet_1 = require("./plugins/helmet");
const rateLimit_1 = require("./plugins/rateLimit");
const swagger_1 = require("./plugins/swagger");
const telemetry_1 = require("./plugins/telemetry");
const errorHandler_1 = require("./plugins/errorHandler");
const externalServices_1 = __importDefault(require("./plugins/externalServices"));
// Import routes
const auth_2 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const agents_1 = __importDefault(require("./routes/agents"));
const artifacts_1 = __importDefault(require("./routes/artifacts"));
const telemetry_2 = __importDefault(require("./routes/telemetry"));
const config_1 = __importDefault(require("./routes/config"));
// Initialize database and cache
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
const redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
});
// Initialize logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        ...(process.env.LOG_FILE_ENABLED === 'true' ? [
            new winston_1.default.transports.File({
                filename: process.env.LOG_FILE_PATH || './logs/application.log',
                maxsize: 20 * 1024 * 1024, // 20MB
                maxFiles: 14
            })
        ] : [])
    ],
});
// Create Fastify server
const server = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    bodyLimit: parseInt(process.env.MAX_REQUEST_SIZE?.replace('mb', '') || '10') * 1024 * 1024,
});
// Decorate Fastify instance
server.decorate('prisma', prisma);
server.decorate('redis', redis);
server.decorate('logger', logger);
async function start() {
    try {
        // Connect to Redis
        await redis.connect();
        logger.info('Connected to Redis');
        // Test database connection
        await prisma.$connect();
        logger.info('Connected to PostgreSQL');
        // Register plugins
        await server.register(cors_1.corsPlugin);
        await server.register(helmet_1.helmetPlugin);
        await server.register(rateLimit_1.rateLimitPlugin);
        await server.register(auth_1.authPlugin);
        await server.register(externalServices_1.default);
        await server.register(swagger_1.swaggerPlugin);
        await server.register(telemetry_1.telemetryPlugin);
        await server.register(errorHandler_1.errorHandlerPlugin);
        // Register routes
        await server.register(auth_2.default, { prefix: '/api/v1/auth' });
        await server.register(projects_1.default, { prefix: '/api/v1/projects' });
        await server.register(agents_1.default, { prefix: '/api/v1/agents' });
        await server.register(artifacts_1.default, { prefix: '/api/v1/artifacts' });
        await server.register(telemetry_2.default, { prefix: '/api/v1/telemetry' });
        await server.register(config_1.default, { prefix: '/api/v1/config' });
        // Health check endpoint
        server.get('/health', async (request, reply) => {
            try {
                await prisma.$queryRaw `SELECT 1`;
                await redis.ping();
                return {
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    services: {
                        database: 'connected',
                        redis: 'connected'
                    }
                };
            }
            catch (error) {
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
    }
    catch (error) {
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
        await redis.quit();
        logger.info('Server shut down successfully');
        process.exit(0);
    }
    catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
});
process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    try {
        await server.close();
        await prisma.$disconnect();
        await redis.quit();
        logger.info('Server shut down successfully');
        process.exit(0);
    }
    catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
});
// Start the server
start();
//# sourceMappingURL=server.js.map