import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import facultyRoutes from './routes/facultyRoutes'
import adminRoutes from './routes/adminRoutes'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

// Rutas públicas
app.use('/api/faculties', facultyRoutes);

// Rutas administrativas (login y operaciones protegidas)
app.use('/api/admin', adminRoutes);

export default app