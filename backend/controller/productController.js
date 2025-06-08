import Product from "../models/product.js";
import express from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public")); // Save to public folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// Upload endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ filename: req.file.filename });
});

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// Add a product
export const addProduct = async (req, res) => {
  try {
    const { title, price, offer, image, category } = req.body; // include category
    const product = await Product.create({ title, price, offer, image, category }); // include category
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Product add error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update product (delete old image if new one is uploaded)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, offer, image, public_id } = req.body;

    const oldProduct = await Product.findById(id);

    // If a new image is uploaded and there was a previous image, delete the old one from Cloudinary
    if (public_id && oldProduct && oldProduct.public_id && oldProduct.public_id !== public_id) {
      await cloudinary.uploader.destroy(oldProduct.public_id);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { title, price, offer, image, public_id },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// Delete product (also delete image from Cloudinary)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // Delete image from Cloudinary if exists
    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

export default router;