import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    coverImage: { url: String, key: String },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "oa-portfolio-industries",
      default: null,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── Pre-save hook ────────────────────────────────────────────────────────────
clientSchema.pre("save", async function (next) {
  const Client = this.constructor;
  const currentIndustry = this.industry ?? null;

  const industryChanged =
    this.isModified("industry") &&
    !this.isNew &&
    String(this._previousIndustry ?? null) !== String(currentIndustry);

  // ── CASE 1: industry changed → compact old group, append to end of new group
  if (industryChanged) {
    const oldIndustry = this._previousIndustry ?? null;
    const oldOrder = this._previousOrder ?? 0;

    // Compact the gap left in the OLD industry group
    await Client.updateMany(
      { _id: { $ne: this._id }, industry: oldIndustry, order: { $gt: oldOrder } },
      { $inc: { order: -1 } }
    );

    // Auto-assign to end of NEW industry group
    const last = await Client.findOne({ _id: { $ne: this._id }, industry: currentIndustry })
      .sort({ order: -1 })
      .select("order")
      .lean();

    this.order = last ? last.order + 1 : 1;
    return next();
  }

  // ── CASE 2: new doc with default order=0 → auto-assign to end of its group
  if (this.isNew && this.order === 0) {
    const last = await Client.findOne({ _id: { $ne: this._id }, industry: currentIndustry })
      .sort({ order: -1 })
      .select("order")
      .lean();

    this.order = last ? last.order + 1 : 1;
    return next();
  }

  // ── CASE 3: order explicitly set/changed → shift only within the same group
  if (this.isNew || this.isModified("order")) {
    await Client.updateMany(
      { _id: { $ne: this._id }, industry: currentIndustry, order: { $gte: this.order } },
      { $inc: { order: 1 } }
    );
  }

  next();
});

// ─── Post-delete: compact only within the same industry group ─────────────────
clientSchema.post("deleteOne", { document: true, query: false }, async function () {
  const Client = this.constructor;
  await Client.updateMany(
    { industry: this.industry ?? null, order: { $gt: this.order } },
    { $inc: { order: -1 } }
  );
});

export default mongoose.model("oa-portfolio-clients", clientSchema);