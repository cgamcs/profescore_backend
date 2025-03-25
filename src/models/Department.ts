import mongoose, { Document, Schema, Types } from 'mongoose';
import { IFaculty } from './Faculty';

export interface IDepartment extends Document {
    name: string;
    faculty: Types.ObjectId | IFaculty; // Cada departamento pertenece a una facultad
}

const DepartmentSchema = new Schema<IDepartment>({
    name: {
        type: String,
        required: true,
        unique: false // Permitir mismo nombre en diferentes facultades
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    }
});

// Índice compuesto para evitar duplicados en la misma facultad
DepartmentSchema.index(
    { name: 1, faculty: 1 },
    { unique: true, name: "unique_department_per_faculty" }
);

export default mongoose.model<IDepartment>('Department', DepartmentSchema);