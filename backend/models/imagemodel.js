// models/imagemodel.js

import mongoose from "mongoose";

const imageSchema =
  new mongoose.Schema(
    {
      image: {
        url: String,
        key: String,
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
  "oa-portfolio-images",
  imageSchema
);