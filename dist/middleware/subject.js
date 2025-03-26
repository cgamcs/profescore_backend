"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectExists = subjectExists;
exports.subjectBelongsToFaculty = subjectBelongsToFaculty;
const Subject_1 = __importDefault(require("../models/Subject"));
async function subjectExists(req, res, next) {
    try {
        const { subjectId } = req.params;
        const subject = await Subject_1.default.findById(subjectId)
            .populate('professors')
            .populate('department', 'name');
        if (!subject) {
            const error = new Error('Materia no encontrada');
            res.status(404).json({ error: error.message });
            return;
        }
        // Agregar la propiedad professorsCount a la instancia de Mongoose
        subject.professorsCount = subject.professors.length;
        req.subject = subject;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
function subjectBelongsToFaculty(req, res, next) {
    if (req.subject.faculty.toString() !== req.faculty.id.toString()) {
        const error = new Error('Acción no valida');
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=subject.js.map