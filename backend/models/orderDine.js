import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    minLength: [3, "Customer name must be at least 3 characters long."],
    maxLength: [50, "Customer name cannot exceed 50 characters."],
  },
  phoneNumber: {
    type: String,
    required: true,
    minLength: [10, "Phone number must be 10 digits."],
    maxLength: [10, "Phone number must be 10 digits."],
  },
  address: {
    type: String,
    required: true,
    minLength: [10, "Address must be at least 10 characters long."],
    maxLength: [200, "Address cannot exceed 200 characters."],
  },
  items: [
    {
      id: {
        type: String,
        required: [true, "Item ID is required."],
      },
      title: {
        type: String,
        required: [true, "Item title is required."],
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number."],
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1."],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price must be a positive number."],
  },
  paymentMethod: {
    type: String,
    enum: ["Cash on Delivery", "Card", "UPI", "COD"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Orders = mongoose.model("Orders", orderSchema);

