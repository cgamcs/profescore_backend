import { CorsOptions } from 'cors';

const allowedOrigins = [
  process.env.FRONTEND_URL // Frontend
];

console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Backend URL:', process.env.BACKEND_URL);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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

export default corsOptions;