const { mongoose } = require("../config/db");

const checkInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  associationId: { type: mongoose.Schema.Types.ObjectId, ref: "Association", required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date, default: null }, // Null until user checks out
});

const CheckIn = mongoose.model("CheckIn", checkInSchema);

module.exports = { CheckIn };
