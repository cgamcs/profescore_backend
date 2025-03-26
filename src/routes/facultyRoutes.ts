import { Router } from 'express';
import { body, param } from 'express-validator';
import { FacultyController } from '../controllers/FacultyController';
import { SubjectController } from '../controllers/SubjectController';
import { ProfessorController } from '../controllers/ProfessorController';
import { RatingController } from '../controllers/RatingController';
import { handleInputErrors } from '../middleware/validation';
import { facultyExists } from '../middleware/faculty';
import { subjectExists, subjectBelongsToFaculty } from '../middleware/subject';
import { professorExists } from '../middleware/professor';
import { ratingExists, ratingBelongsToProfessor } from '../middleware/rating';
import { verifyRecaptcha } from '../controllers/RecaptchaController'; // Importa el controlador de reCAPTCHA

const router = Router();

// --- Rutas de Facultades (solo consulta) ---
router.param('facultyId', facultyExists);

// Obtener todas las facultades
router.get('/', FacultyController.getHomeData);

// Obtener una facultad por id
router.get('/:facultyId',
  param('facultyId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  FacultyController.getFacultyById
);

// Obtener departamentos de una facultad
router.get('/:facultyId/departments', FacultyController.getFacultyDepartments);

// --- Rutas de Materias (solo consulta) ---
router.get('/:facultyId/subjects', SubjectController.getFacultySubjects);

// Validación para materia
router.param('subjectId', subjectExists);
router.param('subjectId', subjectBelongsToFaculty);

// Obtener una materia por id
router.get('/:facultyId/subjects/:subjectId',
  param('subjectId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  SubjectController.getSubjectById
);

// Obtener profesores por materia
router.get(
  '/:facultyId/subjects/:subjectId/professors',
  SubjectController.getSubjectProfessors
);

// --- Rutas de Profesores ---
router.get('/:facultyId/professors', ProfessorController.getFacultyProfessors);

// Validación para profesor
router.param('professorId', professorExists);

// Obtener un profesor por id
router.get('/:facultyId/professors/:professorId',
  param('professorId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  ProfessorController.getProfessorById
);

// Crear un profesor desde formulario (subject se envía en el body)
router.post('/:facultyId/professors',
  // Validamos que en el body venga un subject válido
  body('subject').isMongoId().withMessage('ID de materia inválido'),
  body('name').notEmpty().withMessage('El nombre del profesor es obligatorio'),
  body('department').notEmpty().withMessage('El departamento es obligatorio'),
  body('biography').notEmpty().withMessage('La biografía es obligatoria'),
  handleInputErrors,
  ProfessorController.createProfessor
);

// --- Rutas de Calificaciones ---
router.get('/:facultyId/professors/:professorId/ratings', RatingController.getProfessorRatings);

router.post('/:facultyId/professors/:professorId/ratings',
  body('general').isFloat({ min: 1, max: 5 }).withMessage('La calificación general debe estar entre 1 y 5'),
  body('subject').isMongoId().withMessage('El ID de la materia es inválido'),
  body('captcha').notEmpty().withMessage('El CAPTCHA es obligatorio'), // Validar que el CAPTCHA esté presente
  handleInputErrors,
  verifyRecaptcha, // Verificar el CAPTCHA antes de crear la calificación
  RatingController.createRating
);

// Votar en una calificación (like/dislike)
router.param('ratingId', ratingExists);

router.post('/:facultyId/professors/:professorId/ratings/:ratingId/vote',
  param('ratingId').isMongoId(),
  handleInputErrors,
  ratingExists, // <-- Carga la calificación
  ratingBelongsToProfessor, // <-- Verifica pertenencia
  RatingController.voteHelpful
);

export default router;