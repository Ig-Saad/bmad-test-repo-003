export interface UserInfo {
    id: string;
    azureId: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
}
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            azureId: string;
            email: string;
            name: string;
            role: string;
            tenantId: string;
        };
        user: UserInfo;
    }
}
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
