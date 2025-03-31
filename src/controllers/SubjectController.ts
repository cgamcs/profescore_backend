import type { Request, Response } from 'express';
import Subject from '../models/Subject';
import Professor from '../models/Professor';
import Rating from '../models/Rating';
import Department from '../models/Department';
import Faculty from '../models/Faculty';

// Función para eliminar acentos y convertir a minúsculas
const normalizeName = (name: string): string => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export class SubjectController {
    static createSubject = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, credits, description, department, professors } = req.body;
    
            // Normalizar el nombre de la materia
            const normalizedName = normalizeName(name);
    
            // Verificar que no exista una materia con el mismo nombre normalizado en la misma facultad
            const existingSubject = await Subject.findOne({
                normalizedName: normalizedName,
                faculty: req.faculty.id
            });
    
            if (existingSubject) {
                res.status(400).json({ error: 'Ya existe una materia con ese nombre en esta facultad' });
                return;
            }
    
            // Verificar que el departamento pertenezca a la facultad
            const departmentExists = await Department.findOne({
                _id: department,
                faculty: req.faculty.id
            });
    
            if (!departmentExists) {
                res.status(400).json({ error: 'Departamento no válido' });
                return;
            }
    
            // Crear la materia y asignarle el departamento
            const subject = new Subject({
                name,
                credits,
                description,
                department, // Se guarda el ObjectId del departamento
                faculty: req.faculty.id, // Se asigna la facultad
                professors,
                normalizedName // Guardar el nombre normalizado en la base de datos
            });
    
            req.faculty.subjects.push(subject.id);
    
            // Guardar la materia y actualizar la facultad
            await Promise.allSettled([subject.save(), req.faculty.save()]);
            res.send('Materia creada correctamente');
        } catch (error) {
            console.error('Error al crear materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getFacultySubjects = async (req: Request, res: Response) => {
        try {
            const subjects = await Subject.find({ faculty: req.params.facultyId })
                .populate('department', 'name') // Ahora funcionará
                .populate('professors', 'name');

            res.json(subjects);
        } catch (error) {
            console.error('Error al traer materias de la facultad:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getAllSubjects = async (req: Request, res: Response) => {
        try {
            const subjects = await Subject.find()
                .populate('department', 'name')
                .populate('professors', 'name')
                .populate('faculty', 'name');

            res.json(subjects);
        } catch (error) {
            console.error('Error al traer todas las materias:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getSubjectProfessors = async (req: Request, res: Response) => {
        try {
            const { subjectId } = req.params;

            const subject = await Subject.findById(subjectId)
                .populate({
                    path: 'professors',
                    select: 'name ratingStats',
                    match: { faculty: req.params.facultyId } // Asegurar que pertenecen a la facultad
                })
                .populate('department', 'name');

            if (!subject) {
                res.status(404).json({ error: 'Materia no encontrada' });
                return;
            }

            // Filtrar profesores que coincidan con la facultad
            const filteredProfessors = subject.professors.filter(p => p !== null);

            res.json(filteredProfessors);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al obtener profesores' });
        }
    };

    static getSubjectById = async (req: Request, res: Response) => {
        try {
            res.json(req.subject);
        } catch (error) {
            console.error('Error al traer materia por ID:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static updateSubject = async (req: Request, res: Response) => {
        try {
            const { name, department, credits, description } = req.body;

            // Verificar que el departamento pertenezca a la facultad
            const departmentExists = await Department.findOne({
                _id: department,
                faculty: req.faculty.id
            });

            if (!departmentExists) {
                res.status(400).json({ error: 'Departamento no válido' });
                return;
            }

            // Actualizar la materia
            req.subject.name = name;
            req.subject.department = department;
            req.subject.credits = credits;
            req.subject.description = description;
            await req.subject.save();

            res.send('Materia actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static deleteSubject = async (req: Request, res: Response) => {
        try {
            // Eliminar la materia de la facultad
            req.faculty.subjects = req.faculty.subjects.filter(subject => subject.id.toString() !== req.subject.id.toString());

            // Eliminar la materia de todos los profesores relacionados
            await Professor.updateMany({ subjects: req.subject.id }, { $pull: { subjects: req.subject.id } });

            //  Eliminar todas las calificaciones relacionadas con la materia
            await Rating.deleteMany({ subject: req.subject.id });

            // Ejecutar todas las operaciones juntas
            await Promise.allSettled([
                req.subject.deleteOne(), // Eliminar materia
                req.faculty.save()
            ]);

            res.json({
                message: 'Materia eliminada y relaciones actualizadas',
                deletedSubject: req.subject.name
            });
        } catch (error) {
            console.error('Error al eliminar materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
