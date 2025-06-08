import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
  paymentDone: { type: Boolean, default: false },
});

export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
