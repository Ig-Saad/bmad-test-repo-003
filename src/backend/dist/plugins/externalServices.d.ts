import { FastifyPluginAsync } from 'fastify';
export interface GitHubConfig {
    repositoryUrl: string;
    token: string;
    webhookSecret?: string;
}
export interface SharePointConfig {
    siteUrl: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
}
export interface IgnisConfig {
    endpoint: string;
    apiKey: string;
    projectId?: string;
}
export interface ValidationResult {
    valid: boolean;
    error?: string;
    details?: any;
}
declare module 'fastify' {
    interface FastifyInstance {
        validateGitHubConfig(config: any): Promise<any>;
        validateSharePointConfig(config: any): Promise<any>;
        validateIgnisConfig(config: any): Promise<any>;
        checkGitHubStatus(config: any): Promise<any>;
        checkSharePointStatus(config: any): Promise<any>;
        checkIgnisStatus(config: any): Promise<any>;
    }
}
declare const _default: FastifyPluginAsync;
export default _default;
