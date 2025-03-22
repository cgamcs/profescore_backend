import type { Request, Response, NextFunction } from 'express'
import Rating, { IRating } from '../models/Rating';

declare global {
    namespace Express {
        interface Request {
            rating: IRating
        }
    }
}

export async function ratingExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { ratingId } = req.params;
        const rating = await Rating.findById(ratingId);

        if (!rating) {
            res.status(404).json({ error: 'Calificación no encontrada' })
            return 
        }

        req.rating = rating;
        next();
    } catch (error) {
        res.status(500).json({ 
            error: 'Error al validar la calificación',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}

export async function ratingBelongsToProfessor(req: Request, res: Response, next: NextFunction) {
    const { professorId } = req.params;
    
    if (req.rating.professor.toString() !== professorId) {
        res.status(403).json({ error: 'La calificación no pertenece a este profesor' })
        return 
    }

    next();
}