"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import { createIndustry } from "@/services/industryservices";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddIndustryPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const onSubmit = async (
    data: FormData
  ) => {
    try {
      setLoading(true);
      setServerError("");

      const formData = new FormData();

      formData.append(
        "name",
        data.name
      );

      formData.append(
        "description",
        data.description ?? ""
      );

      if (imageFile) {
        formData.append(
          "coverImage",
          imageFile
        );
      }

      await createIndustry(
        formData
      );

      toast.success(
        "Industry added successfully"
      );

      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data
          ?.message ||
        "Something went wrong";

      setServerError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">

        {/* Back */}

        <button
          onClick={() =>
            router.back()
          }
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Add industry
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details
            below
          </p>
        </div>

        {/* Form */}

        <div className="rounded-xl border border-border bg-card p-8">
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >

            {/* Cover Image */}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Cover image
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-border">

                  <img
                    src={
                      imagePreview
                    }
                    alt="preview"
                    className="max-h-80 w-full object-cover"
                  />

                  <div className="absolute right-2 top-2 flex items-center gap-1.5">

                    <button
                      type="button"
                      onClick={() =>
                        fileRef.current?.click()
                      }
                      className="rounded-md border border-border bg-background/90 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                    >
                      <X
                        size={12}
                        className="text-muted-foreground"
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <ImagePlus size={15} />
                  Upload cover image
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            {/* Name */}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Name{" "}
                <span className="text-destructive">
                  *
                </span>
              </label>

              <input
                {...register(
                  "name"
                )}
                placeholder="e.g. Restaurants"
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {errors.name && (
                <p className="text-xs text-destructive">
                  {
                    errors.name
                      .message
                  }
                </p>
              )}
            </div>

            {/* Description */}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>

              <textarea
                {...register(
                  "description"
                )}
                rows={4}
                placeholder="e.g. Restaurants, cafés, food brands and dining businesses"
                className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Error */}

            {serverError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {serverError}
              </p>
            )}

            {/* Actions */}

            <div className="flex items-center gap-3 pt-1">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-foreground py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Adding..."
                  : "Add industry"}
              </button>

              <Link
                href="/"
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
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