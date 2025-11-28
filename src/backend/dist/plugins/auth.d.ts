import { FastifyPluginAsync } from 'fastify';
interface AzureADConfig {
    tenantId: string;
    clientId: string;
    authority: string;
    graphBaseUrl: string;
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        azureConfig: AzureADConfig;
    }
}
declare const authPlugin: FastifyPluginAsync;
export { authPlugin };
declare module 'fastify' {
    interface FastifyInstance {
        validateAzureToken: (accessToken: string) => Promise<any>;
        createOrUpdateUser: (azureUser: any, tenantId: string) => Promise<any>;
        requireRole: (requiredRoles: string | string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        requireProjectAccess: (requiredRoles: string | string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare const _default: FastifyPluginAsync;
export default _default;
