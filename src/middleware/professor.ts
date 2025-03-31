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

export async function professorExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { professorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(professorId)) {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }

        // Use lean() to get a plain JavaScript object that's easier to work with
        const professor = await Professor.findById(professorId)
            .populate('subjects', 'name')
            .populate('department', 'name');

        if (!professor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        // Log to debug
        console.log('Professor subjects:', professor.subjects);
        
        req.professor = professor;
        next();
    } catch (error) {
        console.error('Error in professorExists middleware:', error);
        res.status(500).json({ error: 'Hubo un error al buscar el profesor' });
    }
}