import type { Request, Response, NextFunction } from 'express'
import Subject, { ISubject } from '../models/Subject';

declare global {
    namespace Express {
        interface Request {
            subject: ISubject
        }
    }
}

export async function subjectExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { subjectId } = req.params
        const subject = await Subject.findById(subjectId)

        if(!subject) {
            const error = new Error('Materia no encontrada')
            
            res.status(404).json({ error: error.message })
            return
        }

        req.subject = subject

        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error'})
    }
}


export function subjectBelongsToFaculty( req: Request, res: Response, next: NextFunction ) {
    if (req.subject.faculty.toString() !== req.faculty.id.toString()) {
        const error = new Error('Acción no valida')
        res.status(400).json({ error: error.message })
        return
    }
    
    next()
}