"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    process.env.FRONTEND_URL // Frontend
];
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Backend URL:', process.env.BACKEND_URL);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            console.log('Bloqueado por CORS:', origin);
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