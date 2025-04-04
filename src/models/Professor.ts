import mongoose, { Schema, PopulatedDoc, Document, Types } from 'mongoose';
import { IDepartment } from './Department';

export interface IProfessor extends Document {
    name: string;
    biography: string;
    department: PopulatedDoc<IDepartment & Document>;
    faculty: Types.ObjectId; // Referencias a facultad
    subjects: Types.ObjectId[]; // Referencias a materia
    ratingStats: {
        totalRatings: number;
        averageGeneral: number;
        averageExplanation: number;
        averageAccessibility: number;
        averageDifficulty: number;
        averageAttendance: number;
        wouldRetakePercentage: number;
    }
}

const ProfessorSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    biography: {
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
    subjects: [
        {
            type: Types.ObjectId,
            ref: 'Subject',
            required: true
        }
    ],
    ratingStats: {
        totalRatings: { type: Number, default: 0 },
        averageGeneral: { type: Number, default: 0 },
        averageExplanation: { type: Number, default: 0 },
        averageAccessibility: { type: Number, default: 0 },
        averageDifficulty: { type: Number, default: 0 },
        averageAttendance: { type: Number, default: 0 },
        wouldRetakePercentage: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Índice compuesto para evitar duplicados en la misma facultad
ProfessorSchema.index(
    { name: 1, faculty: 1 },
    { unique: true, name: "unique_professor_per_faculty" }
);

const Professor = mongoose.model<IProfessor>('Professor', ProfessorSchema);
export default Professor;