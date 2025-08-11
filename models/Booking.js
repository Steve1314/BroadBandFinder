import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  zip:Number,
  date: String,
  notes: String,
  provider: String,
  price: String,
  speed: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Booking', bookingSchema);
