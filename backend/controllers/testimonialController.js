import Testimonial from "../models/testimonialModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";

export const createTestimonial = async (req, res) => {
    const { name, role, text, isFeatured, rating } = req.body;

    const imageData = req.file ? await uploadToS3(req.file, "testimonials") : {};

    const testimonial = await Testimonial.create({
      name,
      role,
      text,
      isFeatured,
      rating: rating ? Number(rating) : undefined,
      image: imageData,
    });

    res.status(201).json({ success: true, data: testimonial });
 
};

export const getTestimonials = async (req, res) => {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search , isFeatured } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
            { text: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (isFeatured) {
      query.isFeatured = isFeatured === "true";
    }

    const [testimonials, totalDocs] = await Promise.all([
      Testimonial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({ success: true, data: testimonials, pagination });
 
};

export const getFeaturedTestimonials = async (req, res) => {
   
    const { page, limit, skip } = getPaginationParams(req.query);

    const query = { isFeatured: true };

    const [testimonials, totalDocs] = await Promise.all([
      Testimonial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({ success: true, data: testimonials, pagination });
 
};

export const getTestimonialById = async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.json({ success: true, data: testimonial });
 
};

export const getTestimonialStats = async (req, res) => {
    const [aggregation, total, featured] = await Promise.all([
      Testimonial.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalRatings: {
              $sum: { $cond: [{ $ifNull: ["$rating", false] }, 1, 0] },
            },
            r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          },
        },
      ]),
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ isFeatured: true }),
    ]);

    const stats = aggregation[0] ?? {
      avgRating: 0,
      totalRatings: 0,
      r5: 0, r4: 0, r3: 0, r2: 0, r1: 0,
    };

    res.json({
      success: true,
      data: {
        total,
        featured,
        avgRating: stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : 0,
        totalRatings: stats.totalRatings,
        breakdown: {
          5: stats.r5,
          4: stats.r4,
          3: stats.r3,
          2: stats.r2,
          1: stats.r1,
        },
      },
    });
 
};

export const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { name, role, text, isFeatured, rating } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (req.file) {
      if (testimonial.image?.key) await deleteFromS3(testimonial.image.key);
      testimonial.image = await uploadToS3(req.file, "testimonials");
    }

    if (name !== undefined) testimonial.name = name;
    if (role !== undefined) testimonial.role = role;
    if (text !== undefined) testimonial.text = text;
    if (isFeatured !== undefined) testimonial.isFeatured = isFeatured;
    if (rating !== undefined) testimonial.rating = Number(rating);

    await testimonial.save();

    res.json({ success: true, data: testimonial });
 
};

export const deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (testimonial.image?.key) await deleteFromS3(testimonial.image.key);

    await testimonial.deleteOne();

    res.json({ success: true, message: "Deleted successfully" });
 
};

export const createBulkTestimonials = async (req, res) => {
   
    const { testimonials } = req.body;

    const createdTestimonials = await Testimonial.insertMany(testimonials);

    res.status(201).json({ success: true, data: createdTestimonials });
  
};