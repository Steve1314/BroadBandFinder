import express from 'express';
import { createAdmin, getAdmins, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', createAdmin); // Secure this later
router.post('/login', loginAdmin);
router.get('/', getAdmins); // Secure with middleware if needed

export default router;
