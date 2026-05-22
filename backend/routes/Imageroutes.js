// routes/imageroutes.js

import express from "express";

import {
  createImage,
  getImages,
  getImageById,
  getImagesByIndustry,
  getImagesByIndustrySlug,
  updateImage,
  deleteImage,
} from "../controllers/Imagecontroller.js";

import { upload } from "../middlewares/multer.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// Public
// ─────────────────────────────────────────────

router.get(
  "/industry/:industryId",
  getImagesByIndustry
);

router.get(
  "/industry-slug/:slug",
  getImagesByIndustrySlug
);

router.get("/", getImages);

router.get("/:id", getImageById);

// ─────────────────────────────────────────────
// Protected
// ─────────────────────────────────────────────

router.post(
  "/",
  authenticateUser,
  upload.array("images", 20),
  createImage
);

router.put(
  "/:id",
  authenticateUser,
  upload.single("image"),
  updateImage
);

router.delete(
  "/:id",
  authenticateUser,
  deleteImage
);

export default router;