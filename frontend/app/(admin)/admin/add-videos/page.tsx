"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Camera, ImagePlus, Upload, X } from "lucide-react";
import Link from "next/link";
import { createVideo, type Platform } from "@/services/videoservices";
import { getActiveIndustries, type Industry } from "@/services/industryservices";
import { MAX_VIDEO_SIZE } from "@/utils/constants";
import toast from "react-hot-toast";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

const schema = z.object({
  platform: z.enum(
    [
      "instagram",
      "youtube",
      "facebook",
      "tiktok",
      "twitter",
      "linkedin",
      "other",
    ],
    {
      required_error: "Platform is required",
    }
  ),

  sourceUrl: z.string().optional(),

  industry: z.string().min(1, "Industry is required"),
});

type FormData = z.infer<typeof schema>;

export default function AddVideoPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [videoObjectUrl, setVideoObjectUrl] = useState("");

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getActiveIndustries()
      .then((res) => setIndustries(res.data ?? []))
      .catch(() => setIndustries([]));
  }, []);

  useEffect(() => {
    return () => {
      if (videoObjectUrl) {
        URL.revokeObjectURL(videoObjectUrl);
      }
    };
  }, [videoObjectUrl]);

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");

    if (thumbnailRef.current) {
      thumbnailRef.current.value = "";
    }
  };

const handleVideoChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.size > MAX_VIDEO_SIZE) {
    toast.error("Video size must be less than 100MB");

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    return;
  }

  if (videoObjectUrl) {
    URL.revokeObjectURL(videoObjectUrl);
  }

  const url = URL.createObjectURL(file);

  setVideoFile(file);
  setVideoName(file.name);
  setVideoObjectUrl(url);
};

  const removeVideo = () => {
    if (videoObjectUrl) {
      URL.revokeObjectURL(videoObjectUrl);
    }

    setVideoFile(null);
    setVideoName("");
    setVideoObjectUrl("");

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const captureFrame = () => {
    const video = videoPlayerRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], "thumbnail.jpg", {
          type: "image/jpeg",
        });

        setThumbnailFile(file);
        setThumbnailPreview(canvas.toDataURL("image/jpeg"));
      },
      "image/jpeg",
      0.92
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setServerError("");

      if (!videoFile) {
        toast.error("Video is required");
        return;
      }

      if (!thumbnailFile) {
        toast.error("Thumbnail is required");
        return;
      }

      const formData = new FormData();

      formData.append("platform", data.platform);

      formData.append(
        "sourceUrl",
        data.sourceUrl ?? ""
      );

      if (data.industry) {
        formData.append("industry", data.industry);
      }

      formData.append("thumbnail", thumbnailFile);

      formData.append("video", videoFile);

      await createVideo(formData);

      toast.success("Video created successfully");

      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong";

      setServerError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">
            Add video
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details below
          </p>
        </div>

        <div className="border border-border rounded-lg p-8 bg-card">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Video file
              </label>

              {videoObjectUrl ? (
                <div className="space-y-2">
                  <div className="relative w-full rounded-lg overflow-hidden border border-border bg-black">
                    <video
                      ref={videoPlayerRef}
                      src={videoObjectUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground truncate">
                      {videoName}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={captureFrame}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Camera size={12} />
                        Capture frame
                      </button>

                      <button
                        type="button"
                        onClick={removeVideo}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <X
                          size={12}
                          className="text-muted-foreground"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    videoInputRef.current?.click()
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Upload size={15} />
                  Upload video file
                </button>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />

              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Thumbnail
              </label>

              {thumbnailPreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                  <img
                    src={thumbnailPreview}
                    alt="thumbnail preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X
                      size={12}
                      className="text-muted-foreground"
                    />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    thumbnailRef.current?.click()
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ImagePlus size={15} />
                  Upload thumbnail
                </button>
              )}

              {videoObjectUrl && !thumbnailPreview && (
                <p className="text-xs text-muted-foreground">
                  Pause the video and capture any frame
                  as thumbnail
                </p>
              )}

              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Platform{" "}
                <span className="text-destructive">
                  *
                </span>
              </label>

              <select
                {...register("platform")}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                <option value="">
                  — Select platform —
                </option>

                {PLATFORMS.map((p) => (
                  <option
                    key={p.value}
                    value={p.value}
                  >
                    {p.label}
                  </option>
                ))}
              </select>

              {errors.platform && (
                <p className="text-xs text-destructive">
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Source URL
              </label>

              <input
                {...register("sourceUrl")}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>

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

  {industries.map((i) => (
    <option
      key={i._id}
      value={i._id}
    >
      {i.name}
    </option>
  ))}
</select>

{errors.industry && (
  <p className="text-xs text-destructive">
    {errors.industry.message}
  </p>
)}
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
                {loading
                  ? "Creating..."
                  : "Create video"}
              </button>

              <Link
                href="/videos"
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