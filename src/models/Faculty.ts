import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { ISubject } from './Subject';

export interface IFaculty extends Document {
    name: string
    abbreviation: string
    subjects: PopulatedDoc<ISubject & Document>[]
}

const FacultySchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la facultad es obligatorio'],
        unique: true,
        trim: true
    },
    abbreviation: {
        type: String,
        required: [true, 'La abreviatura es obligatoria'],
        uppercase: true,
        maxlength: [6, 'La abreviatura no puede exceder 6 caracteres']
    },
    subjects: [
        {
            type: Types.ObjectId,
            ref: 'Subject'
        }
    ]
}, { timestamps: true })

const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema)
export default Faculty