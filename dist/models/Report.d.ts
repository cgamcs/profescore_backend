import mongoose, { Document, Types } from 'mongoose';
export interface IReport extends Document {
    commentId: Types.ObjectId;
    ratingComment: string;
    ratingDate: Date;
    teacherId: Types.ObjectId;
    subject: string;
    reasons: string[];
    reportComment?: string;
    status: 'pending' | 'rejected' | 'deleted';
    reportDate: Date;
}
declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Report;
