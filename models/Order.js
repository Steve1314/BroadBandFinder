import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    contact: {
      businessName: String,
      title: String,
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    serviceAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    authorizedContacts: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
    comm: {
      voice: Boolean,
      directoryListing: String,
      industryHeader: String,
      phoneNumberType: String,
      extraPhoneLines: Number,
    },
    internet: {
      planId: String,
      addBusinessWifi: Boolean,
      staticIpQty: Number,
      wirelessBackup: Boolean,
      appleTV4K: Boolean,
    },
    pricing: {
      monthly: Number,
      oneTime: Number,
    },
    install: {
      type: {
        type: String, // e.g., "pro", "self"
      },
      recipientFirst: String,
      recipientLast: String,
    },
    property: {
      sameAsContact: Boolean,
      name: String,
      phone: String,
      email: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
