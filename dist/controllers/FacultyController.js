"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Faculty_1 = __importDefault(require("../models/Faculty"));
const Professor_1 = __importDefault(require("../models/Professor"));
const Department_1 = __importDefault(require("../models/Department"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const colors_1 = __importDefault(require("colors"));
class FacultyController {
    static createFaculty = async (req, res) => {
        try {
            const { name, abbreviation, departments } = req.body; // departments: array de nombres
            // 1. Crear la facultad
            const faculty = new Faculty_1.default({ name, abbreviation });
            // 2. Crear departamentos y asignarlos a la facultad
            const createdDepartments = await Department_1.default.insertMany(departments.map(name => ({ name, faculty: faculty._id })));
            // Ensure the department property is typed correctly
            faculty.departments = createdDepartments.map(d => d._id);
            await faculty.save();
            // Log activity
            await ActivityLog_1.default.create({
                type: 'CREATE_FACULTY',
                relatedEntity: faculty._id,
                onModel: 'Faculty'
            });
            res.json(faculty);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al agregar facultad - ${error.message}`));
        }
    };
    static getHomeData = async (req, res) => {
        try {
            const faculties = await Faculty_1.default.find({});
            // Obtener los profesores mejor calificados
            const professors = await Professor_1.default.find()
                .populate('faculty', 'abbreviation')
                .populate('subjects', 'name')
                .sort({ 'ratingStats.averageGeneral': -1, 'ratingStats.totalRatings': -1 })
                .limit(3);
            res.json({ faculties, topProfessors: professors });
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al mostrar las facultades - ${error.message}`));
        }
    };
    static getAllFaculties = async (req, res) => {
        try {
            const faculties = await Faculty_1.default.find({});
            res.json(faculties);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al mostrar las facultades - ${error.message}`));
        }
    };
    static getFacultyById = async (req, res) => {
        try {
            res.json(req.faculty);
            console.log(`Desde el backend: ${req.faculty}`);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al mostrar facultad - ${error.message}`));
        }
    };
    static editFaculty = async (req, res) => {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const { facultyId } = req.params;
            const { name, abbreviation, departments } = req.body;
            // Validar entrada
            if (!name || !abbreviation || !departments) {
                await session.abortTransaction();
                res.status(400).json({ error: 'Datos incompletos' });
                return;
            }
            const faculty = await Faculty_1.default.findById(facultyId).session(session);
            if (!faculty) {
                await session.abortTransaction();
                res.status(404).json({ message: 'Faculty not found' });
                return;
            }
            // Normalizar departamentos
            const normalizedDepartments = departments.map((dep) => {
                if (!dep._id || !mongoose_1.default.isValidObjectId(dep._id)) {
                    return { _id: null, name: dep.name };
                }
                return {
                    _id: new mongoose_1.default.Types.ObjectId(dep._id),
                    name: dep.name
                };
            });
            // Actualizar departamentos existentes
            const departmentUpdates = normalizedDepartments
                .filter(dep => dep._id !== null)
                .map(async (dep) => {
                await Department_1.default.findByIdAndUpdate(dep._id, { name: dep.name }, { session });
                return dep._id.toString();
            });
            // Crear nuevos departamentos
            const newDepartments = normalizedDepartments
                .filter(dep => dep._id === null)
                .map(dep => ({
                name: dep.name,
                faculty: facultyId
            }));
            let createdDepartmentIds = [];
            if (newDepartments.length > 0) {
                const createdDepartments = await Department_1.default.insertMany(newDepartments, { session });
                createdDepartmentIds = createdDepartments.map(d => d._id.toString());
            }
            // Obtener IDs actualizados
            const updatedDepartmentIds = [
                ...(await Promise.all(departmentUpdates)),
                ...createdDepartmentIds
            ];
            // Identificar departamentos a eliminar
            const currentDepartmentIds = faculty.departments.map(id => id.toString());
            const departmentsToRemove = currentDepartmentIds.filter(id => !updatedDepartmentIds.includes(id));
            // Eliminar departamentos removidos
            if (departmentsToRemove.length > 0) {
                await Department_1.default.deleteMany({ _id: { $in: departmentsToRemove } }, { session });
            }
            // Actualizar facultad
            faculty.name = name;
            faculty.abbreviation = abbreviation;
            faculty.departments = updatedDepartmentIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            await faculty.save({ session });
            // Registrar actividad
            await ActivityLog_1.default.create([{
                    type: 'UPDATE_FACULTY',
                    relatedEntity: faculty._id,
                    onModel: 'Faculty',
                    changes: JSON.stringify({ name, abbreviation, departments })
                }], { session });
            await session.commitTransaction();
            res.json(faculty);
        }
        catch (error) {
            await session.abortTransaction();
            console.log(colors_1.default.red.bold(`Error al actualizar facultad - ${error.message}`));
            res.status(500).json({
                error: 'Error actualizando facultad',
                details: error.message
            });
        }
        finally {
            session.endSession();
        }
    };
    static deleteFaculty = async (req, res) => {
        const { id } = req.params;
        const { name, abbreviation, departments } = req.body;
        try {
            // Editar la facultad
            const faculty = await Faculty_1.default.findByIdAndUpdate(id, { name, abbreviation, departments }, { new: true });
            if (!faculty) {
                return res.status(404).json({ message: 'Facultad no encontrada' });
            }
            // Actualizar departamentos
            await updateDepartments(id, departments);
            res.json(faculty);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al editar la facultad', error });
        }
    };
    static getFacultyDepartments = async (req, res) => {
        try {
            const faculty = await Faculty_1.default.findById(req.params.facultyId).populate('departments');
            res.json(faculty?.departments || []);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching departments' });
        }
    };
    static addDepartment = async (req, res) => {
        try {
            const faculty = await Faculty_1.default.findByIdAndUpdate(req.params.facultyId, { $push: { departments: { name: req.body.name } } }, { new: true });
            res.json(faculty?.departments);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al agregar departamento' });
        }
    };
    static deleteDepartment = async (req, res) => {
        try {
            const { facultyId, departmentId } = req.params;
            // Eliminar el departamento de la facultad
            const faculty = await Faculty_1.default.findByIdAndUpdate(facultyId, { $pull: { departments: departmentId } }, { new: true });
            if (!faculty) {
                return res.status(404).json({ error: 'Facultad no encontrada' });
            }
            // Eliminar el departamento de la base de datos
            await Department_1.default.findByIdAndDelete(departmentId);
            res.json(faculty.departments);
        }
        catch (error) {
            console.log(colors_1.default.red.bold(`Error al eliminar departamento - ${error.message}`));
            res.status(500).json({ error: 'Error eliminando departamento' });
        }
    };
    static topRatedProfessors = async (req, res) => {
        try {
            const professors = await Professor_1.default.find()
                .populate('faculty', 'abbreviation')
                .populate('subjects', 'name');
            // Ordenar por calificación y cantidad de reseñas
            const sortedProfessors = professors
                .sort((a, b) => b.ratingStats.averageGeneral - a.ratingStats.averageGeneral ||
                b.ratingStats.totalRatings - a.ratingStats.totalRatings)
                .slice(0, 3); // Los 3 mejores
            res.json(sortedProfessors);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener los profesores mejor calificados' });
        }
    };
}
exports.FacultyController = FacultyController;
const updateDepartments = async (facultyId, newDepartments) => {
    // Obtener los departamentos actuales de la facultad
    const faculty = await Faculty_1.default.findById(facultyId);
    const currentDepartments = faculty.departments;
    // Eliminar departamentos que ya no están en la lista
    const departmentsToRemove = currentDepartments.filter((dep) => !newDepartments.includes(dep));
    await Department_1.default.deleteMany({ name: { $in: departmentsToRemove }, faculty: facultyId });
    // Agregar o actualizar departamentos
    for (const depName of newDepartments) {
        await Department_1.default.updateOne({ name: depName, faculty: facultyId }, { name: depName, faculty: facultyId }, { upsert: true });
    }
};
//# sourceMappingURL=FacultyController.js.map