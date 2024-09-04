

import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: 'false'
    }
}, {
    timestamps: true,
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
