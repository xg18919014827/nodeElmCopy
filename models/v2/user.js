'use strict';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    user_id: {
        type: Number
    }
});

const User = mongoose.model('Usermodel', UserSchema);

export default User