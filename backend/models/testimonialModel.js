import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: String,
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    image: {
      url: String,
      key: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("oa-portfolio-testimonials", testimonialSchema);