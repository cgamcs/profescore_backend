import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { IProfessor } from './Professor';
import { IDepartment } from './Department';
import { IFaculty } from './Faculty';

export interface ISubject extends Document {
    name: string;
    credits: number;
    description?: string; // Opcional
    department: PopulatedDoc<IDepartment & Document>;
    faculty: PopulatedDoc<IFaculty & Document>; // Referencias a facultad
    professors: PopulatedDoc<IProfessor & Document>[];
    normalizedName: string; // Nuevo campo para el nombre normalizado
}

const SubjectSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la materia es obligatorio'],
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        min: [1, 'Los créditos deben ser al menos 1'],
        max: [30, 'Los créditos no pueden exceder de 30']
    },
    description: {
        type: String,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    department: {
        type: Types.ObjectId,
        ref: 'Department',
        required: false
    },
    faculty: {
        type: Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    professors: [
        {
            type: Types.ObjectId,
            ref: 'Professor'
        }
    ],
    normalizedName: {
        type: String,
        required: true
    } // Ya no es único por sí solo
}, { timestamps: true });

// Eliminado el índice anterior basado solo en name y faculty
// Creado un nuevo índice compuesto para normalizedName y faculty
SubjectSchema.index(
    { normalizedName: 1, faculty: 1 },
    {
        unique: true,
        name: "unique_normalized_name_per_faculty",
        partialFilterExpression: { faculty: { $exists: true } }
    }
);

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
export default Subject;