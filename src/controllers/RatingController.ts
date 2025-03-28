import { Request, Response } from 'express';
import Rating from '../models/Rating';
import Professor from '../models/Professor';
import Subject from '../models/Subject';
import mongoose from 'mongoose';

export class RatingController {
  static createRating = async (req: Request, res: Response) => {
    try {
      console.log('Datos recibidos en el backend:', req.body);
      console.log('Params:', req.params);

      const { general, explanation, accessibility, difficulty, attendance, wouldRetake, comment, subject } = req.body;
      const { facultyId, professorId } = req.params;

      if (!subject || !professorId) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return;
      }

      const [professor, subjectDoc] = await Promise.all([
        Professor.findById(professorId),
        Subject.findById(subject)
      ]);

      if (!professor || !subjectDoc) {
        res.status(404).json({ error: 'Profesor o materia no encontrados' });
        return;
      }

      if (!professor.subjects.includes(subject)) {
        professor.subjects.push(subject);
        await professor.save();
      }

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
      });

      const savedRating = await newRating.save();
      console.log('Calificación guardada:', savedRating);

      await this.updateProfessorStats(professorId);

      res.status(201).json(savedRating);
    } catch (error) {
      console.error('Error al crear calificación:', error);
      res.status(500).json({
        error: 'Error al crear la calificación',
        details: error.message
      });
    }
  }

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

  static voteHelpful = async (req: Request, res: Response) => {
    try {
      const { type } = req.body;
      const { ratingId } = req.params;

      const rating = await Rating.findById(ratingId);
      if (!rating) {
        res.status(404).json({ error: 'Calificación no encontrada' });
        return;
      }

      let updateQuery = {};

      if (type === 1) {
        if (rating.likes.includes(req.ip)) {
          updateQuery = { $pull: { likes: req.ip } };
        } else {
          updateQuery = {
            $addToSet: { likes: req.ip },
            $pull: { dislikes: req.ip }
          };
        }
      } else if (type === 0) {
        if (rating.dislikes.includes(req.ip)) {
          updateQuery = { $pull: { dislikes: req.ip } };
        } else {
          updateQuery = {
            $addToSet: { dislikes: req.ip },
            $pull: { likes: req.ip }
          };
        }
      } else {
        res.status(400).json({ error: 'Tipo de voto inválido' });
        return;
      }

      const updatedRating = await Rating.findByIdAndUpdate(
        ratingId,
        updateQuery,
        { new: true }
      ).populate('subject', 'name');

      res.json(updatedRating);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Error al registrar voto' });
    }
  }

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