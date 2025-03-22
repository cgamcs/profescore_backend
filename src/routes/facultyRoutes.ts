// publicRoutes.ts
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

const router = Router();

// --- Rutas de Facultades (solo consulta) ---
router.param('facultyId', facultyExists);

// Obtener todas las facultades
router.get('/', FacultyController.getAllFacultys);

// Obtener una facultad por id
router.get('/:facultyId',
  param('facultyId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  FacultyController.getFacultyById
);

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

// Crear un profesor (disponible para usuarios públicos)
// Se asume que se debe asignar a una materia, por ello se requiere facultyId y subjectId en la URL.
router.post('/:facultyId/subjects/:subjectId/professors',
  param('subjectId').isMongoId().withMessage('ID de materia inválido'),
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
  // Agregar validaciones para: explanation, accessibility, difficulty, attendance, comment, etc.
  handleInputErrors,
  RatingController.createRating
);

// Votar en una calificación (like/dislike)
router.param('ratingId', ratingExists);
router.post('/:facultyId/professors/:professorId/ratings/:ratingId/vote',
  handleInputErrors,
  ratingBelongsToProfessor,
  RatingController.voteHelpful
);

export default router;