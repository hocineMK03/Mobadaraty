const {mongoose} = require("../config/db");

const checkInSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VolunteerUser",
    required: true,
  },
  associationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociationUser",
    required: true,
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Scanner Account
  },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date, default: null },
  status: { type: String, enum: ["checked-in", "checked-out"], default: "checked-in" },
  location: {
    coordinates: { type: [Number], required: false }, // [longitude, latitude]
    address: { type: String, required: false },
  },
});

const CheckIn = mongoose.model("CheckIn", checkInSchema);
module.exports = {CheckIn};
