import express from "express";
import {
  createClient,
  getClients,
  getActiveClients,
  getClientById,
  getClientBySlug,
  getClientsByIndustry,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { upload } from "../middlewares/multer.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/active", getActiveClients);
router.get("/industry/:industryId", getClientsByIndustry);
router.get("/slug/:slug", getClientBySlug);
router.get("/", getClients);
router.get("/:id", getClientById);

// Protected
router.post("/", authenticateUser, upload.single("coverImage"), createClient);
router.put("/:id", authenticateUser, upload.single("coverImage"), updateClient);
router.delete("/:id", authenticateUser, deleteClient);

export default router;