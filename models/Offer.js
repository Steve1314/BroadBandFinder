// models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discount: String,
  validTill: Date,
  provider: String,
  features: [String]
});

export default mongoose.model("Offer", offerSchema);
