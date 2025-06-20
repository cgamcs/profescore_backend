import type { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Faculty, { IFaculty } from '../models/Faculty';
import Professor from '../models/Professor';
import Department from '../models/Department';
import ActivityLog from '../models/ActivityLog';
import colors from 'colors';
import Subject from '../models/Subject';
import Rating from '../models/Rating';

declare module 'express' {
    interface Request {
        faculty?: IFaculty;
    }
}

export class FacultyController {
    static createFaculty = async (req: Request, res: Response) => {
        try {
            const { name, abbreviation, departments } = req.body;
            // 1. Crear la facultad
            const faculty = new Faculty({ name, abbreviation });

            // 2. Crear departamentos y asignarlos a la facultad solo si se proporcionan
            if (departments && departments.length > 0) {
                const createdDepartments = await Department.insertMany(
                    departments.map(name => ({ name, faculty: faculty._id }))
                );

                faculty.departments = createdDepartments.map(d => d._id as Types.ObjectId);
            }

            await faculty.save();

            // Log activity
            await ActivityLog.create({
                type: 'CREATE_FACULTY',
                relatedEntity: faculty._id,
                onModel: 'Faculty'
            });

            res.json(faculty);
        } catch (error) {
            console.log(colors.red.bold(`Error al agregar facultad - ${error.message}`));
        }
    };

    static getHomeData = async (req: Request, res: Response) => {
        try {
            const faculties = await Faculty.find({});
    
            const topProfessors = await Professor.aggregate([
                // Etapa 1: Filtrar profesores que tienen al menos una reseña
                { $match: { 'ratingStats.totalRatings': { $gt: 0 } } },
    
                // Etapa 2: Usar $facet para realizar múltiples agregaciones en una sola etapa
                {
                    $facet: {
                        // Rama 1: Calcular estadísticas globales (promedio de calificaciones y promedio de número de reseñas)
                        "stats": [
                            {
                                $group: {
                                    _id: null,
                                    avg_rating_all: { $avg: '$ratingStats.averageGeneral' }, // C
                                    avg_num_ratings_all: { $avg: '$ratingStats.totalRatings' } // m
                                }
                            }
                        ],
                        // Rama 2: Mantener todos los documentos de los profesores
                        "professors": [
                            { $match: {} } // Coincide con todos los documentos que llegan a esta etapa
                        ]
                    }
                },
    
                // Etapa 3: Desenrollar los resultados para poder acceder a ellos
                { $unwind: '$stats' },
                { $unwind: '$professors' },
    
                // Etapa 4: Añadir las estadísticas globales a cada documento de profesor
                {
                    $addFields: {
                        'professors.C': '$stats.avg_rating_all',
                        'professors.m': '$stats.avg_num_ratings_all'
                    }
                },
    
                // Etapa 5: Reemplazar el documento raíz con el documento del profesor enriquecido
                { $replaceRoot: { newRoot: '$professors' } },
    
                // Etapa 6: Calcular la calificación ponderada
                {
                    $addFields: {
                        weighted_rating: {
                            $add: [
                                {
                                    $multiply: [
                                        { $divide: ['$ratingStats.totalRatings', { $add: ['$ratingStats.totalRatings', '$m'] }] },
                                        '$ratingStats.averageGeneral'
                                    ]
                                },
                                {
                                    $multiply: [
                                        { $divide: ['$m', { $add: ['$ratingStats.totalRatings', '$m'] }] },
                                        '$C'
                                    ]
                                }
                            ]
                        }
                    }
                },
    
                // Etapa 7: Ordenar por la calificación ponderada y limitar a 3
                { $sort: { weighted_rating: -1 } },
                { $limit: 3 },
    
                // Etapa 8: Poblar la información de la facultad
                {
                    $lookup: {
                        from: 'faculties',
                        localField: 'faculty',
                        foreignField: '_id',
                        as: 'facultyInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$facultyInfo",
                        preserveNullAndEmptyArrays: true // Preservar profesores si no se encuentra la facultad
                    }
                },
    
                // Etapa 9: Proyectar los campos finales
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        'faculty.abbreviation': '$facultyInfo.abbreviation',
                        'faculty._id': '$facultyInfo._id',
                        ratingStats: 1,
                        weighted_rating: 1
                    }
                }
            ]);
    
            res.json({ faculties, topProfessors });
        } catch (error) {
            console.log(colors.red.bold(`Error al obtener datos de la página de inicio - ${error.message}`));
            res.status(500).json({ message: "Error al obtener datos de la página de inicio" });
        }
    };

    static getAllFaculties = async (req: Request, res: Response) => {
        try {
            const faculties = await Faculty.find({});

            res.json(faculties);
        } catch (error) {
            console.log(colors.red.bold(`Error al mostrar las facultades - ${error.message}`));
        }
    };

    static getFacultyById = async (req: Request, res: Response) => {
        try {
            res.json(req.faculty);
            console.log(`Desde el backend: ${req.faculty}`);
        } catch (error) {
            console.log(colors.red.bold(`Error al mostrar facultad - ${error.message}`));
        }
    };

    static editFaculty = async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { facultyId } = req.params;
            const { name, abbreviation, departments } = req.body;

            // Validar entrada
            if (!name || !abbreviation || !departments) {
                await session.abortTransaction();
                res.status(400).json({ error: 'Datos incompletos' });
                return;
            }

            const faculty = await Faculty.findById(facultyId).session(session);
            if (!faculty) {
                await session.abortTransaction();
                res.status(404).json({ message: 'Faculty not found' });
                return;
            }

            // Normalizar departamentos
            const normalizedDepartments = departments.map((dep: { _id?: string, name: string }) => {
                if (!dep._id || !mongoose.isValidObjectId(dep._id)) {
                    return { _id: null, name: dep.name };
                }
                return {
                    _id: new mongoose.Types.ObjectId(dep._id),
                    name: dep.name
                };
            });

            // Actualizar departamentos existentes
            const departmentUpdates = normalizedDepartments
                .filter(dep => dep._id !== null)
                .map(async (dep) => {
                    await Department.findByIdAndUpdate(
                        dep._id,
                        { name: dep.name },
                        { session }
                    );
                    return dep._id.toString();
                });

            // Crear nuevos departamentos
            const newDepartments = normalizedDepartments
                .filter(dep => dep._id === null)
                .map(dep => ({
                    name: dep.name,
                    faculty: facultyId
                }));

            let createdDepartmentIds: string[] = [];
            if (newDepartments.length > 0) {
                const createdDepartments = await Department.insertMany(newDepartments, { session });
                createdDepartmentIds = createdDepartments.map(d => d._id.toString());
            }

            // Obtener IDs actualizados
            const updatedDepartmentIds = [
                ...(await Promise.all(departmentUpdates)),
                ...createdDepartmentIds
            ];

            // Identificar departamentos a eliminar
            const currentDepartmentIds = faculty.departments.map(id => id.toString());
            const departmentsToRemove = currentDepartmentIds.filter(
                id => !updatedDepartmentIds.includes(id)
            );

            // Eliminar departamentos removidos
            if (departmentsToRemove.length > 0) {
                await Department.deleteMany(
                    { _id: { $in: departmentsToRemove } },
                    { session }
                );
            }

            // Actualizar facultad
            faculty.name = name;
            faculty.abbreviation = abbreviation;
            faculty.departments = updatedDepartmentIds.map(id => new mongoose.Types.ObjectId(id));

            await faculty.save({ session });

            // Registrar actividad
            await ActivityLog.create([{
                type: 'UPDATE_FACULTY',
                relatedEntity: faculty._id,
                onModel: 'Faculty',
                changes: JSON.stringify({ name, abbreviation, departments })
            }], { session });

            await session.commitTransaction();
            res.json(faculty);
        } catch (error) {
            await session.abortTransaction();
            console.log(colors.red.bold(`Error al actualizar facultad - ${error.message}`));
            res.status(500).json({
                error: 'Error actualizando facultad',
                details: error.message
            });
        } finally {
            session.endSession();
        }
    };

    static deleteFaculty = async (req: Request, res: Response) => {
        const { facultyId } = req.params;
    
        try {
            // Buscar la facultad por su ID
            const faculty = await Faculty.findById(facultyId);
    
            if (!faculty) {
                res.status(404).json({ message: 'Facultad no encontrada' });
                return;
            }
    
            // Eliminar la facultad
            await Faculty.findByIdAndDelete(facultyId);
    
            // Eliminar los departamentos asociados a la facultad
            await Department.deleteMany({ faculty: facultyId });
    
            // Eliminar los profesores asociados a la facultad
            await Professor.deleteMany({ faculty: facultyId });
    
            // Eliminar las materias asociadas a la facultad
            await Subject.deleteMany({ faculty: facultyId });
    
            // Registrar actividad
            await ActivityLog.create({
                type: 'DELETE_FACULTY',
                relatedEntity: facultyId,
                onModel: 'Faculty'
            });
    
            res.json({ message: 'Facultad eliminada exitosamente' });
        } catch (error) {
            console.log(colors.red.bold(`Error al eliminar facultad - ${error.message}`));
            res.status(500).json({ message: 'Error al eliminar la facultad', error: error.message });
        }
    };

    static getFacultyDepartments = async (req: Request, res: Response) => {
        try {
            const faculty = await Faculty.findById(req.params.facultyId).populate('departments');
            res.json(faculty?.departments || []);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching departments' });
        }
    };

    static addDepartment = async (req: Request, res: Response) => {
        try {
            const faculty = await Faculty.findByIdAndUpdate(
                req.params.facultyId,
                { $push: { departments: { name: req.body.name } } },
                { new: true }
            );
            res.json(faculty?.departments);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar departamento' });
        }
    };

    static deleteDepartment = async (req: Request, res: Response) => {
        try {
            const { facultyId, departmentId } = req.params;

            // Eliminar el departamento de la facultad
            const faculty = await Faculty.findByIdAndUpdate(
                facultyId,
                { $pull: { departments: departmentId } },
                { new: true }
            );

            if (!faculty) {
                return res.status(404).json({ error: 'Facultad no encontrada' });
            }

            // Eliminar el departamento de la base de datos
            await Department.findByIdAndDelete(departmentId);

            res.json(faculty.departments);
        } catch (error) {
            console.log(colors.red.bold(`Error al eliminar departamento - ${error.message}`));
            res.status(500).json({ error: 'Error eliminando departamento' });
        }
    };

    static topRatedProfessors = async (req: Request, res: Response) => {
        try {
            const professors = await Professor.find()
                .populate('faculty', 'abbreviation')
                .populate('subjects', 'name')
                .populate('department', 'name');

            // Ordenar por calificación y cantidad de reseñas
            const sortedProfessors = professors
                .sort((a, b) => b.ratingStats.averageGeneral - a.ratingStats.averageGeneral ||
                    b.ratingStats.totalRatings - a.ratingStats.totalRatings)
                .slice(0, 3); // Los 3 mejores

            res.json(sortedProfessors);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los profesores mejor calificados' });
        }
    };
}

const updateDepartments = async (facultyId, newDepartments) => {
    // Obtener los departamentos actuales de la facultad
    const faculty = await Faculty.findById(facultyId);
    const currentDepartments = faculty.departments;

    // Eliminar departamentos que ya no están en la lista
    const departmentsToRemove = currentDepartments.filter(
        (dep) => !newDepartments.includes(dep)
    );
    await Department.deleteMany({ name: { $in: departmentsToRemove }, faculty: facultyId });

    // Agregar o actualizar departamentos
    for (const depName of newDepartments) {
        await Department.updateOne(
            { name: depName, faculty: facultyId },
            { name: depName, faculty: facultyId },
            { upsert: true }
        );
    }
};