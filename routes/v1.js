"use strict";

import express from "express";
import User from "../controller/v2/user";
import CityHandle from "../controller/v1/cities";

const router = express.Router();

router.get("/user", User.getInfo);
router.get("/cities", CityHandle.getCity);

export default router;
