"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyExists = facultyExists;
const Faculty_1 = __importDefault(require("../models/Faculty"));
async function facultyExists(req, res, next) {
    try {
        const { facultyId } = req.params;
        const faculty = await Faculty_1.default.findById(facultyId)
            .populate('subjects')
            .populate({
            path: 'departments',
            model: 'Department',
            select: 'name'
        });
        if (!faculty) {
            const error = new Error('Facultad no encontrada');
            res.status(404).json({ error: error.message });
            return;
        }
        req.faculty = faculty;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
//# sourceMappingURL=faculty.js.map