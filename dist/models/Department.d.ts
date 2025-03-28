import mongoose, { Document, Types } from 'mongoose';
import { IFaculty } from './Faculty';
export interface IDepartment extends Document {
    name: string;
    faculty: Types.ObjectId | IFaculty;
}
declare const _default: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment> & IDepartment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
