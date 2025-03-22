import type { Request, Response } from 'express';
import Subject from '../models/Subject';
import Professor from '../models/Professor';
import Rating from '../models/Rating';

export class SubjectController {
    static createSubject = async (req: Request, res: Response) => {
        try {
            const subject = new Subject(req.body)
            subject.faculty = req.faculty.id
            req.faculty.subjects.push(subject.id)

            await Promise.allSettled([subject.save(), req.faculty.save()])
            res.send('Materia creada correctamente')
        } catch (error) {
            console.error('Error al eliminar materia:', error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getFacultySubjects = async (req: Request, res: Response) => {
        try {
            const subjects = await Subject.find({ faculty: req.faculty.id }).populate('faculty')
            res.json(subjects)
        } catch (error) {
            console.error('Error al eliminar materia:', error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getSubjectById = async (req: Request, res: Response) => {
        try {
            res.json(req.subject)
        } catch (error) {
            console.error('Error al eliminar materia:', error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateSubject = async (req: Request, res: Response) => {
        try {
            req.subject.name = req.body.name
            req.subject.department = req.body.department
            req.subject.credits = req.body.credits
            req.subject.description = req.body.description
            await req.subject.save()

            res.send('Materia actualizada correctamente')
        } catch (error) {
            console.error('Error al eliminar materia:', error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteSubject = async (req: Request, res: Response) => {
        try {
            // Eliminar la materia de la facultad
            req.faculty.subjects = req.faculty.subjects.filter( subject => subject.id.toString() !== req.subject.id.toString() )

            // Eliminar la materia de todos los profesores relacionados
            await Professor.updateMany( {subjects: req.subject.id}, {$pull: {subjects: req.subject.id}} )

            //  Eliminar todas las calificaciones relacionadas con la materia
            await Rating.deleteMany({ subject: req.subject.id })

            // Ejecutar todas las operaciones juntas
            await Promise.allSettled([
                req.subject.deleteOne(), // Eliminar materia
                req.faculty.save()
            ])

            res.json({
                message: 'Materia eliminada y relaciones actualizadas',
                deletedSubject: req.subject.name
            })
        } catch (error) {
            console.error('Error al eliminar materia:', error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}