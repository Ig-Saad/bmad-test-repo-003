import { FastifyPluginAsync } from 'fastify';
declare const telemetryPlugin: FastifyPluginAsync;
declare module 'fastify' {
    interface FastifyRequest {
        startTime?: number;
    }
}
export { telemetryPlugin };
declare const _default: FastifyPluginAsync;
export default _default;
