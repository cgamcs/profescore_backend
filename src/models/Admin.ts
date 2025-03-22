import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password: string;
}

const AdminSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema)
export default Admin