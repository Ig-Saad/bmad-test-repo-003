"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
const corsPlugin = async (fastify) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000'
    ];
    await fastify.register(cors_1.default, {
        origin: (origin, cb) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin)
                return cb(null, true);
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
exports.corsPlugin = corsPlugin;
exports.default = (0, fastify_plugin_1.default)(corsPlugin);
//# sourceMappingURL=cors.js.map