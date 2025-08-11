import mongoose from "mongoose";


const ZipSearchSchema = new mongoose.Schema({
  zipcode: String,
  city: String,
  searchedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ZipSearch", ZipSearchSchema);
