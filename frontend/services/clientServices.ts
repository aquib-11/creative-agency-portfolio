import { customFetch } from "@/utils/customFetch";
import { Pagination } from "./testimonialservices";

export interface Client {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: { url?: string; key?: string };
  industry?: { _id: string; name: string; slug: string } | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ─── GET ACTIVE (homepage) ────────────────────────────────────────────────────
export const getActiveClients = async () => {
  const { data } = await customFetch.get("/clients/active");
  return data as { success: boolean; data: Client[] };
};

// ─── GET ALL (admin, paginated + search) ──────────────────────────────────────
export const getAllClients = async (page = 1, limit = 12, search = "") => {
  const { data } = await customFetch.get("/clients", {
    params: { page, limit, ...(search ? { search } : {}) },
  });
  return data as { success: boolean; data: Client[]; pagination: Pagination };
};

// ─── GET BY INDUSTRY ──────────────────────────────────────────────────────────
export const getClientsByIndustry = async (industryId: string) => {
  const { data } = await customFetch.get(`/clients/industry/${industryId}`);
  return data as { success: boolean; data: Client[] };
};

// ─── GET ONE BY ID ────────────────────────────────────────────────────────────
export const getClientById = async (id: string) => {
  const { data } = await customFetch.get(`/clients/${id}`);
  return data as { success: boolean; data: Client };
};

// ─── GET ONE BY SLUG ──────────────────────────────────────────────────────────
export const getClientBySlug = async (slug: string) => {
  const { data } = await customFetch.get(`/clients/slug/${slug}`);
  return data as { success: boolean; data: Client };
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createClient = async (formData: FormData) => {
  const { data } = await customFetch.post("/clients", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateClient = async (id: string, formData: FormData) => {
  const { data } = await customFetch.put(`/clients/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteClient = async (id: string) => {
  const { data } = await customFetch.delete(`/clients/${id}`);
  return data;
};