// services/videoServices.ts

import { customFetch } from "@/utils/customFetch";
import { Pagination } from "./testimonialservices";
import { number } from "zod";

export type Platform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "other";

export interface MediaFile {
  url: string;
  key: string;
}

export interface Industry {
  _id: string;
  name: string;
  slug: string;
}

export interface Video {
  _id: string;

  thumbnail: MediaFile;

  video: MediaFile;

  platform: Platform;

  sourceUrl?: string;

  industry?: Industry | null;

  order: number;

  createdAt: string;

  updatedAt: string;
}


export const getAllVideos = async (
  page = 1,
  limit = 12,
  platform?: Platform
) => {
  const { data } = await customFetch.get("/videos", {
    params: {
      page,
      limit,
      ...(platform ? { platform } : {}),
    },
  });

  return data as {
    success: boolean;
    data: Video[];
    pagination: Pagination;
  };
};

export const getVideoById = async (id: string) => {
  const { data } = await customFetch.get(`/videos/${id}`);

  return data as {
    success: boolean;
    data: Video;
  };
};


export const getVideosByIndustry = async (
  industryId: string
) => {
  const { data } = await customFetch.get(
    `/videos/industry/${industryId}`
  );

  return data as {
    success: boolean;
    data: Video[];
  };
};

export const getVideosByIndustrySlug = async (
  slug: string,
  page = 1,
  limit = 30
) => {
  const { data } = await customFetch.get(
    `/videos/industry-slug/${slug}`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return data as {
    success: boolean;
    data: Video[];
    pagination: Pagination;
    industry: Industry;
  };
};


export const getVideosByPlatform = async (
  platform: Platform
) => {
  const { data } = await customFetch.get(
    `/videos/platform/${platform}`
  );

  return data as {
    success: boolean;
    data: Video[];
  };
};
 

export const createVideo = async (
  formData: FormData
) => {
  const { data } = await customFetch.post(
    "/videos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data as {
    success: boolean;
    data: Video;
  };
};


export const updateVideo = async (
  id: string,
  formData: FormData
) => {
  const { data } = await customFetch.put(
    `/videos/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data as {
    success: boolean;
    data: Video;
  };
};


export const deleteVideo = async (id: string) => {
  const { data } = await customFetch.delete(
    `/videos/${id}`
  );

  return data as {
    success: boolean;
    message: string;
  };
};