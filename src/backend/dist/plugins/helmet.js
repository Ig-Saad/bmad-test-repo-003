"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helmetPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const helmetPlugin = async (fastify) => {
    await fastify.register(helmet_1.default, {
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
exports.helmetPlugin = helmetPlugin;
exports.default = (0, fastify_plugin_1.default)(helmetPlugin);
//# sourceMappingURL=helmet.js.map