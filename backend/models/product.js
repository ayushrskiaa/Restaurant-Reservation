import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  offer: String,
  image: String,      // Cloudinary URL
  public_id: String,   // Cloudinary public_id
  category: {
    type: String,
    required: true,
    enum: [
      "Main Course",
      "Starter",
      "Dessert",
      "Beverage",
      "Breakfast",
      "Snacks",
      "Other"
    ]
  }
});

export default mongoose.model("Product", productSchema);