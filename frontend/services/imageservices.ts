import { customFetch } from "@/utils/customFetch";
import { Pagination } from "./testimonialservices";

export interface Image {
  _id: string;

  image?: {
    url?: string;
    key?: string;
  };

  industry?: {
    _id: string;
    name: string;
    slug: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export const getActiveImages = async () => {
  const { data } = await customFetch.get("/images/active");

  return data as {
    success: boolean;
    data: Image[];
  };
};

export const getAllImages = async (page = 1, limit = 12) => {
  const { data } = await customFetch.get("/images", {
    params: {
      page,
      limit,
    },
  });

  return data as {
    success: boolean;
    data: Image[];
    pagination: Pagination;
  };
};

export const getImagesByIndustrySlug = async (
  slug: string,
  page = 1,
  limit = 12,
) => {
  const { data } = await customFetch.get(`/images/industry-slug/${slug}`, {
    params: {
      page,
      limit,
    },
  });

  return data as {
    success: boolean;
    data: Image[];
    pagination: Pagination;
  };
};

export const getImagesByIndustry = async (
  industryId: string,
  page = 1,
  limit = 12,
) => {
  const { data } = await customFetch.get(`/images/industry/${industryId}`, {
    params: {
      page,
      limit,
    },
  });

  return data as {
    success: boolean;
    data: Image[];
    pagination: Pagination;
  };
};

export const getImageById = async (id: string) => {
  const { data } = await customFetch.get(`/images/${id}`);

  return data as {
    success: boolean;
    data: Image;
  };
};

export const createImage = async (formData: FormData) => {
  const { data } = await customFetch.post("/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateImage = async (id: string, formData: FormData) => {
  const { data } = await customFetch.put(`/images/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteImage = async (id: string) => {
  const { data } = await customFetch.delete(`/images/${id}`);

  return data;
};
