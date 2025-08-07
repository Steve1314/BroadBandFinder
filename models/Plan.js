import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  providerName: { type: String, required: true },
  price: { type: Number, required: true },
  speed: { type: String, required: true },
  connection: { type: String, required: true },
  zipcode: { type: mongoose.Schema.Types.ObjectId, ref: 'Zipcode', required: true }
});

export default mongoose.model('Plan', PlanSchema);
