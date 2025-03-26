"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const FacultyController_1 = require("../controllers/FacultyController");
const SubjectController_1 = require("../controllers/SubjectController");
const ProfessorController_1 = require("../controllers/ProfessorController");
const RatingController_1 = require("../controllers/RatingController");
const validation_1 = require("../middleware/validation");
const faculty_1 = require("../middleware/faculty");
const subject_1 = require("../middleware/subject");
const professor_1 = require("../middleware/professor");
const rating_1 = require("../middleware/rating");
const RecaptchaController_1 = require("../controllers/RecaptchaController"); // Importa el controlador de reCAPTCHA
const router = (0, express_1.Router)();
// --- Rutas de Facultades (solo consulta) ---
router.param('facultyId', faculty_1.facultyExists);
// Obtener todas las facultades
router.get('/', FacultyController_1.FacultyController.getHomeData);
// Obtener una facultad por id
router.get('/:facultyId', (0, express_validator_1.param)('facultyId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, FacultyController_1.FacultyController.getFacultyById);
// Obtener departamentos de una facultad
router.get('/:facultyId/departments', FacultyController_1.FacultyController.getFacultyDepartments);
// --- Rutas de Materias (solo consulta) ---
router.get('/:facultyId/subjects', SubjectController_1.SubjectController.getFacultySubjects);
// Validación para materia
router.param('subjectId', subject_1.subjectExists);
router.param('subjectId', subject_1.subjectBelongsToFaculty);
// Obtener una materia por id
router.get('/:facultyId/subjects/:subjectId', (0, express_validator_1.param)('subjectId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, SubjectController_1.SubjectController.getSubjectById);
// Obtener profesores por materia
router.get('/:facultyId/subjects/:subjectId/professors', SubjectController_1.SubjectController.getSubjectProfessors);
// --- Rutas de Profesores ---
router.get('/:facultyId/professors', ProfessorController_1.ProfessorController.getFacultyProfessors);
// Validación para profesor
router.param('professorId', professor_1.professorExists);
// Obtener un profesor por id
router.get('/:facultyId/professors/:professorId', (0, express_validator_1.param)('professorId').isMongoId().withMessage('ID no válido'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.getProfessorById);
// Crear un profesor desde formulario (subject se envía en el body)
router.post('/:facultyId/professors', 
// Validamos que en el body venga un subject válido
(0, express_validator_1.body)('subject').isMongoId().withMessage('ID de materia inválido'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre del profesor es obligatorio'), (0, express_validator_1.body)('department').notEmpty().withMessage('El departamento es obligatorio'), (0, express_validator_1.body)('biography').notEmpty().withMessage('La biografía es obligatoria'), validation_1.handleInputErrors, ProfessorController_1.ProfessorController.createProfessor);
// --- Rutas de Calificaciones ---
router.get('/:facultyId/professors/:professorId/ratings', RatingController_1.RatingController.getProfessorRatings);
router.post('/:facultyId/professors/:professorId/ratings', (0, express_validator_1.body)('general').isFloat({ min: 1, max: 5 }).withMessage('La calificación general debe estar entre 1 y 5'), (0, express_validator_1.body)('subject').isMongoId().withMessage('El ID de la materia es inválido'), (0, express_validator_1.body)('captcha').notEmpty().withMessage('El CAPTCHA es obligatorio'), // Validar que el CAPTCHA esté presente
validation_1.handleInputErrors, RecaptchaController_1.verifyRecaptcha, // Verificar el CAPTCHA antes de crear la calificación
RatingController_1.RatingController.createRating);
// Votar en una calificación (like/dislike)
router.param('ratingId', rating_1.ratingExists);
router.post('/:facultyId/professors/:professorId/ratings/:ratingId/vote', (0, express_validator_1.param)('ratingId').isMongoId(), validation_1.handleInputErrors, rating_1.ratingExists, // <-- Carga la calificación
rating_1.ratingBelongsToProfessor, // <-- Verifica pertenencia
RatingController_1.RatingController.voteHelpful);
exports.default = router;
//# sourceMappingURL=facultyRoutes.js.map