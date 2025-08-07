import mongoose from 'mongoose';

const CustomerDetailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  installationAddress: { type: String, required: true },
  date: { type: Date, required: true },
  additionalNotes: { type: String }
});

export default mongoose.model('CustomerDetail', CustomerDetailSchema);
