import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRating extends Document {
    general: number;
    explanation: number;
    accessibility: number;
    difficulty: number;
    attendance: number;
    wouldRetake: boolean;
    comment: string;
    professor: Types.ObjectId;
    subject: Types.ObjectId;
    likes: string[]; // Almacenará IPs de likes
    dislikes: string[]; // Almacenará IPs de dislikes
    createdAt: Date;
}

const RatingSchema: Schema = new Schema({
    general: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    explanation: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    accessibility: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    attendance: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    wouldRetake: {
        type: Boolean,
        required: true
    },
    comment: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'Professor',
        required: [true, 'El profesor es requerido']
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'La materia es requerida']
    },
    likes: {
        type: [String],
        default: [] // Inicializar array vacío
    },
    dislikes: {
        type: [String],
        default: [] // Inicializar array vacío
    }
});

const Rating = mongoose.model<IRating>('Rating', RatingSchema);
export default Rating;