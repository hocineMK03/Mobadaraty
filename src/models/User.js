const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ["association", "volunteer"] },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "role", collection: "users" }
);

const User = mongoose.model("User", userSchema);

const associationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  locations: [
    {
      coordinates: { type: [Number], required: true },
      address: { type: String }, 
      city: { type: String }, 
    },
  ],

  CIB: { type: String, required: true, unique: true },
  legalDocument: [{ type: String }],
  specialToken: { type: String, unique: true },
});

const AssociationUser = User.discriminator("association", associationSchema);

const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationalCardNumber: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  qrCode: { type: String },
  availability: [{ type: String, enum: ["morning", "afternoon", "evening"] }],
  volunteerType: {
    type: String,
    required: true,
    enum: ["independent", "association_member"],
  },
  associationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociationUser",
  },
});
volunteerSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyValue.nationalCardNumber) {
      return next(new Error("nationalCardNumber already exists"));
    }
  }
  next(error);
});
const VolunteerUser = User.discriminator("volunteer", volunteerSchema);

module.exports = { User, AssociationUser, VolunteerUser };
