import express from "express";
import {
  createIndustry,
  getIndustries,
  getActiveIndustries,
  getIndustryById,
  getIndustryBySlug,
  updateIndustry,
  deleteIndustry,
} from "../controllers/industryController.js";
import { upload } from "../middlewares/multer.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/active", getActiveIndustries);
router.get("/", getIndustries);
router.get("/:id", getIndustryById);
router.get("/slug/:slug", getIndustryBySlug);

// Protected
router.post("/", authenticateUser, upload.single("coverImage"), createIndustry);
router.put("/:id", authenticateUser, upload.single("coverImage"), updateIndustry);
router.delete("/:id", authenticateUser, deleteIndustry);

export default router;