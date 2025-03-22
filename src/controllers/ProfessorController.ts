import type { Request, Response } from 'express';
import Professor from '../models/Professor';
import Subject from '../models/Subject';
import Rating from '../models/Rating';

export class ProfessorController {
    static createProfessor = async (req: Request, res: Response) => {
        try {
            // Obtener entidades validadas por el middleware
            const faculty = req.faculty; // Facultad validada
            const subject = req.subject; // Materia validada
            const { name, department, biography } = req.body;

            // Verificar si el profesor ya existe en la facultad
            const existingProfessor = await Professor.findOne({
                name: name.trim(),
                faculty: faculty.id
            });

            if (existingProfessor) {
                // Convertir ObjectIds a strings para comparación
                const subjectIdStr = subject.id.toString();
                const existingSubjects = existingProfessor.subjects.map(id => id.toString());
                // Si ya existe, agregar la materia si no está asignada
                if (!existingSubjects.includes(subjectIdStr)) {
                    existingProfessor.subjects.push(subject.id);
                    await existingProfessor.save();
                }

                // Actualizar materia si no tiene el profesor
                const professorIdStr = existingProfessor.id.toString();
                const subjectProfessors = subject.professors.map(id => id.toString());
                
                if (!subjectProfessors.includes(professorIdStr)) {
                    subject.professors.push(existingProfessor.id);
                    await subject.save();
                }
                
                res.status(201).send('Profesor creado correctamente');
                return
            }

            // Crear nuevo profesor si no existe
            const newProfessor = new Professor({
                name,
                department,
                biography,
                faculty: faculty.id,
                subjects: [subject.id]
            });

            // Actualizar relaciones bidireccionales
            subject.professors.push(newProfessor.id);

            await Promise.allSettled([
                newProfessor.save(),
                subject.save()
            ]);

            res.json({
                message: 'Profesor creado y asignado a la materia',
                professor: newProfessor
            });

        } catch (error) {
            console.error('Error en createProfessor:', error.message);
            res.status(500).json({ error: 'Hubo un error al crear el profesor' });
        }
    }

    static getFacultyProfessors = async (req: Request, res: Response) => {
        try {
            const professors = await Professor.find({ faculty: req.faculty.id })
            res.json(professors)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al mostrar profesores' })
        }
    }

    static getProfessorById = async (req: Request, res: Response) => {
        try {
            res.json(req.professor)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al buscar el profesor' })
        }
    }

    static updateProfessor = async (req: Request, res: Response) => {
        try {
            // Evitar duplicados
            if (req.body.name) {
                const existing = await Professor.findOne({ 
                    name: req.body.name.trim(),
                    faculty: req.professor.faculty,
                    _id: { $ne: req.professor }
                });
                if (existing) {
                    res.status(400).json({ error: 'Ya existe un profesor con este nombre' })
                    return
                }
            }

            // Actualizar
            Object.assign(req.professor, req.body)

            await req.professor.save()

            res.send('Profesor actualizadao correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al actualizar el profesor' })
        }
    }

    static deleteProfessor = async (req: Request, res: Response) => {
        try {
            // Ejecutar todas las operaciones juntas
            await Promise.allSettled([
                req.professor.deleteOne(), // Elimina al profesor
                Rating.deleteMany({ professor: req.professor.id }), // Elimina las calificaciones asociadas al profesor
                Subject.updateMany({professors: req.professor.id}, {$pull: {professors: req.professor.id} }) // Elimina la referencia del profesor en las materias
            ])

            res.send('Profesor eliminado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al eliminar el profesor' })
        }
    }
}