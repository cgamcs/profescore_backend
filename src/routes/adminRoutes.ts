// adminRoutes.ts
import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { AdminController } from '../controllers/AdminController';
import { adminAuth } from '../middleware/adminAuth';
import { FacultyController } from '../controllers/FacultyController';
import { SubjectController } from '../controllers/SubjectController';
import { ProfessorController } from '../controllers/ProfessorController';
import { facultyExists } from '../middleware/faculty';
import { subjectBelongsToFaculty, subjectExists } from '../middleware/subject';
import { professorExists } from '../middleware/professor';

const router = Router();

// --- Rutas de autenticación de Admin ---
// Ruta pública para que crear un administrador
router.post('/signup',
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    body('name').notEmpty().withMessage('El nombre es obligatoria'),
    handleInputErrors,
    AdminController.createAdmin
);
// Ruta pública para que el administrador inicie sesión
router.post('/login',
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AdminController.adminLogin
);

// --- Rutas administrativas (protegidas) ---
router.use(adminAuth);

// **** FACULTADES ****

// Crear una nueva facultad
router.post('/faculty',
    body('name').notEmpty().withMessage('El nombre de la facultad es obligatorio'),
    body('abbreviation').notEmpty().withMessage('La abreviación de la facultad es obligatoria'),
    handleInputErrors,
    FacultyController.createFaculty
);

// Obtener todas las facultades
router.get('/faculty', FacultyController.getAllFacultys);

// Revisae si el ID de la Facultad existe antes de procesar las rutas
router.param('facultyId', facultyExists)

// Obtener facultad por id
router.get('/faculty/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    FacultyController.getFacultyById
);

// Actualizar facultad
router.put('/faculty/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('El nombre de la facultad es obligatorio'),
    body('abbreviation').notEmpty().withMessage('La abreviación de la facultad es obligatoria'),
    handleInputErrors,
    FacultyController.updateFaculty
);

// Eliminar facultad
router.delete('/faculty/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    FacultyController.deleteFaculty
);

// **** MATERIAS ****

// Crear una nueva materia asociada a una facultad
router.post('/faculty/:facultyId/subject',
    body('name').notEmpty().withMessage('El nombre de la materia es obligatorio'),
    body('department').notEmpty().withMessage('El departamento de la materia es obligatorio'),
    body('credits').isNumeric().withMessage('Los créditos deben ser un número'),
    handleInputErrors,
    SubjectController.createSubject
);

// Obtener todas las materias de una facultad
router.get('/faculty/:facultyId/subject', SubjectController.getFacultySubjects);

// Middlewares para validar Materias
router.param('subjectId', subjectExists); // Verificar si la Materia existe
router.param('subjectId', subjectBelongsToFaculty); // Verificar que la Materia pertenezca a la Facultad

// Obtener materia por id
router.get('/faculty/:facultyId/subject/:subjectId',
    param('subjectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SubjectController.getSubjectById
);

// Actualizar materia
router.put('/faculty/:facultyId/subject/:subjectId',
    body('name').notEmpty().withMessage('El nombre de la materia es obligatorio'),
    body('department').notEmpty().withMessage('El departamento de la materia es obligatorio'),
    body('credits').isNumeric().withMessage('Los créditos deben ser un número'),
    handleInputErrors,
    SubjectController.updateSubject
);

// Eliminar materia
router.delete('/faculty/:facultyId/subject/:subjectId',
    param('subjectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SubjectController.deleteSubject
);

// **** PROFESORES ****

// Crear un profesor, con subject enviado en el body
router.post('/faculty/:facultyId/professor',
    body('subject').isMongoId().withMessage('ID de materia inválido'),
    body('name').notEmpty().withMessage('El nombre del profesor es obligatorio'),
    body('department').notEmpty().withMessage('El departamento es obligatorio'),
    body('biography').notEmpty().withMessage('La biografía es obligatoria'),
    handleInputErrors,
    ProfessorController.createProfessor
);

// Obtener todos los profesores de una facultad
router.get('/faculty/:facultyId/professor', ProfessorController.getFacultyProfessors);

// Revisar si el ID del Profesor existe antes de procesar las rutas
router.param('professorId', professorExists);

// Obtener profesor por id
router.get('/faculty/:facultyId/professor/:professorId',
    param('professorId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProfessorController.getProfessorById
);

// Actualizar profesor
router.put('/faculty/:facultyId/professor/:professorId',
    body('name').notEmpty().withMessage('El nombre del profesor es obligatorio'),
    body('department').notEmpty().withMessage('El departamento es obligatorio'),
    body('biography').notEmpty().withMessage('La biografía es obligatoria'),
    handleInputErrors,
    ProfessorController.updateProfessor
);

// Eliminar profesor
router.delete('/faculty/:facultyId/professor/:professorId',
    param('professorId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProfessorController.deleteProfessor
);

export default router;