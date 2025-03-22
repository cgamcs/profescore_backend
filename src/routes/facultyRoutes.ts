// Importamos las dependencias necesarias
import { Router } from 'express';
import { body, param } from 'express-validator'; // Para validaciones en las rutas
import { FacultyController } from '../controllers/FacultyController'; // Controlador para operaciones de Facultad
import { handleInputErrors } from '../middleware/validation'; // Middleware para manejar errores de validación
import { facultyExists } from '../middleware/faculty'; // Middleware para verificar si la Facultad existe
import { SubjectController } from '../controllers/SubjectController'; // Controlador para operaciones de Materias
import { subjectBelongsToFaculty, subjectExists } from '../middleware/subject'; // Middlewares para verificar que la Materia pertenece a la facultad
import { ProfessorController } from '../controllers/ProfessorController'; // Controlador para operaciones de Profesores
import { professorExists } from '../middleware/professor'; // Middlewares para verificar Profesores
import { RatingController } from '../controllers/RatingController'; // Controlador para operaciones de Calificaciones
import { ratingExists } from '../middleware/rating'; // Middlewares para verificar se la Calificacion existe
import { ratingBelongsToProfessor } from '../middleware/rating'; // Middlewares para verificar que la Calificacion pertenece al profesor
import { AuthController } from '../controllers/AuthController';

// Creamos una instancia del enrutador de Express
const router = Router();

router.post('/admin/login', 
    body('email').isEmail(),
    body('password').notEmpty(),
    handleInputErrors,
    AuthController.adminLogin
)

// Middleware que verifica si el ID de la Facultad existe antes de procesar las rutas
router.param('facultyId', facultyExists);

// Ruta para crear una nueva Facultad
router.post('/',
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre de la facultad es obligatoria'),
    body('abbreviation') // Validamos que 'abbreviation' no esté vacío
        .notEmpty().withMessage('La abreviación de la facultad es obligatoria'),
    handleInputErrors, // Manejo de errores de validación
    FacultyController.createFaculty // Controlador para crear una Facultad
);

// Ruta para obtener todas las Facultades
router.get('/', FacultyController.getAllFacultys);

// Ruta para obtener una Facultad específica por su ID
router.get('/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'), // Validación del formato del ID
    handleInputErrors, // Manejo de errores
    FacultyController.getFacultyById // Controlador para obtener la Facultad
);

// Ruta para actualizar una Facultad específica
router.put('/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'), // Validación del ID
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre de la facultad es obligatoria'),
    body('abbreviation') // Validamos que 'abbreviation' no esté vacío
        .notEmpty().withMessage('La abreviación de la facultad es obligatoria'),
    handleInputErrors, // Manejo de errores de validación
    FacultyController.updateFaculty // Controlador para actualizar la Facultad
);

// Ruta para eliminar una Facultad específica
router.delete('/:facultyId',
    param('facultyId').isMongoId().withMessage('ID no válido'), // Validación del ID
    handleInputErrors, // Manejo de errores
    FacultyController.deleteFaculty // Controlador para eliminar la Facultad
);

// --- Rutas para las Materias (Subjects) ---

// Ruta para crear una nueva Materia asociada a una Facultad
router.post('/:facultyId/subjects',
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre de la materia es obligatorio'),
    body('department') // Validamos que 'department' no esté vacío
        .notEmpty().withMessage('El departamento de la materia es obligatorio'),
    body('credits') // Validamos que 'credits' no esté vacío
        .notEmpty().withMessage('Los créditos en la materia son obligatorios'),
    handleInputErrors, // Manejo de errores de validación
    SubjectController.createSubject // Controlador para crear una Materia
);

// Ruta para obtener todas las Materias de una Facultad
router.get('/:facultyId/subjects',
    SubjectController.getFacultySubjects // Controlador para obtener las Materias de una Facultad
);

// Middlewares para validar Materias
router.param('subjectId', subjectExists); // Verifica si la Materia existe
router.param('subjectId', subjectBelongsToFaculty); // Verifica que la Materia pertenezca a la Facultad

// Ruta para obtener una Materia específica
router.get('/:facultyId/subjects/:subjectId',
    param('subjectId').isMongoId().withMessage('ID no válido'), // Validación del ID de la Materia
    SubjectController.getSubjectById // Controlador para obtener una Materia
);

// Ruta para actualizar una Materia específica
router.put('/:facultyId/subjects/:subjectId',
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre de la materia es obligatorio'),
    body('department') // Validamos que 'department' no esté vacío
        .notEmpty().withMessage('El departamento de la materia es obligatorio'),
    body('credits') // Validamos que 'credits' no esté vacío
        .notEmpty().withMessage('Los créditos en la materia son obligatorios'),
    handleInputErrors, // Manejo de errores de validación
    SubjectController.updateSubject // Controlador para actualizar una Materia
);

// Ruta para eliminar una Materia específica
router.delete('/:facultyId/subjects/:subjectId',
    param('subjectId').isMongoId().withMessage('ID no válido'), // Validación del ID de la Materia
    SubjectController.deleteSubject // Controlador para eliminar una Materia
);

// --- Rutas para los Profesores (Professors) ---

// Ruta para crear una nuevo Profesor asociado a una Materia
router.post('/:facultyId/subjects/:subjectId/professors',
    param('subjectId').isMongoId().withMessage('ID de materia inválido'),
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre del profesor es obligatorio'),
    body('department') // Validamos que 'department' no esté vacío
        .notEmpty().withMessage('El departamento es obligatorio'),
    body('biography') // Validamos que 'biography' no esté vacío
        .notEmpty().withMessage('La biografia es obligatorios'),
    handleInputErrors, // Manejo de errores de validación
    ProfessorController.createProfessor // Controlador para crear una Materia
);

// Ruta para obtener todos los Profesores de una Facultad
router.get('/:facultyId/professors',
    ProfessorController.getFacultyProfessors // Controlador para obtener los Profesores de la Facultad
);

// Middleware que verifica si el ID del Profesor existe antes de procesar las rutas
router.param('professorId', professorExists);

// Ruta para obtener un Profesor específicao
router.get('/:facultyId/professors/:professorId',
    param('professorId').isMongoId().withMessage('ID no válido'), // Validación del ID del Profesor
    ProfessorController.getProfessorById // Controlador para obtener un Profesor
);

// Ruta para actualizar un Profesor específico
router.put('/:facultyId/professors/:professorId',
    body('name') // Validamos que 'name' no esté vacío
        .notEmpty().withMessage('El nombre de la materia es obligatorio'),
    body('department') // Validamos que 'department' no esté vacío
        .notEmpty().withMessage('El departamento de la materia es obligatorio'),
    body('biography') // Validamos que 'biography' no esté vacío
        .notEmpty().withMessage('Los créditos en la materia son obligatorios'),
    handleInputErrors, // Manejo de errores de validación
    ProfessorController.updateProfessor // Controlador para actualizar un Profesor
);

// Ruta para eliminar un Profesor específico
router.delete('/:facultyId/professors/:professorId',
    param('professorId').isMongoId().withMessage('ID no válido'), // Validación del ID del Profesor
    ProfessorController.deleteProfessor // Controlador para eliminar un Profesor
);

// --- Rutas para las Calificaciones (Ratings) ---

// Ruta para crear una nueva Calificacion asociado a un Profesor
router.post('/:facultyId/professors/:professorId/ratings', 
    body('general').isFloat({ min: 1, max: 5 }),
    body('subject').isMongoId(),
    // ... validaciones para otros campos
    handleInputErrors,
    RatingController.createRating
);

router.get('/:facultyId/professors/:professorId/ratings', RatingController.getProfessorRatings);

router.param('ratingId', ratingExists);

// Votos útiles
router.post('/:facultyId/professors/:professorId/ratings/:ratingId/vote',
    handleInputErrors,
    ratingBelongsToProfessor,
    RatingController.voteHelpful
);

// Exportamos el enrutador para usarlo en el archivo principal
export default router;