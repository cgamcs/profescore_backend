import type { Request, Response, NextFunction } from 'express'
import Faculty, { IFaculty } from '../models/Faculty';

export async function facultyExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { facultyId } = req.params
        const faculty = await Faculty.findById(facultyId)
            .populate('subjects')
            .populate({
                path: 'departments',
                model: 'Department',
                select: 'name'
            })

        if(!faculty) {
            const error = new Error('Facultad no encontrada middleware')
            
            res.status(404).json({ error: error.message })
            return
        }

        req.faculty = faculty

        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error'})
    }
}