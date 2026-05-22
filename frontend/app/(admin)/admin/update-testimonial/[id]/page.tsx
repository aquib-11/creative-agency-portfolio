"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { getTestimonialById, updateTestimonial } from "@/services/testimonialservices";
import toast from "react-hot-toast";


const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  text: z.string().min(1, "Testimonial text is required"),
  isFeatured: z.boolean().default(false),
  rating: z.coerce.number().min(1).max(5).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    defaultValues: { isFeatured: false },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTestimonialById(id);
        const found = res.data;
        if (!found) {
          setNotFound(true);
          return;
        }
        reset({
          name: found.name,
          role: found.role ?? "",
          text: found.text ?? "",
          isFeatured: found.isFeatured ?? false,
          rating: found.rating ?? undefined,
        });
        if (found.image?.url) setImagePreview(found.image.url);
      } catch {
        setServerError("Failed to load testimonial.");
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
      formData.append("role", data.role ?? "");
      formData.append("text", data.text);
      formData.append("isFeatured", String(data.isFeatured));
      if (imageFile) formData.append("image", imageFile);
      if (data.rating) formData.append("rating", String(data.rating));
      await updateTestimonial(id, formData);
      toast.success("Testimonial updated successfully");
      router.push("/");
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
        <p className="text-foreground font-medium">Testimonial not found</p>
        <Link href="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to testimonials
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/testimonials"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit testimonial</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update the details below
          </p>
        </div>

        <div className="border border-border rounded-lg p-8 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Image upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Photo</label>
              {imagePreview ? (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-20 h-20 rounded-full object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={11} className="text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ImagePlus size={15} />
                  Upload photo
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
                placeholder="Sarah Anderson"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <input
                {...register("role")}
                placeholder="CEO, Luxury Resort"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Testimonial <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register("text")}
                rows={4}
                placeholder="What did they say about you..."
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
              />
              {errors.text && (
                <p className="text-xs text-destructive">{errors.text.message}</p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rating</label>
              <select
                {...register("rating")}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">No rating</option>
                <option value="5">★★★★★ — 5 stars</option>
                <option value="4">★★★★☆ — 4 stars</option>
                <option value="3">★★★☆☆ — 3 stars</option>
                <option value="2">★★☆☆☆ — 2 stars</option>
                <option value="1">★☆☆☆☆ — 1 star</option>
              </select>
            </div>

            {/* isFeatured */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                {...register("isFeatured")}
                type="checkbox"
                className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
              />
              <span className="text-sm text-foreground">Mark as featured</span>
            </label>

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
                href="/"
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