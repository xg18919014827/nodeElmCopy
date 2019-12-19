'use strict';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const userInfoSchema = new Schema({

});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo