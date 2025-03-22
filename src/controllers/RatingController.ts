import { Request, Response } from 'express';
import Rating from '../models/Rating';
import Professor from '../models/Professor';
import mongoose from 'mongoose';

export class RatingController {
    // Crear calificación
    static createRating = async (req: Request, res: Response) => {
        try {
            const { professorId } = req.params;
            const { 
                subject,
                general,
                explanation,
                accessibility,
                difficulty,
                attendance,
                wouldRetake,
                comment,
                // userId 
            } = req.body;

            // Validar que el profesor existe
            const professor = await Professor.findById(professorId);
            if (!professor) {
                res.status(404).json({ error: 'Profesor no encontrado' })
                return
            }

            // Crear calificación
            const newRating = await Rating.create({
                professor: professorId,
                subject,
                general,
                explanation,
                accessibility,
                difficulty,
                attendance,
                wouldRetake,
                comment,
                // user: userId
            });

            // Actualizar estadísticas del profesor
            await this.updateProfessorStats(professorId);

            res.status(201).json(newRating);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear calificación' });
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
    
            if(!req.rating) {
                res.status(404).json({ error: 'Calificación no encontrada' })
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
                req.rating,
                updateQuery,
                { new: true }
            );
    
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