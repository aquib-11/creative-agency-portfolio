import Industry from "../models/industrymodel.js";
import Client from "../models/clientModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import { makeSlug, getUniqueSlug } from "../utils/slugUtils.js";

export const createIndustry = async (req, res) => {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

   
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
 
};

export const getIndustries = async (req, res) => {
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
  
};

export const getActiveIndustries = async (req, res) => {
    const industries = await Industry.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: industries });
  
};

export const getIndustryById = async (req, res) => {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  
};

export const getIndustryBySlug = async (req, res) => {
    const industry = await Industry.findOne({ slug: req.params.slug });
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.json({ success: true, data: industry });
  
};

export const updateIndustry = async (req, res) => {
    const { name, description, order, isActive } = req.body;

    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    if (req.file) {
      if (industry.coverImage?.key) await deleteFromS3(industry.coverImage.key);
      industry.coverImage = await uploadToS3(req.file, "industries");
    }

    if (name !== undefined && name !== industry.name) {
      industry.name = name;
      const baseSlug = makeSlug(name);
      industry.slug = await getUniqueSlug(Industry, baseSlug, industry._id);
    }

    if (description !== undefined) industry.description = description;
    if (isActive !== undefined) industry.isActive = isActive;

    if (order !== undefined) industry.order = Number(order);

    await industry.save();

    res.json({ success: true, data: industry });

};

export const deleteIndustry = async (req, res) => {
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
 
};