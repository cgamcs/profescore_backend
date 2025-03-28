import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors';
import { connectDB } from './config/db';
import facultyRoutes from './routes/facultyRoutes';
import adminRoutes from './routes/adminRoutes';

connectDB();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint para manejar las solicitudes de FingerprintJS
app.post('/api/fingerprint', (req, res) => {
  console.log('Datos del visitante:', req.body);
  res.status(200).json({ message: 'Datos del visitante recibidos' });
});

// Rutas públicas
app.use('/api/faculties', facultyRoutes);

// Rutas administrativas (login y operaciones protegidas)
app.use('/api/admin', adminRoutes);

export default app;
