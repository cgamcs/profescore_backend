import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { IProfessor } from './Professor'

export interface ISubject extends Document {
    name: string
    department: string
    credits: number
    description?: string // Opcional
    faculty: Types.ObjectId // Referencias a facultad
    professors: PopulatedDoc<IProfessor & Document>[]
}

const SubjectSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la materia es obligatorio'],
        unique: false,
        trim: true
    },
    department: {
        type: String,
        required: [true, 'El departamento es obligatorio']
    },
    credits: {
        type: Number,
        required: true,
        min: [1, 'Los créditos deben ser al menos 1'],
        max: [6, 'Los créditos no pueden exceder 6']
    },
    description: {
        type: String,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
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
    ]
}, { timestamps: true })

SubjectSchema.index(
    { name: 1, faculty: 1 }, 
    { 
        unique: true, 
        name: "unique_subject_per_faculty",
        partialFilterExpression: { faculty: { $exists: true } }
    }
);

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)
export default Subject