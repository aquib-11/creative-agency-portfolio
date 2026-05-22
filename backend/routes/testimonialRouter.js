import express from "express";
import {
  createTestimonial,
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  getTestimonialStats,
  updateTestimonial,
  deleteTestimonial,
  createBulkTestimonials,
} from "../controllers/testimonialController.js";
import { upload } from "../middlewares/multer.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", getTestimonialStats);
router.get("/", getTestimonials);
router.get("/featured", getFeaturedTestimonials);
router.get("/:id", getTestimonialById);

router.post("/", authenticateUser, upload.single("image"), createTestimonial);
router.put("/:id", authenticateUser, upload.single("image"), updateTestimonial);
router.delete("/:id", authenticateUser, deleteTestimonial);

router.post("/bulk", authenticateUser, createBulkTestimonials);





export default router;