"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const Rating_1 = __importDefault(require("../models/Rating"));
const Professor_1 = __importDefault(require("../models/Professor"));
const Subject_1 = __importDefault(require("../models/Subject"));
const mongoose_1 = __importDefault(require("mongoose"));
class RatingController {
    static createRating = async (req, res) => {
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
                Professor_1.default.findById(professorId),
                Subject_1.default.findById(subject)
            ]);
            if (!professor || !subjectDoc) {
                res.status(404).json({ error: 'Profesor o materia no encontrados' });
                return;
            }
            if (!professor.subjects.includes(subject)) {
                professor.subjects.push(subject);
                await professor.save();
            }
            const newRating = new Rating_1.default({
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
        }
        catch (error) {
            console.error('Error al crear calificación:', error);
            res.status(500).json({
                error: 'Error al crear la calificación',
                details: error.message
            });
        }
    };
    static getProfessorRatings = async (req, res) => {
        try {
            const { professorId } = req.params;
            const ratings = await Rating_1.default.find({ professor: professorId })
                .populate('subject', 'name credits')
                .sort({ createdAt: -1 });
            res.json(ratings);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener calificaciones' });
        }
    };
    static voteHelpful = async (req, res) => {
        try {
            const { type, userId } = req.body; // Obtener userId del cuerpo
            const { ratingId } = req.params;
            if (!userId) {
                res.status(400).json({ error: 'ID de usuario requerido' });
                return;
            }
            const rating = await Rating_1.default.findById(ratingId);
            if (!rating) {
                res.status(404).json({ error: 'Calificación no encontrada' });
                return;
            }
            let updateQuery = {};
            if (type === 1) {
                if (rating.likes.includes(userId)) {
                    updateQuery = { $pull: { likes: userId } };
                }
                else {
                    updateQuery = {
                        $addToSet: { likes: userId },
                        $pull: { dislikes: userId }
                    };
                }
            }
            else {
                res.status(400).json({ error: 'Tipo de voto inválido' });
                return;
            }
            const updatedRating = await Rating_1.default.findByIdAndUpdate(ratingId, updateQuery, { new: true }).populate('subject', 'name');
            res.json(updatedRating);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al registrar voto' });
        }
    };
    static updateProfessorStats = async (professorId) => {
        const stats = await Rating_1.default.aggregate([
            { $match: { professor: new mongoose_1.default.Types.ObjectId(professorId) } },
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
            await Professor_1.default.findByIdAndUpdate(professorId, {
                ratingStats: {
                    ...stats[0],
                    wouldRetakePercentage: (stats[0].wouldRetakeCount / stats[0].totalRatings) * 100
                }
            });
        }
    };
}
exports.RatingController = RatingController;
//# sourceMappingURL=RatingController.js.map