import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'password is required'],
        },
        subscription: {
            type: String,
            enum: ['starter', 'pro', 'business'],
            default: 'starter',
        },
        token: {
            type: String,
            default: null,
        },
    
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const User = model('User', userSchema);

export default User;