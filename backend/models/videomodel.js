
import mongoose from "mongoose";

const PLATFORMS = [
  "instagram",
  "youtube",
  "facebook",
  "tiktok",
  "twitter",
  "linkedin",
  "other",
];

const videoSchema = new mongoose.Schema(
  {
    thumbnail: {
      url: {
        type: String,
        required: true,
      },

      key: {
        type: String,
        required: true,
      },
    },

    video: {
      url: {
        type: String,
        required: true,
      },

      key: {
        type: String,
        required: true,
      },
    },

    platform: {
      type: String,
      enum: PLATFORMS,
      required: true,
    },

    sourceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "oa-portfolio-industries",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "oa-portfolio-videos",
  videoSchema
);