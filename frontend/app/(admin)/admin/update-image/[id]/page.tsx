"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, Upload, X } from "lucide-react";
import Link from "next/link";
import { getImageById, updateImage } from "@/services/imageservices";
import { getActiveClients, type Client } from "@/services/clientServices";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function UpdateImagePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  // existing = saved on server, new = just picked by user, removed = user deleted existing
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [removedImage, setRemovedImage] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    Promise.all([getImageById(id), getActiveClients()])
      .then(([imageRes, clientsRes]) => {
        const img = imageRes.data;
        reset({
          title: img.title,
          client: img.client?._id ?? "",
          order: img.order,
          isActive: img.isActive,
        });
        if (img.image?.url) {
          setExistingImageUrl(img.image.url);
          setImagePreview(img.image.url);
        }
        setClients(clientsRes.data ?? []);
      })
      .catch(() => toast.error("Failed to load image"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemovedImage(false);
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreview("");
    setExistingImageUrl("");
    setRemovedImage(true);
    if (imageRef.current) imageRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setServerError("");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("order", String(data.order));
      formData.append("isActive", String(data.isActive));
      if (data.client) formData.append("client", data.client);
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (removedImage) {
        formData.append("removeImage", "true");
      }
      await updateImage(id, formData);
      toast.success("Poster updated successfully");
      router.back();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-xl mx-auto space-y-4 animate-pulse">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-9 w-40 rounded bg-muted" />
          <div className="h-[400px] rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Update poster</h1>
          <p className="text-muted-foreground text-sm mt-1">Edit the details below</p>
        </div>

        <div className="border border-border rounded-lg p-8 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── Image ── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Image</label>

              {imagePreview ? (
                <div className="relative w-full rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full max-h-80 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => imageRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-background/90 border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Upload size={10} />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeImagePreview}
                      className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <X size={12} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ImagePlus size={15} />
                  Upload image
                </button>
              )}

              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* ── Title ── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Summer Sale Poster"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* ── Client ── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Client</label>
              <select
                {...register("client")}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">— No client —</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Order ── */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Display order</label>
              <input
                {...register("order")}
                type="number"
                min={0}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Lower number = shown first within the same client
              </p>
            </div>
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
                href="/posters"
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