import Image from "../models/imagemodel.js";
import Industry from "../models/industrymodel.js";

import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";

const POPULATE_INDUSTRY = {
  path: "industry",
  select: "name slug",
};

// Create Image
export const createImage = async (req, res) => {
  try {
    const { industry } = req.body;

    // Single image
    if (req.file) {
      const uploadedImage = await uploadToS3(req.file, "images/files");

      const image = await Image.create({
        image: uploadedImage,
        industry: industry || null,
      });

      return res.status(201).json({
        success: true,
        data: image,
      });
    }

    // Multiple images
    if (req.files?.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadedImage = await uploadToS3(file, "images/files");

          return {
            image: uploadedImage,
            industry: industry || null,
          };
        }),
      );

      const images = await Image.insertMany(uploadedImages);

      return res.status(201).json({
        success: true,
        data: images,
      });
    }

    res.status(400).json({
      success: false,
      message: "Image is required",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Images
export const getImages = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { industry } = req.query;

    const query = industry ? { industry } : {};

    const [images, totalDocs] = await Promise.all([
      Image.find(query)
        .populate(POPULATE_INDUSTRY)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Image.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({
      success: true,
      data: images,
      pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Image By ID
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate(
      POPULATE_INDUSTRY,
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Images By Industry ID
export const getImagesByIndustry = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const query = {
      industry: req.params.industryId,
    };

    const [images, totalDocs] = await Promise.all([
      Image.find(query)
        .populate(POPULATE_INDUSTRY)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Image.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({
      success: true,
      data: images,
      pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Images By Industry Slug
export const getImagesByIndustrySlug = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const industry = await Industry.findOne({
      slug: req.params.slug,
    })
      .select("_id name slug")
      .lean();

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry not found",
      });
    }

    const query = {
      industry: industry._id,
    };

    const [images, totalDocs] = await Promise.all([
      Image.find(query)
        .populate(POPULATE_INDUSTRY)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Image.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({
      success: true,
      data: images,
      industry,
      pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Image
export const updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Upload new image
    if (req.file) {
      if (image.image?.key) {
        await deleteFromS3(image.image.key);
      }

      image.image = await uploadToS3(req.file, "images/files");
    }

    // Remove existing image
    if (!req.file && req.body.removeImage === "true") {
      if (image.image?.key) {
        await deleteFromS3(image.image.key);
      }

      image.image = {};
    }

    // Update industry
    if (req.body.industry !== undefined) {
      image.industry = req.body.industry || null;
    }

    await image.save();

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Image
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.image?.key) {
      await deleteFromS3(image.image.key);
    }

    await image.deleteOne();

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
