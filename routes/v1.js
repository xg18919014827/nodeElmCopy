"use strict";

import express from "express";
import User from "../controller/v2/user";
import CityHandle from "../controller/v1/cities";
import Captchas from '../controller/v1/captchas'

const router = express.Router();

router.get("/user", User.getInfo);
router.get("/cities", CityHandle.getCity);
router.post('/captchas', Captchas.getCaptchas);

export default router;