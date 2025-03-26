import mongoose, { Document, PopulatedDoc } from 'mongoose';
import { IProfessor } from './Professor';
import { IDepartment } from './Department';
import { IFaculty } from './Faculty';
export interface ISubject extends Document {
    name: string;
    credits: number;
    description?: string;
    department: PopulatedDoc<IDepartment & Document>;
    faculty: PopulatedDoc<IFaculty & Document>;
    professors: PopulatedDoc<IProfessor & Document>[];
}
declare const Subject: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject> & ISubject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Subject;
