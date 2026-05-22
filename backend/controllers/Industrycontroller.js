import Industry from "../models/industrymodel.js";
import Client from "../models/clientModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import { makeSlug, getUniqueSlug } from "../utils/slugUtils.js";

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createIndustry = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    // If order is explicitly provided use it, otherwise pass 0 so
    // the pre-save hook auto-assigns to end of list
    const order = req.body.order !== undefined ? Number(req.body.order) : 0;

    const baseSlug = makeSlug(name);
    const slug = await getUniqueSlug(Industry, baseSlug);

    const coverImage = req.file ? await uploadToS3(req.file, "industries") : {};

    const industry = await Industry.create({
      name,
      slug,
      description,
      coverImage,
      order,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: industry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL (paginated + search) ─────────────────────────────────────────────
export const getIndustries = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [industries, totalDocs] = await Promise.all([
      Industry.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Industry.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({ success: true, data: industries, pagination });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET ACTIVE (for public homepage — no pagination) ─────────────────────────
export const getActiveIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: industries });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET ONE BY ID ────────────────────────────────────────────────────────────
export const getIndustryById = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── GET ONE BY SLUG ──────────────────────────────────────────────────────────
export const getIndustryBySlug = async (req, res) => {
  try {
    const industry = await Industry.findOne({ slug: req.params.slug });
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateIndustry = async (req, res) => {
  try {
    const { name, description, order, isActive } = req.body;

    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    if (req.file) {
      if (industry.coverImage?.key) await deleteFromS3(industry.coverImage.key);
      industry.coverImage = await uploadToS3(req.file, "industries");
    }

    // If name changes → regenerate slug
    if (name !== undefined && name !== industry.name) {
      industry.name = name;
      const baseSlug = makeSlug(name);
      industry.slug = await getUniqueSlug(Industry, baseSlug, industry._id);
    }

    if (description !== undefined) industry.description = description;
    if (isActive !== undefined) industry.isActive = isActive;

    // Assign order last — triggers pre-save hook to shift others
    if (order !== undefined) industry.order = Number(order);

    await industry.save();

    res.json({ success: true, data: industry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteIndustry = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    const clients = await Client.find({ industry: industry._id });
    if (clients.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete industry with associated clients" });
    }

    if (industry.coverImage?.key) await deleteFromS3(industry.coverImage.key);

    await industry.deleteOne();

    res.json({ success: true, message: "Industry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};