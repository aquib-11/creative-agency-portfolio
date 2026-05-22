import { customFetch } from "@/utils/customFetch";
import { Pagination } from "./testimonialservices";

export interface Industry {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: { url?: string; key?: string };
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ─── GET ACTIVE (homepage) ────────────────────────────────────────────────────
export const getActiveIndustries = async () => {
  const { data } = await customFetch.get("/industries/active");
  return data as { success: boolean; data: Industry[] };
};

// ─── GET ALL (admin, paginated + search) ──────────────────────────────────────
export const getAllIndustries = async (page = 1, limit = 1, search = "") => {
  const { data } = await customFetch.get("/industries", {
    params: { page, limit, ...(search ? { search } : {}) },
  });
  return data as { success: boolean; data: Industry[]; pagination: Pagination };
};

// ─── GET ONE ──────────────────────────────────────────────────────────────────
export const getIndustryById = async (id: string) => {
  const { data } = await customFetch.get(`/industries/${id}`);
  return data as { success: boolean; data: Industry };
};

// ─── GET BY SLUG ──────────────────────────────────────────────────────────────
export const getIndustryBySlug = async (slug: string) => {
  const { data } = await customFetch.get(`/industries/slug/${slug}`);
  return data as { success: boolean; data: Industry };
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createIndustry = async (formData: FormData) => {
  const { data } = await customFetch.post("/industries", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateIndustry = async (id: string, formData: FormData) => {
  const { data } = await customFetch.put(`/industries/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteIndustry = async (id: string) => {
  const { data } = await customFetch.delete(`/industries/${id}`);
  return data;
};