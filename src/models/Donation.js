const { mongoose } = require("../config/db");

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  association: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["money", "object"],
    required: true,
  },
  amount: {
    type: Number,
    min: 1,
    required: function () {
      return this.type === "money";
    },
  },
  objectDetails: {
    name: { type: String },
    quantity: { type: Number, min: 1 },
    description: { type: String },
  },
  method: {
    type: String,
    enum: ["CIB", "Cash", "Bank Transfer"],
    required: function () {
      return this.type === "money";
    },
  },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  transactionHistory: [
    {
      transactionId: String,
      timestamp: Date,
      status: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = { Donation };
