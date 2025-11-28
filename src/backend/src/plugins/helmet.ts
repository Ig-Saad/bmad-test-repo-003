import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';

const helmetPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://login.microsoftonline.com", "https://graph.microsoft.com"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  });
};

export { helmetPlugin };
export default fp(helmetPlugin);