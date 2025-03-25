import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Frontend
  'http://localhost:4000'  // Backend (si es necesario)
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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

export default corsOptions;