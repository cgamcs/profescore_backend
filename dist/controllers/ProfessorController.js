"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorController = void 0;
const mongoose_1 = require("mongoose");
const Professor_1 = __importDefault(require("../models/Professor"));
const Subject_1 = __importDefault(require("../models/Subject"));
const Rating_1 = __importDefault(require("../models/Rating"));
class ProfessorController {
    static createProfessor = async (req, res) => {
        try {
            const faculty = req.faculty;
            const { name, department, biography, subject: subjectId } = req.body;
            const subject = await Subject_1.default.findById(subjectId);
            if (!subject) {
                res.status(404).json({ error: 'Materia no encontrada' });
                return;
            }
            const existingProfessor = await Professor_1.default.findOne({
                name: name.trim(),
                faculty: faculty.id
            });
            if (existingProfessor) {
                const subjectIdStr = subject.id.toString();
                const existingSubjects = existingProfessor.subjects.map(id => id.toString());
                if (!existingSubjects.includes(subjectIdStr)) {
                    existingProfessor.subjects.push(subject.id);
                    await existingProfessor.save();
                }
                const professorIdStr = existingProfessor.id.toString();
                const subjectProfessors = subject.professors.map(id => id.toString());
                if (!subjectProfessors.includes(professorIdStr)) {
                    subject.professors.push(existingProfessor.id);
                    await subject.save();
                }
                res.status(201).send('Profesor creado correctamente');
                return;
            }
            const newProfessor = new Professor_1.default({
                name,
                department,
                biography,
                faculty: faculty.id,
                subjects: [subject.id]
            });
            subject.professors.push(newProfessor.id);
            await Promise.allSettled([
                newProfessor.save(),
                subject.save()
            ]);
            res.json({
                message: 'Profesor creado y asignado a la materia',
                professor: newProfessor
            });
        }
        catch (error) {
            console.error('Error en createProfessor:', error.message);
            res.status(500).json({ error: 'Hubo un error al crear el profesor' });
        }
    };
    static createProfessorWithMultipleSubjects = async (req, res) => {
        try {
            const faculty = req.faculty;
            const { name, department, biography, subjects: subjectIds } = req.body;
            console.log('Received data for multiple subjects:', { name, department, biography, subjectIds });
            const subjects = await Subject_1.default.find({ _id: { $in: subjectIds } });
            if (subjects.length !== subjectIds.length) {
                res.status(404).json({ error: 'Algunas materias no fueron encontradas' });
                return;
            }
            const existingProfessor = await Professor_1.default.findOne({
                name: name.trim(),
                faculty: faculty.id
            });
            if (existingProfessor) {
                const existingSubjectIds = existingProfessor.subjects.map(id => id.toString());
                subjects.forEach(subject => {
                    const subjectIdStr = subject.id.toString();
                    if (!existingSubjectIds.includes(subjectIdStr)) {
                        existingProfessor.subjects.push(subject.id);
                    }
                    const professorIdStr = existingProfessor.id.toString();
                    const subjectProfessors = subject.professors.map(id => id.toString());
                    if (!subjectProfessors.includes(professorIdStr)) {
                        subject.professors.push(existingProfessor.id);
                    }
                });
                await existingProfessor.save();
                await Promise.allSettled(subjects.map(subject => subject.save()));
                res.status(201).send('Profesor actualizado con nuevas materias');
                return;
            }
            const newProfessor = new Professor_1.default({
                name,
                department,
                biography,
                faculty: faculty.id,
                subjects: subjects.map(subject => subject.id)
            });
            subjects.forEach(subject => {
                subject.professors.push(newProfessor.id);
            });
            await Promise.allSettled([
                newProfessor.save(),
                ...subjects.map(subject => subject.save())
            ]);
            console.log('Professor saved:', newProfessor);
            console.log('Subjects updated:', subjects);
            res.json({
                message: 'Profesor creado y asignado a las materias',
                professor: newProfessor
            });
        }
        catch (error) {
            console.error('Error en createProfessorWithMultipleSubjects:', error.message);
            res.status(500).json({ error: 'Hubo un error al crear el profesor' });
        }
    };
    static getAllProfessorsWithDetails = async (req, res) => {
        try {
            // Populate with type assertion to tell TypeScript about the expected structure
            const professors = await Professor_1.default.find()
                .populate({
                path: 'subjects',
                select: 'name' // Explicitly select the name field
            })
                .populate({
                path: 'faculty',
                select: 'name' // Explicitly select the name field
            });
            // Map the professors with type safety
            const professorsWithDetails = professors.map(professor => ({
                _id: professor._id,
                name: professor.name,
                faculty: professor.faculty ? professor.faculty.name : 'Sin facultad',
                subjects: professor.subjects.map(subject => subject.name),
                ratingStats: professor.ratingStats
            }));
            res.json(professorsWithDetails);
        }
        catch (error) {
            console.error('Error al obtener los profesores:', error);
            res.status(500).json({ error: 'Hubo un error al obtener los profesores' });
        }
    };
    static getAllProfessors = async (req, res) => {
        try {
            const professors = await Professor_1.default.find()
                .populate('department', 'name')
                .populate('subjects', 'name')
                .populate('faculty', 'name');
            res.json(professors);
        }
        catch (error) {
            console.error('Error al traer todas las materias:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getFacultyProfessors = async (req, res) => {
        try {
            const professors = await Professor_1.default.find({ faculty: req.faculty.id });
            res.json(professors);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error al mostrar profesores' });
        }
    };
    static getProfessorById = async (req, res) => {
        try {
            res.json(req.professor);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error al buscar el profesor' });
        }
    };
    static updateProfessor = async (req, res) => {
        try {
            const professor = req.professor;
            const { subject: newSubjects, ...rest } = req.body;
            let newSubjectIds = [];
            if (rest.name) {
                const existing = await Professor_1.default.findOne({
                    name: rest.name.trim(),
                    faculty: professor.faculty,
                    _id: { $ne: professor.id }
                });
                if (existing) {
                    res.status(400).json({ error: 'Ya existe un profesor con este nombre' });
                    return;
                }
            }
            Object.assign(professor, rest);
            if (newSubjects && Array.isArray(newSubjects)) {
                const validSubjects = newSubjects
                    .map(id => id.toString().trim())
                    .filter(id => mongoose_1.Types.ObjectId.isValid(id))
                    .map(id => new mongoose_1.Types.ObjectId(id));
                if (validSubjects.length !== newSubjects.length) {
                    res.status(400).json({ error: "Algunos IDs de materias son inválidos" });
                    return;
                }
                const existingSubjectIds = professor.subjects.map(id => id.toString());
                validSubjects.forEach(id => {
                    if (!existingSubjectIds.includes(id.toString())) {
                        professor.subjects.push(id);
                    }
                });
            }
            await professor.save();
            if (newSubjectIds.length > 0) {
                await Subject_1.default.updateMany({ _id: { $in: newSubjectIds } }, { $addToSet: { professors: professor._id } });
            }
            res.json({
                message: 'Profesor actualizado y asignado a las materias',
                professor: req.professor
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error al actualizar el profesor' });
        }
    };
    static deleteProfessor = async (req, res) => {
        try {
            await Promise.allSettled([
                req.professor.deleteOne(),
                Rating_1.default.deleteMany({ professor: req.professor.id }),
                Subject_1.default.updateMany({ professors: req.professor.id }, { $pull: { professors: req.professor.id } })
            ]);
            res.send('Profesor eliminado correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error al eliminar el profesor' });
        }
    };
}
exports.ProfessorController = ProfessorController;
//# sourceMappingURL=ProfessorController.js.map