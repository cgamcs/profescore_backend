"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.professorExists = professorExists;
const Professor_1 = __importDefault(require("../models/Professor"));
const mongoose_1 = __importDefault(require("mongoose"));
async function professorExists(req, res, next) {
    try {
        const { professorId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(professorId)) {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }
        const professor = await Professor_1.default.findById(professorId)
            .populate('subjects')
            .populate('department', 'name');
        if (!professor) {
            const error = new Error('Profesor no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        req.professor = professor;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
//# sourceMappingURL=professor.js.map