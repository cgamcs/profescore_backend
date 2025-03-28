import mongoose, { PopulatedDoc, Document, Types } from 'mongoose';
import { IDepartment } from './Department';
export interface IProfessor extends Document {
    name: string;
    biography: string;
    department: PopulatedDoc<IDepartment & Document>;
    faculty: Types.ObjectId;
    subjects: Types.ObjectId[];
    ratingStats: {
        totalRatings: number;
        averageGeneral: number;
        averageExplanation: number;
        averageAccessibility: number;
        averageDifficulty: number;
        averageAttendance: number;
        wouldRetakePercentage: number;
    };
}
declare const Professor: mongoose.Model<IProfessor, {}, {}, {}, mongoose.Document<unknown, {}, IProfessor> & IProfessor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Professor;
