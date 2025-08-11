import mongoose from 'mongoose';

const PrivacyPolicySchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('PrivacyPolicy', PrivacyPolicySchema);
