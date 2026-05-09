import { validationResult } from "express-validator";
import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";

/**
 * Create a new table reservation
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing reservation details
 * @param {string} req.body.firstName - Customer first name (3-30 chars)
 * @param {string} req.body.lastName - Customer last name (3-30 chars)
 * @param {string} req.body.email - Customer email address
 * @param {string} req.body.phone - Customer phone number
 * @param {string} req.body.date - Reservation date (YYYY-MM-DD format)
 * @param {string} req.body.time - Reservation time (HH:MM format)
 * @param {number} req.body.guests - Number of guests (1-20)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with reservation details or error message
 */
const send_reservation = async (req, res, next) => {
  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const { firstName, lastName, email, date, time, phone, guests } = req.body;

  try {
    // Parse date string (format: YYYY-MM-DD) to Date object
    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return next(new ErrorHandler("Invalid date format. Use YYYY-MM-DD", 400));
    }

    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      date: reservationDate,
      time,
      phone,
      guests: parseInt(guests, 10),
    });

    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      reservation: {
        id: reservation._id,
        date: reservation.date.toISOString().split("T")[0],
        time: reservation.time,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors)
        .map(err => err.message)
        .join(", ");
      return next(new ErrorHandler(validationErrors, 400));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return next(
        new ErrorHandler("A reservation with this email already exists", 400)
      );
    }

    return next(error);
  }
};

export { send_reservation };
export default send_reservation;

