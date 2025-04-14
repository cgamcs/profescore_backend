import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  commentId: Types.ObjectId;
  ratingComment: string;
  ratingDate: Date;
  teacherId: Types.ObjectId;
  subject: Types.ObjectId;
  reasons: string[];
  reportComment?: string;
  status: 'pending' | 'rejected' | 'deleted';
  reportDate: Date;
}

const ReportSchema: Schema = new Schema({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Rating',
    required: true
  },
  ratingComment: {
    type: String,
    required: true
  },
  ratingDate: {
    type: Date,
    required: true
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  reasons: {
    type: [String],
    required: true
  },
  reportComment: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'deleted'],
    default: 'pending'
  },
  reportDate: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model<IReport>('Report', ReportSchema);
export default Report;