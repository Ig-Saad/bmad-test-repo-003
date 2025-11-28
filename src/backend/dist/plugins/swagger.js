"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const swaggerPlugin = async (fastify) => {
    // Register Swagger
    await fastify.register(swagger_1.default, {
        swagger: {
            info: {
                title: 'BMad v6-Powered SDLC Platform API',
                description: 'Revolutionary AI-driven agile workflow platform with intelligent agent orchestration',
                version: '1.0.0',
                contact: {
                    name: 'BMad Platform Team',
                    email: 'support@bmad-platform.com'
                },
                license: {
                    name: 'MIT',
                    url: 'https://opensource.org/licenses/MIT'
                }
            },
            host: process.env.API_HOST || 'localhost:3001',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Enter JWT token in format: Bearer {token}'
                }
            },
            security: [{ BearerAuth: [] }],
            tags: [
                { name: 'Authentication', description: 'User authentication and authorization' },
                { name: 'Projects', description: 'Project management and BMad v6 workflow tracking' },
                { name: 'Agents', description: 'AI agent orchestration and engagement' },
                { name: 'Artifacts', description: 'Document and artifact management' },
                { name: 'Telemetry', description: 'Observability and performance tracking' }
            ]
        },
        transform: ({ schema, url }) => {
            // Transform schema for better API documentation
            return {
                schema: {
                    ...schema,
                    hide: schema.hide || false
                },
                url
            };
        }
    });
    // Register Swagger UI
    await fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                // Add custom headers or authentication if needed
                next();
            },
            preHandler: function (request, reply, next) {
                // Pre-handler logic for Swagger UI
                next();
            }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            // Transform the OpenAPI specification before serving
            return swaggerObject;
        },
        transformSpecificationClone: true
    });
};
exports.swaggerPlugin = swaggerPlugin;
exports.default = (0, fastify_plugin_1.default)(swaggerPlugin);
//# sourceMappingURL=swagger.js.map