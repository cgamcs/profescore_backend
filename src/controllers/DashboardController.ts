/* import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Faculty, { IFaculty } from '../models/Faculty';
import Department, { IDepartment } from '../models/Department';
import Subject, { ISubject } from '../models/Subject';
import Professor, { IProfessor } from '../models/Professor';
import Rating from '../models/Rating';
import ActivityLog from '../models/ActivityLog';

export class DashboardController {
    // Get dashboard statistics
    static async getDashboardStats(req: Request, res: Response) {
        try {
            const [facultiesCount, subjectsCount, professorsCount, ratingsCount] = await Promise.all([
                Faculty.countDocuments(),
                Subject.countDocuments(),
                Professor.countDocuments(),
                Rating.countDocuments()
            ]);

            res.json({ facultiesCount, subjectsCount, professorsCount, ratingsCount });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas del panel' });
        }
    }

    // Get recent activities
    static async getRecentActivities(req: Request, res: Response) {
        try {
            const recentActivities = await ActivityLog.find()
                .sort({ timestamp: -1 })
                .limit(5)
                .populate('relatedEntity')
                .lean();

            const formattedActivities = await Promise.all(recentActivities.map(async activity => {
                let details = '';
                const relatedEntity = activity.relatedEntity;

                if (relatedEntity && typeof relatedEntity === 'object') {
                    let departmentName = '';

                    if ('department' in relatedEntity) {
                        const departmentId = relatedEntity.department;
                        if (departmentId && Types.ObjectId.isValid(departmentId.toString())) {
                            const departmentObj = await Department.findById(departmentId.toString()).select('name');
                            departmentName = departmentObj ? departmentObj.name : 'Desconocido';
                        }
                    }

                    if (isFaculty(relatedEntity) && activity.type === 'CREATE_FACULTY') {
                        details = `${(relatedEntity as IFaculty).name} (${(relatedEntity as IFaculty).abbreviation})`;
                        return { type: 'Facultad agregada', details, timestamp: activity.timestamp };
                    }

                    if (isSubject(relatedEntity) && activity.type === 'UPDATE_SUBJECT') {
                        details = `${(relatedEntity as ISubject).name} - ${activity.changes || 'Cambios'}`;
                        return { type: 'Materia actualizada', details, timestamp: activity.timestamp };
                    }

                    if (isProfessor(relatedEntity) && (activity.type === 'CREATE_PROFESSOR' || activity.type === 'DELETE_PROFESSOR')) {
                        details = `${(relatedEntity as IProfessor).name} - ${departmentName}`;
                        return {
                            type: activity.type === 'CREATE_PROFESSOR' ? 'Nuevo profesor agregado' : 'Profesor eliminado',
                            details,
                            timestamp: activity.timestamp
                        };
                    }

                    if (isSubject(relatedEntity) && activity.type === 'CREATE_SUBJECT') {
                        details = `${(relatedEntity as ISubject).name} - ${departmentName}`;
                        return { type: 'Materia agregada', details, timestamp: activity.timestamp };
                    }
                }
                return null;
            }));

            res.json(formattedActivities.filter(activity => activity !== null));
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            res.status(500).json({ message: 'Error al obtener actividades recientes' });
        }
    }
}

// Type guards
function isFaculty(entity: any): entity is IFaculty {
    return entity instanceof Faculty;
}

function isSubject(entity: any): entity is ISubject {
    return entity instanceof Subject;
}

function isProfessor(entity: any): entity is IProfessor {
    return entity instanceof Professor;
} */

import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';
import Faculty from '../models/Faculty';
import Subject from '../models/Subject';
import Professor from '../models/Professor';
import Rating from '../models/Rating';

export class DashboardController {
    static getRecentActivities = async (req: Request, res: Response) => {
        try {
            // Fetch the 10 most recent activities, sorted by timestamp in descending order
            const recentActivities = await ActivityLog.find()
                .sort({ timestamp: -1 })
                .limit(10)
                .populate('relatedEntity'); // Esto ya usa refPath correctamente

            // Transform activities to a more readable format
            const formattedActivities = await Promise.all(recentActivities.map(async (activity) => {
                let entityName = 'Entidad desconocida';

                // Determine entity name based on the model
                switch (activity.onModel) {
                    case 'Faculty':
                        const faculty = await Faculty.findById(activity.relatedEntity);
                        entityName = faculty ? faculty.name : 'Facultad eliminada';
                        break;
                    case 'Subject':
                        const subject = await Subject.findById(activity.relatedEntity);
                        entityName = subject ? subject.name : 'Materia eliminada';
                        break;
                    case 'Professor':
                        const professor = await Professor.findById(activity.relatedEntity);
                        entityName = professor ? professor.name : 'Profesor eliminado';
                        break;
                }

                // Map activity types to more readable descriptions
                const activityTypeMap = {
                    'CREATE_FACULTY': `Facultad agregada: ${entityName}`,
                    'UPDATE_FACULTY': `Facultad actualizada: ${entityName}`,
                    'DELETE_FACULTY': `Facultad eliminada: ${entityName}`,
                    'CREATE_SUBJECT': `Materia agregada: ${entityName}`,
                    'UPDATE_SUBJECT': `Materia actualizada: ${entityName}`,
                    'DELETE_SUBJECT': `Materia eliminada: ${entityName}`,
                    'CREATE_PROFESSOR': `Nuevo profesor agregado: ${entityName}`,
                    'UPDATE_PROFESSOR': `Profesor actualizado: ${entityName}`,
                    'DELETE_PROFESSOR': `Profesor eliminado: ${entityName}`
                };

                return {
                    type: activityTypeMap[activity.type] || activity.type,
                    details: activity.changes || 'Sin detalles adicionales',
                    timestamp: activity.timestamp.toISOString()
                };
            }));

            res.json(formattedActivities);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            res.status(500).json({
                message: 'Error al obtener actividades recientes',
                error: error.message
            });
        }
    };

    static getDashboardStats = async (req: Request, res: Response) => {
        try {
            const facultiesCount = await Faculty.countDocuments();
            const subjectsCount = await Subject.countDocuments();
            const professorsCount = await Professor.countDocuments();
            const ratingsCount = await Rating.countDocuments(); // Assuming you have this model

            res.json({
                facultiesCount,
                subjectsCount,
                professorsCount,
                ratingsCount
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    };
}