import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import planRoutes from './routes/planRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import zipcodeRoutes from './routes/zipcodeRoutes.js';
import zipSearchCountRoutes from './routes/zipSearchCount.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(morgan('dev'));
app.use('/api/zipcodes', zipcodeRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/zip-search', zipSearchCountRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));