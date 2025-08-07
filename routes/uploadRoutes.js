import express from 'express';
import multer from 'multer';
import { handleCsvUpload } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/csv', upload.array('files'), handleCsvUpload);

export default router;
