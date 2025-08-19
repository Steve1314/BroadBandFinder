import express from 'express';
import { searchATTByZipcode, searchComcastByZipcode, searchProvidersByZipcode, searchSpectrumByZipcode } from '../controllers/searchController.js';

const router = express.Router();

router.get('/providers', searchProvidersByZipcode);
router.get('/providers/spectrum', searchSpectrumByZipcode);
router.get('/providers/att', searchATTByZipcode);
router.get('/providers/comcast', searchComcastByZipcode);

export default router;
