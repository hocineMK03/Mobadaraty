const { mongoose } = require("../config/db");

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
      placeName: { type: String, required: true },
      coordinates: { type: [Number], required: true }, 
      city: { type: String },
      requiredVolunteers: { type: Number }, 
      assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "VolunteerUser" }], 
      skills: [{ type: String }],
      tasks: [
        {
          title: String,
          description: String,
          assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "VolunteerUser" }], 
          status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
          dueDate: Date,
        }
      ]
    }
  ],
  legalDocument: [{ type: String }],
   specialToken: { type: String, unique: true },
  CIB: { type: String, required: true, unique: true },
  is_valid: { type: Boolean, default: false },
});


const AssociationUser = User.discriminator("association", associationSchema);

const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationalCardNumber: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  qrCode: { type: String },
  location: {
    city: { type: String },
    street: { type: String },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  availability: [{ type: String, enum: ["morning", "afternoon", "evening"] }],

  volunteerType: {
    type: String,
    required: true,
    enum: ["independent", "association_member"],
  },

  associationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociationUser",
    required: function () {
      return this.volunteerType === "association_member";
    },
  },

  assignedLocation: {
    associationId: { type: mongoose.Schema.Types.ObjectId, ref: "AssociationUser" },
    placeName: { type: String },
   
  },

  points: { type: Number, default: 0 },
});

// Handle unique constraint errors
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
