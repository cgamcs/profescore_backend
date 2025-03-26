"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingExists = ratingExists;
exports.ratingBelongsToProfessor = ratingBelongsToProfessor;
const Rating_1 = __importDefault(require("../models/Rating"));
async function ratingExists(req, res, next) {
    try {
        const { ratingId } = req.params;
        const rating = await Rating_1.default.findById(ratingId);
        if (!rating) {
            res.status(404).json({ error: 'Calificación no encontrada' });
            return;
        }
        req.rating = rating;
        next();
    }
    catch (error) {
        res.status(500).json({
            error: 'Error al validar la calificación',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}
async function ratingBelongsToProfessor(req, res, next) {
    const { professorId } = req.params;
    if (req.rating.professor.toString() !== professorId) {
        res.status(403).json({ error: 'La calificación no pertenece a este profesor' });
        return;
    }
    next();
}
//# sourceMappingURL=rating.js.map