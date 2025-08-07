import express from 'express';
import { createPolicy, getPolicies } from '../controllers/policyController.js';
const router = express.Router();

router.post('/', createPolicy);
router.get('/', getPolicies);

export default router;