import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First name must be of at least 3 Characters."],
    maxLength: [30, "First name cannot exceed 30 Characters."],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: [3, "Last name must be of at least 3 Characters."],
    maxLength: [30, "Last name cannot exceed 30 Characters."],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Reservation date is required"],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: "Reservation date must be in the future",
    },
  },
  time: {
    type: String,
    required: [true, "Reservation time is required"],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide time in HH:MM format"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Provide a valid email"],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: [
      (v) => validator.isMobilePhone(v, ["en-PK", "en-US", "en-GB", "en-IN"]),
      "Provide a valid phone number",
    ],
  },
  guests: {
    type: Number,
    required: [true, "Number of guests is required"],
    min: [1, "At least 1 guest is required"],
    max: [20, "Maximum 20 guests allowed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Reservation = mongoose.model("Reservation", reservationSchema);
