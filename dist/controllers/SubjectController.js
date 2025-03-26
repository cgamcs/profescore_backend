"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const Professor_1 = __importDefault(require("../models/Professor"));
const Rating_1 = __importDefault(require("../models/Rating"));
const Department_1 = __importDefault(require("../models/Department"));
class SubjectController {
    static createSubject = async (req, res) => {
        try {
            const { name, credits, description, department, professors } = req.body;
            // Verificar que el departamento pertenezca a la facultad
            const departmentExists = await Department_1.default.findOne({
                _id: department,
                faculty: req.faculty.id
            });
            if (!departmentExists) {
                res.status(400).json({ error: 'Departamento no válido' });
                return;
            }
            // Crear la materia y asignarle el departamento
            const subject = new Subject_1.default({
                name,
                credits,
                description,
                department, // Se guarda el ObjectId del departamento
                faculty: req.faculty.id, // Se asigna la facultad
                professors
            });
            req.faculty.subjects.push(subject.id);
            // Guardar la materia y actualizar la facultad
            await Promise.allSettled([subject.save(), req.faculty.save()]);
            res.send('Materia creada correctamente');
        }
        catch (error) {
            console.error('Error al crear materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getFacultySubjects = async (req, res) => {
        try {
            const subjects = await Subject_1.default.find({ faculty: req.params.facultyId })
                .populate('department', 'name') // Ahora funcionará
                .populate('professors', 'name');
            res.json(subjects);
        }
        catch (error) {
            console.error('Error al traer materias de la facultad:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getAllSubjects = async (req, res) => {
        try {
            const subjects = await Subject_1.default.find()
                .populate('department', 'name')
                .populate('professors', 'name')
                .populate('faculty', 'name');
            res.json(subjects);
        }
        catch (error) {
            console.error('Error al traer todas las materias:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static getSubjectProfessors = async (req, res) => {
        try {
            const { subjectId } = req.params;
            const subject = await Subject_1.default.findById(subjectId)
                .populate({
                path: 'professors',
                select: 'name ratingStats',
                match: { faculty: req.params.facultyId } // Asegurar que pertenecen a la facultad
            })
                .populate('department', 'name');
            if (!subject) {
                res.status(404).json({ error: 'Materia no encontrada' });
                return;
            }
            // Filtrar profesores que coincidan con la facultad
            const filteredProfessors = subject.professors.filter(p => p !== null);
            res.json(filteredProfessors);
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error al obtener profesores' });
        }
    };
    static getSubjectById = async (req, res) => {
        try {
            res.json(req.subject);
        }
        catch (error) {
            console.error('Error al traer materia por ID:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static updateSubject = async (req, res) => {
        try {
            const { name, department, credits, description } = req.body;
            // Verificar que el departamento pertenezca a la facultad
            const departmentExists = await Department_1.default.findOne({
                _id: department,
                faculty: req.faculty.id
            });
            if (!departmentExists) {
                res.status(400).json({ error: 'Departamento no válido' });
                return;
            }
            // Actualizar la materia
            req.subject.name = name;
            req.subject.department = department;
            req.subject.credits = credits;
            req.subject.description = description;
            await req.subject.save();
            res.send('Materia actualizada correctamente');
        }
        catch (error) {
            console.error('Error al actualizar materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static deleteSubject = async (req, res) => {
        try {
            // Eliminar la materia de la facultad
            req.faculty.subjects = req.faculty.subjects.filter(subject => subject.id.toString() !== req.subject.id.toString());
            // Eliminar la materia de todos los profesores relacionados
            await Professor_1.default.updateMany({ subjects: req.subject.id }, { $pull: { subjects: req.subject.id } });
            //  Eliminar todas las calificaciones relacionadas con la materia
            await Rating_1.default.deleteMany({ subject: req.subject.id });
            // Ejecutar todas las operaciones juntas
            await Promise.allSettled([
                req.subject.deleteOne(), // Eliminar materia
                req.faculty.save()
            ]);
            res.json({
                message: 'Materia eliminada y relaciones actualizadas',
                deletedSubject: req.subject.name
            });
        }
        catch (error) {
            console.error('Error al eliminar materia:', error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.SubjectController = SubjectController;
//# sourceMappingURL=SubjectController.js.map