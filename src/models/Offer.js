const { mongoose } = require("../config/db");

const offerSchema = new mongoose.Schema(
  {
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
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "offers" }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = { Offer };
