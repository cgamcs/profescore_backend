import { Request, Response } from 'express';
import Rating from '../models/Rating';
import Professor from '../models/Professor';
import Subject from '../models/Subject';
import mongoose from 'mongoose';

export class RatingController {
    // Crear calificación
    static createRating = async (req, res) => {
        try {
            console.log('Datos recibidos en el backend:', req.body);
            console.log('Params:', req.params);

            // Verificar que todos los campos necesarios estén presentes
            const { general, explanation, accessibility, difficulty, attendance, wouldRetake, comment, subject, userIdentifier } = req.body;
            const { facultyId, professorId } = req.params;

            if (!subject || !professorId || !userIdentifier) {
                res.status(400).json({ error: 'Faltan campos obligatorios' });
                return 
            }

            // Actualizar relación profesor-materia
            const [professor, subjectDoc] = await Promise.all([
                Professor.findById(professorId),
                Subject.findById(subject)
            ]);

            if (!professor || !subjectDoc) {
                return res.status(404).json({ error: 'Profesor o materia no encontrados' });
            }
    
            // Agregar materia si no existe
            if (!professor.subjects.includes(subject)) {
                professor.subjects.push(subject);
                await professor.save();
            }

            // Crear la calificación
            const newRating = new Rating({
                general,
                explanation,
                accessibility,
                difficulty,
                attendance,
                wouldRetake,
                comment,
                subject,
                professor: professorId,
                userIdentifier
            });

            // Guardar en la base de datos
            const savedRating = await newRating.save();
            console.log('Calificación guardada:', savedRating);
            
            // Actualizar estadisticas
            await this.updateProfessorStats(professorId);

            return res.status(201).json(savedRating);
        } catch (error) {
            console.error('Error al crear calificación:', error);
            return res.status(500).json({
                error: 'Error al crear la calificación',
                details: error.message
            });
        }
    }

    // Obtener calificaciones
    static getProfessorRatings = async (req: Request, res: Response) => {
        try {
            const { professorId } = req.params;
            
            const ratings = await Rating.find({ professor: professorId })
                .populate('subject', 'name credits')
                .sort({ createdAt: -1 });

            res.json(ratings);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener calificaciones' });
        }
    }

    // Votar comentario útil
    static voteHelpful = async (req: Request, res: Response) => {
        try {
            const { type } = req.body; // 1 = like, 0 = dislike
            const userIP = req.ip; // Obtener IP del cliente
            const { ratingId } = req.params;
    
            const rating = await Rating.findById(ratingId); // <-- Buscar calificación
            if (!rating) {
                res.status(404).json({ error: 'Calificación no encontrada' });
                return
            }  
    
            // Verificar voto previo
            const hasLiked = req.rating.likes.includes(userIP);
            const hasDisliked = req.rating.dislikes.includes(userIP);
    
            let updateQuery = {};
            
            if (type === 1) { // Like
                if (hasLiked) {
                    updateQuery = { $pull: { likes: userIP } }; // Quitar like
                } else {
                    updateQuery = { 
                        $addToSet: { likes: userIP },
                        $pull: { dislikes: userIP } 
                    };
                }
            } else if (type === 0) { // Dislike
                if (hasDisliked) {
                    updateQuery = { $pull: { dislikes: userIP } }; // Quitar dislike
                } else {
                    updateQuery = { 
                        $addToSet: { dislikes: userIP },
                        $pull: { likes: userIP } 
                    };
                }
            } else {
                res.status(400).json({ error: 'Tipo de voto inválido' })
                return 
            }
    
            const updatedRating = await Rating.findByIdAndUpdate(
                ratingId,
                updateQuery,
                { new: true }
            ).populate('subject', 'name');
    
            res.json(updatedRating);
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: 'Error al registrar voto' });
        }
    }

    // Actualizar estadísticas (método privado)
    private static updateProfessorStats = async (professorId: string) => {
        const stats = await Rating.aggregate([
            { $match: { professor: new mongoose.Types.ObjectId(professorId) } },
            { $group: {
                _id: null,
                totalRatings: { $sum: 1 },
                averageGeneral: { $avg: "$general" },
                averageExplanation: { $avg: "$explanation" },
                averageAccessibility: { $avg: "$accessibility" },
                averageDifficulty: { $avg: "$difficulty" },
                averageAttendance: { $avg: "$attendance" },
                wouldRetakeCount: { $sum: { $cond: ["$wouldRetake", 1, 0] } }
            }}
        ]);

        if (stats.length > 0) {
            await Professor.findByIdAndUpdate(professorId, {
                ratingStats: {
                    ...stats[0],
                    wouldRetakePercentage: (stats[0].wouldRetakeCount / stats[0].totalRatings) * 100
                }
            });
        }
    }
}