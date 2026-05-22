// routes/videoRoutes.js

import express from "express";

import {
  createVideo,
  getVideos,
  getVideoById,
  getVideosByIndustry,
  getVideosByIndustrySlug,
  getVideosByPlatform,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";

import { upload } from "../middlewares/multer.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/industry/:industryId",
  getVideosByIndustry
);

router.get(
  "/industry-slug/:slug",
  getVideosByIndustrySlug
);

router.get(
  "/platform/:platform",
  getVideosByPlatform
);

router.get("/", getVideos);

router.get("/:id", getVideoById);

router.post(
  "/",
  authenticateUser,

  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),

  createVideo
);

router.put(
  "/:id",
  authenticateUser,

  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),

  updateVideo
);

router.delete(
  "/:id",
  authenticateUser,
  deleteVideo
);

export default router;