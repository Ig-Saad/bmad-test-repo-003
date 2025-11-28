import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  // Register Swagger
  await fastify.register(swagger, {
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
  await fastify.register(swaggerUi, {
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

export { swaggerPlugin };
export default fp(swaggerPlugin);