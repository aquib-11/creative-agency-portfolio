"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { getClientById, updateClient } from "@/services/clientServices";
import { getAllIndustries, type Industry } from "@/services/industryservices";
import toast from "react-hot-toast";


const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  industry: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { order: 0, isActive: true },
  });

  useEffect(() => {
    getAllIndustries()
      .then((res) => setIndustries(res.data ?? []))
      .catch(() => setIndustries([]));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getClientById(id);
        if (!res.data) { setNotFound(true); return; }
        const c = res.data;
        reset({
          name: c.name,
          description: c.description ?? "",
          // industry is populated object or null — we only want the _id string for the select
          industry: c.industry?._id ?? "",
          order: c.order ?? 0,
          isActive: c.isActive ?? true,
        });
        if (c.coverImage?.url) setImagePreview(c.coverImage.url);
      } catch {
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setServerError("");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description ?? "");
      formData.append("order", String(data.order));
      formData.append("isActive", String(data.isActive));
      // Send empty string to clear industry, or the selected id
      formData.append("industry", data.industry ?? "");
      if (imageFile) formData.append("coverImage", imageFile);
      await updateClient(id, formData);
      toast.success("Client updated successfully");
      router.push("/clients");
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Something went wrong");
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
        <p className="text-foreground font-medium">Client not found</p>
        <Link
          href="/clients"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to clients
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit client</h1>
          <p className="text-muted-foreground text-sm mt-1">Update the details below</p>
        </div>

        <div className="border border-border rounded-lg p-8 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Cover image */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Cover image</label>
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={12} className="text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ImagePlus size={15} />
                  Upload cover image
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Tesla"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <input
                {...register("description")}
                placeholder="e.g. EV brand redefining sustainable mobility"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Industry</label>
              <select
                {...register("industry")}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">— No industry —</option>
                {industries.map((ind) => (
                  <option key={ind._id} value={ind._id}>
                    {ind.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Changing industry will reorder this client within the new group
              </p>
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Display order</label>
              <input
                {...register("order")}
                type="number"
                min={0}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">Lower number = shown first within the same industry</p>
            </div>

            {/* isActive */}
            {/* <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                {...register("isActive")}
                type="checkbox"
                className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
              />
              <span className="text-sm text-foreground">Active (visible on site)</span>
            </label> */}

            {serverError && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {serverError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-foreground text-background rounded-md text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
              <Link
                href="/clients"
                className="px-5 py-2.5 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}