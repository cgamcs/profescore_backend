"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    process.env.FRONTEND_URL, // Frontend
    process.env.BACKEND_URL // Backend (si es necesario)
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Fingerprint'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
exports.default = corsOptions;
//# sourceMappingURL=cors.js.map