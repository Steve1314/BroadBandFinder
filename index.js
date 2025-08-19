import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';


// Existing routes
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import offersRoutes from './routes/offersRoutes.js';
import planRoutes from './routes/planRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import zipcodeRoutes from './routes/zipcodeRoutes.js';
import zipSearchCountRoutes from './routes/zipSearchCount.js';
import conversationRoutes from './routes/conversationRoutes.js'; // <-- new route for conversations
import orderRoutes  from './routes/orderRoutes.js';

// Chat socket
import chatSocket from './socket/chatSocket.js'; // <-- new file you'll create

dotenv.config();

const app = express();
const server = createServer(app); // HTTP server for both API & sockets
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*', credentials: true }
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// API routes
app.use('/api/zipcodes', zipcodeRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/zip-search', zipSearchCountRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/conversations', conversationRoutes); // <-- new route for conversations
app.use("/api/orders", orderRoutes);


// Socket.IO handling
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  chatSocket(socket, io); // delegate events to socket handler
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
