import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    coverImage: { url: String, key: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Pre-save: shift conflicting orders ───────────────────────────────────────
industrySchema.pre("save", async function (next) {
  const Industry = this.constructor;

  // Skip if order wasn't touched
  if (!this.isNew && !this.isModified("order")) return next();

  const desiredOrder = this.order;

  // New doc with default order=0 means user didn't set one → auto-assign to end
  if (this.isNew && desiredOrder === 0) {
    const last = await Industry.findOne({ _id: { $ne: this._id } })
      .sort({ order: -1 })
      .select("order")
      .lean();
    this.order = last ? last.order + 1 : 1;
    return next();
  }

  // Shift every other industry at or after the desired slot down by 1
  await Industry.updateMany(
    { _id: { $ne: this._id }, order: { $gte: desiredOrder } },
    { $inc: { order: 1 } }
  );

  next();
});

// ─── Post-delete: compact the gap left behind ─────────────────────────────────
industrySchema.post("deleteOne", { document: true, query: false }, async function () {
  const Industry = this.constructor;
  await Industry.updateMany(
    { order: { $gt: this.order } },
    { $inc: { order: -1 } }
  );
});

export default mongoose.model("oa-portfolio-industries", industrySchema);