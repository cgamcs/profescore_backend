import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import facultyRoutes from './routes/facultyRoutes'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

// Routes
app.use('/api/faculties', facultyRoutes)

export default app