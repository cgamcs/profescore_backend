import mongoose, { Document, Types } from 'mongoose';
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
    likes: string[];
    dislikes: string[];
    createdAt: Date;
}
declare const Rating: mongoose.Model<IRating, {}, {}, {}, mongoose.Document<unknown, {}, IRating> & IRating & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Rating;
