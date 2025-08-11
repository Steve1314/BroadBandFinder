// models/Provider.js
import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: String,
  startingPrice: String,
  speed: String,
  conditions: String,
  details: String, // This will store your providerDetailsData string
});

export default mongoose.model('Provider', providerSchema);
