'use strict';

import express from 'express'
import User from '../controller/v2/user';

const router = express.Router();

router.get('/user', User.getInfo);

export default router;