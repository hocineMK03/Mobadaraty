const {mongoose} = require("../config/db");

const invitationSchema = new mongoose.Schema({
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who sent it?
  email: { type: String, required: true }, // Who received it?
 
  status: { type: String, enum: ["pending", "accepted", "expired"], default: "pending" },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, 
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = {Invitation};
