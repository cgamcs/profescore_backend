// models/User.js
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  fingerprint: string;
  ip: string;
  lastRatingDate: Date;
  ratedProfessors: {
    professorId: Types.ObjectId;
    subjectId: Types.ObjectId;
    ratingDate: Date;
  }[];
}

const userSchema: Schema = new Schema({
  fingerprint: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  lastRatingDate: { type: Date, default: null },
  ratedProfessors: [
    {
      professorId: { type: Types.ObjectId, ref: 'Professor', required: true },
      subjectId: { type: Types.ObjectId, ref: 'Subject', required: true },
      ratingDate: { type: Date, required: true }
    }
  ]
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;