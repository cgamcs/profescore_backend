import { Request, Response } from 'express';
import Rating from '../models/Rating';
import Professor from '../models/Professor';
import Subject from '../models/Subject';
import mongoose from 'mongoose';
import Report from '../models/Report';

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
      const { type, userId } = req.body; // Obtener userId del cuerpo
      const { ratingId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'ID de usuario requerido' });
        return;
      }

      const rating = await Rating.findById(ratingId);
      if (!rating) {
        res.status(404).json({ error: 'Calificación no encontrada' });
        return;
      }

      let updateQuery = {};

      if (type === 1) {
        if (rating.likes.includes(userId)) {
          updateQuery = { $pull: { likes: userId } };
        } else {
          updateQuery = {
            $addToSet: { likes: userId },
            $pull: { dislikes: userId }
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
      res.status(500).json({ error: 'Error al registrar voto' });
    }
  }

  private static updateProfessorStats = async (professorId: string) => {
    const stats = await Rating.aggregate([
      { $match: { professor: new mongoose.Types.ObjectId(professorId) } },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageGeneral: { $avg: "$general" },
          averageExplanation: { $avg: "$explanation" },
          averageAccessibility: { $avg: "$accessibility" },
          averageDifficulty: { $avg: "$difficulty" },
          averageAttendance: { $avg: "$attendance" },
          wouldRetakeCount: { $sum: { $cond: ["$wouldRetake", 1, 0] } }
        }
      }
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

  static createReport = async (req: Request, res: Response) => {
    try {
      const { commentId, reasons, reportComment } = req.body;
      console.log(req.body)
      // Validar que la calificación exista
      const rating = await Rating.findById(commentId);
      console.log(rating)
      if (!rating) {
        res.status(404).json({ message: 'Calificación no encontrada' });
        return
      }
  
      // Crear el reporte
      const newReport = new Report({
        commentId: rating._id,
        ratingComment: rating.comment,
        ratingDate: rating.createdAt,
        teacherId: rating.professor,
        subject: rating.subject,
        reasons,
        reportComment,
        status: 'pending',
        reportDate: new Date()
      });

      console.log(newReport)
  
      await newReport.save();
  
      res.status(201).json(newReport);
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      res.status(500).json({ message: 'Error al crear el reporte' });
    }
  }

  static getAllReport = async (req: Request, res: Response) => {
    try {
      const reports = await Report.find()
        .populate('commentId', 'general comment createdAt')
        .populate('teacherId', 'name biography department')
        .exec();
  
      res.status(200).json(reports);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      res.status(500).json({ message: 'Error al obtener los reportes' });
    }
  }

  static getReportById = async (req: Request, res: Response) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate('commentId', 'general comment createdAt')
        .populate('teacherId', 'name biography department')
        .exec();
  
      if (!report) {
        res.status(404).json({ message: 'Reporte no encontrado' });
        return
      }
  
      res.status(200).json(report);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
      res.status(500).json({ message: 'Error al obtener el reporte' });
    }
  }

  static deleteReport = async (req: Request, res: Response) => {
    try {
      const report = await Report.findByIdAndDelete(req.params.id);
      if (!report) {
        res.status(404).json({ message: 'Reporte no encontrado' });
        return
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      res.status(500).json({ message: 'Error al eliminar el reporte' });
    }
  }

  static rejectReport = async (req: Request, res: Response) => {
    try {
      const report = await Report.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
      if (!report) {
        res.status(404).json({ message: 'Reporte no encontrado' });
        return
      }
      res.status(200).json(report);
    } catch (error) {
      console.error('Error al rechazar el reporte:', error);
      res.status(500).json({ message: 'Error al rechazar el reporte' });
    }
  }
}