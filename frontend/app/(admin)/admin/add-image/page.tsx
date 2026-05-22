"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { createImage } from "@/services/imageservices";
import {
  getActiveIndustries,
  type Industry,
} from "@/services/industryservices";
import toast from "react-hot-toast";

const schema = z.object({
  industry: z.string().min(1, "Industry is required"),
});

type FormData = z.infer<typeof schema>;

export default function AddImagePage() {
  const router = useRouter();

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [industries, setIndustries] =
    useState<Industry[]>([]);

  const [imageFiles, setImageFiles] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const imageRef =
    useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getActiveIndustries()
      .then((res) =>
        setIndustries(res.data ?? [])
      )
      .catch(() => setIndustries([]));
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [imagePreviews]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files ?? []
    );

    if (!files.length) return;

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImageFiles((prev) => [
      ...prev,
      ...files,
    ]);

    setImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(
      imagePreviews[index]
    );

    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      setLoading(true);

      setServerError("");

      if (imageFiles.length === 0) {
        toast.error(
          "Please upload at least one image"
        );

        return;
      }

      const formData = new FormData();

      formData.append(
        "industry",
        data.industry
      );

      imageFiles.forEach((image) => {
        formData.append("images", image);
      });

      await createImage(formData);

      toast.success(
        "Posters uploaded successfully"
      );

      router.back();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong";

      setServerError(msg);

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Add posters
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Upload one or multiple posters
          </p>
        </div>

        <div className="border border-border rounded-lg p-8 bg-card">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* ── Images ── */}

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Images
              </label>

              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map(
                    (preview, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-lg border border-border bg-muted aspect-square"
                      >
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <X
                            size={13}
                            className="text-muted-foreground"
                          />
                        </button>
                      </div>
                    )
                  )}

                  {/* Add more */}

                  <button
                    type="button"
                    onClick={() =>
                      imageRef.current?.click()
                    }
                    className="aspect-square rounded-lg border border-dashed border-border bg-background flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <Upload size={18} />
                    Add more
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    imageRef.current?.click()
                  }
                  className="flex items-center gap-2 px-4 py-3 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ImagePlus size={16} />
                  Upload images
                </button>
              )}

              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* ── Industry ── */}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Industry{" "}
                <span className="text-destructive">
                  *
                </span>
              </label>

              <select
                {...register("industry")}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">
                  — Select industry —
                </option>

                {industries.map((industry) => (
                  <option
                    key={industry._id}
                    value={industry._id}
                  >
                    {industry.name}
                  </option>
                ))}
              </select>

              {errors.industry && (
                <p className="text-xs text-destructive">
                  {
                    errors.industry
                      .message
                  }
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {serverError}
              </p>
            )}

            {/* ── Actions ── */}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-foreground text-background rounded-md text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Uploading..."
                  : "Upload posters"}
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