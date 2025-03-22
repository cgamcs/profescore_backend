import type { Request, Response, NextFunction } from 'express'
import Professor, { IProfessor } from '../models/Professor';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            professor: IProfessor
        }
    }
}

export async function professorExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { professorId } = req.params

        if (!mongoose.Types.ObjectId.isValid(professorId)) {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }

        const professor = await Professor.findById(professorId)
        if(!professor) {
            const error = new Error('Profesor no encontrado')
            
            res.status(404).json({ error: error.message })
            return
        }

        req.professor = professor

        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error'})
    }
}