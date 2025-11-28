import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return cb(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      // Allow localhost with any port for development
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return cb(null, true);
      }

      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ]
  });
};

export { corsPlugin };
export default fp(corsPlugin);