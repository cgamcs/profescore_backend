import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivityLog extends Document {
  type: 'CREATE_FACULTY' |
  'UPDATE_FACULTY' |
  'DELETE_FACULTY' |
  'CREATE_SUBJECT' |
  'UPDATE_SUBJECT' |
  'DELETE_SUBJECT' |
  'CREATE_PROFESSOR' |
  'UPDATE_PROFESSOR' |
  'DELETE_PROFESSOR';
  relatedEntity: Types.ObjectId;
  onModel: 'Faculty' | 'Subject' | 'Professor';
  changes?: string;
  timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'CREATE_FACULTY',
      'UPDATE_FACULTY',
      'DELETE_FACULTY',
      'CREATE_SUBJECT',
      'UPDATE_SUBJECT',
      'DELETE_SUBJECT',
      'CREATE_PROFESSOR',
      'UPDATE_PROFESSOR',
      'DELETE_PROFESSOR'
    ]
  },
  relatedEntity: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Faculty', 'Subject', 'Professor']
  },
  changes: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog