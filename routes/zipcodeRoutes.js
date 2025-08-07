import express from 'express';
import { createZipcode, getZipcodes } from '../controllers/zipcodeController.js';
const router = express.Router();

router.post('/', createZipcode);
router.get('/', getZipcodes);

export default router;