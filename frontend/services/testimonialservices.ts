import { customFetch } from "@/utils/customFetch";

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  text?: string;
  rating?: number;
  isFeatured: boolean;
  image?: { url?: string; key?: string };
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface TestimonialStats {
  total: number;
  featured: number;
  avgRating: number;
  totalRatings: number;
  breakdown: Record<string, number>;
}

// ─── GET ALL (paginated + search) ─────────────────────────────────────────────
export const getAllTestimonials = async (
  page = 1,
  limit = 10,
  search = "",
  isFeatured?: boolean
) => {
  const { data } = await customFetch.get("/testimonials", {
    params: { page, limit, ...(search ? { search } : {}), ...(isFeatured !== undefined ? { isFeatured: isFeatured.toString() } : {}) },
  });
  return data as { success: boolean; data: Testimonial[]; pagination: Pagination };
};

// ─── GET FEATURED ─────────────────────────────────────────────────────────────
export const getFeaturedTestimonials = async (page = 1, limit = 30) => {
  const { data } = await customFetch.get("/testimonials/featured", {
    params: { page, limit },
  });
  return data as { success: boolean; data: Testimonial[]; pagination: Pagination };
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
export const getTestimonialById = async (id: string) => {
  const { data } = await customFetch.get(`/testimonials/${id}`);
  return data as { success: boolean; data: Testimonial };
};

// ─── GET STATS ────────────────────────────────────────────────────────────────
export const getTestimonialStats = async () => {
  const { data } = await customFetch.get("/testimonials/stats");
  return data as { success: boolean; data: TestimonialStats };
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createTestimonial = async (formData: FormData) => {
  const { data } = await customFetch.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateTestimonial = async (id: string, formData: FormData) => {
  const { data } = await customFetch.put(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteTestimonial = async (id: string) => {
  const { data } = await customFetch.delete(`/testimonials/${id}`);
  return data;
};