"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const AdminController_1 = require("../controllers/AdminController");
const adminAuth_1 = require("../middleware/adminAuth");
const FacultyController_1 = require("../controllers/FacultyController");
const SubjectController_1 = require("../controllers/SubjectController");
const ProfessorController_1 = require("../controllers/ProfessorController");
const faculty_1 = require("../middleware/faculty");
const subject_1 = require("../middleware/subject");
const professor_1 = require("../middleware/professor");
const DashboardController_1 = require("../controllers/DashboardController");
const router = (0, express_1.Router)();
// --- Rutas de autenticación de Admin ---
// Ruta pública para que crear un administrador
router.post('/signup', (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'), (0, express_validator_1.body)('password').notEmpty().withMessage('La contraseña es obligatoria'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatoria'), validation_1.handleInputErrors, AdminController_1.AdminController.createAdmin);
// Ruta pública para que el administrador inicie sesión
router.post('/login', (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'), (0, express_validator_1.body)('password').notEmpty().withMessage('La contraseña es obligatoria'), validation_1.handleInputErrors, AdminController_1.AdminController.adminLogin);
// --- Rutas administrativas (protegidas) ---
router.use(adminAuth_1.adminAuth);
// Get dashboard statistics
router.get('/dashboard-stats', DashboardController_1.DashboardController.getDashboardStats);
// Get recent activities
router.get('/recent-activities', DashboardController_1.DashboardController.getRecentActivities);
// **** FACULTADES ****
// Crear una nueva facultad
router.post('/faculty', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre de la facultad es obligatorio'), (0, express_validator_1.body)('abbreviation').notEmpty().withMessage('La abreviación de la facultad es obligatoria'), validation_1.handleInputErrors, FacultyController_1.FacultyController.createFaculty);
// Obtener todas las facultades
router.get('/faculty', FacultyController_1.FacultyController.getAllFaculties);
// Revisar si el ID de la Facultad existe antes de procesar las rutas
router.param('facultyId', faculty_1.facultyExists);
// Obtener facultad por id
router.get('/faculty/:facultyId', (0, express_validator_1.param)('facultyId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, FacultyController_1.FacultyController.getFacultyById);
// Actualizar facultad
router.put('/faculty/:facultyId', (0, express_validator_1.param)('facultyId').isMongoId().withMessage('ID no válido'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre de la facultad es obligatorio'), (0, express_validator_1.body)('abbreviation').notEmpty().withMessage('La abreviación de la facultad es obligatoria'), validation_1.handleInputErrors, FacultyController_1.FacultyController.editFaculty);
// Eliminar facultad
router.delete('/faculty/:facultyId', (0, express_validator_1.param)('facultyId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, FacultyController_1.FacultyController.deleteFaculty);
// Crear un departamento
router.post('/faculty/:facultyId/departments', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatorio'), validation_1.handleInputErrors, FacultyController_1.FacultyController.addDepartment);
// Obtener departamentos por facultad
router.get('/faculty/:facultyId/departments', FacultyController_1.FacultyController.getFacultyDepartments);
// **** MATERIAS ****
// Obtener todas las materias de todas las facultades
router.get('/subjects', SubjectController_1.SubjectController.getAllSubjects);
// Crear una materia
router.post('/faculty/:facultyId/subject', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatorio'), validation_1.handleInputErrors, SubjectController_1.SubjectController.createSubject);
// Middlewares para validar Materias
router.param('subjectId', subject_1.subjectExists); // Verificar si la Materia existe
router.param('subjectId', subject_1.subjectBelongsToFaculty); // Verificar que la Materia pertenezca a la Facultad
router.get('/faculty/:facultyId/subjects', SubjectController_1.SubjectController.getFacultySubjects);
// Obtener materia por id
router.get('/faculty/:facultyId/subject/:subjectId', (0, express_validator_1.param)('subjectId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, SubjectController_1.SubjectController.getSubjectById);
// Actualizar materia
router.put('/faculty/:facultyId/subject/:subjectId', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre de la materia es obligatorio'), (0, express_validator_1.body)('department').notEmpty().withMessage('El departamento de la materia es obligatorio'), (0, express_validator_1.body)('credits').isNumeric().withMessage('Los créditos deben ser un número'), validation_1.handleInputErrors, SubjectController_1.SubjectController.updateSubject);
// Eliminar materia
router.delete('/faculty/:facultyId/subject/:subjectId', (0, express_validator_1.param)('subjectId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, SubjectController_1.SubjectController.deleteSubject);
// **** PROFESORES ****
// Crear un profesor con una sola materia
router.post('/faculty/:facultyId/professor', (0, express_validator_1.body)('subject').isMongoId().withMessage('ID de materia inválido'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre del profesor es obligatorio'), (0, express_validator_1.body)('department').notEmpty().withMessage('El departamento es obligatorio'), (0, express_validator_1.body)('biography').notEmpty().withMessage('La biografía es obligatoria'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.createProfessor);
// Crear un profesor con múltiples materias
router.post('/faculty/:facultyId/professor/multiple', (0, express_validator_1.body)('subjects').isArray().withMessage('Debe ser un arreglo de materias'), (0, express_validator_1.body)('subjects.*').isMongoId().withMessage('ID de materia inválido'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre del profesor es obligatorio'), (0, express_validator_1.body)('department').notEmpty().withMessage('El departamento es obligatorio'), (0, express_validator_1.body)('biography').notEmpty().withMessage('La biografía es obligatoria'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.createProfessorWithMultipleSubjects);
// Obtener todos los profesores de todas las facultades con detalles
router.get('/professors', ProfessorController_1.ProfessorController.getAllProfessorsWithDetails);
// Obtener todos los profesores de todas las facultades
// router.get('/professors', ProfessorController.getAllProfessors);
// Obtener todos los profesores de una facultad
router.get('/faculty/:facultyId/professor', ProfessorController_1.ProfessorController.getFacultyProfessors);
// Revisar si el ID del Profesor existe antes de procesar las rutas
router.param('professorId', professor_1.professorExists);
// Obtener profesor por id
router.get('/faculty/:facultyId/professor/:professorId', (0, express_validator_1.param)('professorId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.getProfessorById);
// Actualizar profesor
router.put('/faculty/:facultyId/professor/:professorId', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre del profesor es obligatorio'), (0, express_validator_1.body)('department').notEmpty().withMessage('El departamento es obligatorio'), (0, express_validator_1.body)('biography').notEmpty().withMessage('La biografía es obligatoria'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.updateProfessor);
// Eliminar profesor
router.delete('/faculty/:facultyId/professor/:professorId', (0, express_validator_1.param)('professorId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.deleteProfessor);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map