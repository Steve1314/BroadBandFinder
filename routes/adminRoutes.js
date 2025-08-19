import express from 'express';
import { createAdmin } from '../controllers/adminController.js';
import { loginAdmin } from '../controllers/loginAdmin.js'; // Assuming you have a function to get admins

const router = express.Router();

router.post('/create', createAdmin); // Secure this later
router.post('/login', loginAdmin);
// router.get('/', getAdmins); // Secure with middleware if needed

export default router;
