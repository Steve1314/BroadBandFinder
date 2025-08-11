import express from "express";

import { zipcodeSearchCount } from "../controllers/ZipSearchCountController.js";

const router = express.Router();

router.get("/", zipcodeSearchCount);

export default router;
