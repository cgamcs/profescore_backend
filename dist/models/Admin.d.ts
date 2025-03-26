import mongoose, { Document } from 'mongoose';
export interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
}
declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin> & IAdmin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Admin;
