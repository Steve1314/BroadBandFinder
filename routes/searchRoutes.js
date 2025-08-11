import express from 'express';
import { searchProvidersByZipcode } from '../controllers/searchController.js';

const router = express.Router();

router.get('/providers', searchProvidersByZipcode);

export default router;
