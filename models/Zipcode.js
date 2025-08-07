import mongoose from 'mongoose';
const ZipcodeSchema = new mongoose.Schema({
  city: { type: String },
  zipcode: { type: String, unique: true },
    number: { type: Number },
  types: [
    {
      typeName: String,
      availability: Boolean
    }
  ]
});
export default mongoose.model('Zipcode', ZipcodeSchema);
