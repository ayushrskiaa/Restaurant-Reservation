import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controller/productController.js";

const router = express.Router();

// Multer setup (store file temporarily)
const upload = multer({ dest: "uploads/" });

// Image upload endpoint
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "restaurant_products",
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    // Return Cloudinary URL and public_id
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cloudinary upload failed", details: err.message });
  }
});

router.get("/", getAllProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;