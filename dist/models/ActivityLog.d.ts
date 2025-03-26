import mongoose, { Document, Types } from 'mongoose';
export interface IActivityLog extends Document {
    type: 'CREATE_FACULTY' | 'UPDATE_FACULTY' | 'DELETE_FACULTY' | 'CREATE_SUBJECT' | 'UPDATE_SUBJECT' | 'DELETE_SUBJECT' | 'CREATE_PROFESSOR' | 'UPDATE_PROFESSOR' | 'DELETE_PROFESSOR';
    relatedEntity: Types.ObjectId;
    onModel: 'Faculty' | 'Subject' | 'Professor';
    changes?: string;
    timestamp: Date;
}
declare const ActivityLog: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog> & IActivityLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ActivityLog;
