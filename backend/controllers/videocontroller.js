
import Video from "../models/videomodel.js";
import Industry from "../models/industrymodel.js";

import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";

import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";

const POPULATE_INDUSTRY = {
  path: "industry",
  select: "name slug",
};


export const createVideo = async (req, res) => {
  const { platform, sourceUrl, industry } = req.body;

  if (!platform) {
    return res.status(400).json({
      success: false,
      message: "Platform is required",
    });
  }

  if (!req.files?.thumbnail?.[0]) {
    return res.status(400).json({
      success: false,
      message: "Thumbnail is required",
    });
  }

  if (!req.files?.video?.[0]) {
    return res.status(400).json({
      success: false,
      message: "Video is required",
    });
  }

  const thumbnail = await uploadToS3(
    req.files.thumbnail[0],
    "videos/thumbnails",
  );

  const video = await uploadToS3(req.files.video[0], "videos/files");

  const doc = await Video.create({
    thumbnail,
    video,
    platform,
    sourceUrl: sourceUrl || "",
    industry: industry || null,
  });

  res.status(201).json({
    success: true,
    data: doc,
  });
};



export const getVideos = async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const { platform, industry } = req.query;

  const query = {};

  if (platform) {
    query.platform = platform;
  }

  if (industry) {
    query.industry = industry;
  }

  const [videos, totalDocs] = await Promise.all([
    Video.find(query)
      .populate(POPULATE_INDUSTRY)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Video.countDocuments(query),
  ]);

  const pagination = getPaginationInfo(totalDocs, page, limit);

  res.json({
    success: true,
    data: videos,
    pagination,
  });
};


export const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.id).populate(POPULATE_INDUSTRY);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  res.json({
    success: true,
    data: video,
  });
};



export const getVideosByIndustry = async (req, res) => {
  const videos = await Video.find({
    industry: req.params.industryId,
  })
    .populate(POPULATE_INDUSTRY)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: videos,
  });
};



export const getVideosByIndustrySlug = async (req, res) => {
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

    const [videos, totalDocs] = await Promise.all([
      Video.find(query)
        .populate(POPULATE_INDUSTRY)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Video.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({
      success: true,
      data: videos,
      pagination,
      industry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getVideosByPlatform = async (req, res) => {
  const videos = await Video.find({
    platform: req.params.platform,
  })
    .populate(POPULATE_INDUSTRY)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: videos,
  });
};



export const updateVideo = async (req, res) => {
  const { platform, sourceUrl, industry } = req.body;

  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  if (req.files?.thumbnail?.[0]) {
    if (video.thumbnail?.key) {
      await deleteFromS3(video.thumbnail.key);
    }

    video.thumbnail = await uploadToS3(
      req.files.thumbnail[0],
      "videos/thumbnails",
    );
  }

  if (req.files?.video?.[0]) {
    if (video.video?.key) {
      await deleteFromS3(video.video.key);
    }

    video.video = await uploadToS3(req.files.video[0], "videos/files");
  }

  if (platform !== undefined) {
    video.platform = platform;
  }

  if (sourceUrl !== undefined) {
    video.sourceUrl = sourceUrl;
  }

  if (industry !== undefined) {
    video.industry = industry || null;
  }

  await video.save();

  res.json({
    success: true,
    data: video,
  });
};


export const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  if (video.thumbnail?.key) {
    await deleteFromS3(video.thumbnail.key);
  }

  if (video.video?.key) {
    await deleteFromS3(video.video.key);
  }

  await video.deleteOne();

  res.json({
    success: true,
    message: "Video deleted successfully",
  });
};
