import mongoose, { Document, PopulatedDoc, Types } from 'mongoose';
import { ISubject } from './Subject';
export interface IFaculty extends Document {
    name: string;
    abbreviation: string;
    departments: Types.ObjectId[];
    subjects: PopulatedDoc<ISubject & Document>[];
}
declare const Faculty: mongoose.Model<IFaculty, {}, {}, {}, mongoose.Document<unknown, {}, IFaculty> & IFaculty & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Faculty;
