import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors';
import { connectDB } from './config/db';
import facultyRoutes from './routes/facultyRoutes';
import adminRoutes from './routes/adminRoutes';
import User from './models/User';

connectDB();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

// Endpoint para manejar las solicitudes de FingerprintJS
app.post('/fingerprint', async (req, res) => {
    try {
      const { fingerprint, ip } = req.body;
      const user = await User.findOneAndUpdate(
        { fingerprint },
        { ip, lastSeen: new Date() },
        { upsert: true, new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar fingerprint' });
    }
});

// Rutas públicas
app.use('/api/faculties', facultyRoutes);

// Rutas administrativas (login y operaciones protegidas)
app.use('/api/admin', adminRoutes);

export default app;
