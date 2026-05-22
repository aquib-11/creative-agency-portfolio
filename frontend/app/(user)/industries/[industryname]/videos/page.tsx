"use client";

import React, { use, useEffect, useState } from "react";

import Link from "next/link";
import NextImage from "next/image";

import {
  Play,
  X,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Twitter,
  Music2,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Pagination as PaginationComponent } from "@/components/shared/Pagination";

import {
  deleteVideo,
  type Video,
  type Platform,
  getVideosByIndustrySlug,
} from "@/services/videoservices";

import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Platform Config
// ─────────────────────────────────────────────

type PlatformConfig = {
  icon: React.ReactNode;
  label: string;
  badge: string;
};

const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  instagram: {
    icon: <Instagram size={12} strokeWidth={2} />,
    label: "Instagram",
    badge:
      "bg-gradient-to-r from-purple-500/20 via-red-500/20 to-yellow-500/20 text-purple-300 border-purple-400/20",
  },
  youtube: {
    icon: <Youtube size={12} strokeWidth={2} />,
    label: "YouTube",
    badge: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  tiktok: {
    icon: <Music2 size={12} strokeWidth={2} />,
    label: "TikTok",
    badge: "bg-foreground/10 text-foreground border-border",
  },
  facebook: {
    icon: <Facebook size={12} strokeWidth={2} />,
    label: "Facebook",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  twitter: {
    icon: <Twitter size={12} strokeWidth={2} />,
    label: "Twitter",
    badge: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  linkedin: {
    icon: <Linkedin size={12} strokeWidth={2} />,
    label: "LinkedIn",
    badge: "bg-blue-700/10 text-blue-700 border-blue-700/20",
  },
  other: {
    icon: <LinkIcon size={12} strokeWidth={2} />,
    label: "",
    badge: "bg-muted text-muted-foreground border-border",
  },
};

// ─────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────

function Lightbox({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const src = video.video?.url;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <X size={14} className="text-white" />
          </button>

          {video?.sourceUrl && (
            <Link
              href={video.sourceUrl}
              target="_blank"
              className="flex items-center gap-1 text-sm text-white"
            >
              <LinkIcon size={14} />
              Watch on {video.platform}
            </Link>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {src ? (
            <video
              src={src}
              controls
              autoPlay
              playsInline
              className="max-h-[75vh] w-full object-contain"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-white/60">
              No video available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Video Card
// ─────────────────────────────────────────────

function VideoCard({
  video,
  onPlay,
  isAdmin,
  onDeleteClick,
}: {
  video: Video;
  onPlay: (video: Video) => void;
  isAdmin: boolean;
  onDeleteClick: (video: Video) => void;
}) {
  const config = PLATFORM_CONFIG[video.platform];
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative mb-4 break-inside-avoid">

      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100">
          <Link
            href={`/admin/update-video/${video._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background/90"
          >
            <Pencil size={13} />
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(video);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background/90"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      <div
        onClick={() => onPlay(video)}
        className="relative cursor-pointer overflow-hidden rounded-2xl border bg-muted"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {video.thumbnail?.url ? (
          <NextImage
            src={video.thumbnail.url}
            alt="video"
            width={0}
            height={0}
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            className={`w-full object-cover transition-opacity ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center">
            <Play />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Play className="text-white" />
        </div>

        {config.label && (
          <div className="absolute top-3 left-3">
            <span className={`rounded-full px-2 py-1 text-xs ${config.badge}`}>
              {config.icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function VideosPage({
  params,
}: {
  params: Promise<{ industryname: string }>;
}) {
  const { industryname } = use(params);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const [page, setPage] = useState(1);
  const LIMIT = 40;

  const [pagination, setPagination] = useState<any>(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await getVideosByIndustrySlug(
          industryname,
          page,
          LIMIT
        );

        if (!res.data) {
          setMissing(true);
          return;
        }

        setVideos(res.data);
        setPagination(res.pagination);
      } catch {
        setMissing(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [industryname, page]);

  // ─────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);

      await deleteVideo(deleteTarget._id);

      setVideos((prev) =>
        prev.filter((v) => v._id !== deleteTarget._id)
      );

      toast.success("Video deleted successfully");

      setDeleteModal(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─────────────────────────────────────────────

  if (missing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Industry not found</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────

  return (
    <>
      {activeVideo && (
        <Lightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold capitalize">
            {industryname.replace(/-/g, " ")}
          </h1>

          {isAdmin && (
            <Link
              href="/admin/add-videos"
              className="flex items-center gap-1 rounded-lg border px-4 py-2"
            >
              <Plus size={15} />
              Add Video
            </Link>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p>No videos found</p>
        ) : (
          <>
            <div className="columns-2 lg:columns-3 gap-4">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onPlay={setActiveVideo}
                  isAdmin={isAdmin}
                  onDeleteClick={(v) => {
                    setDeleteTarget(v);
                    setDeleteModal(true);
                  }}
                />
              ))}
            </div>

            {/* Pagination (REUSABLE COMPONENT) */}
            {pagination?.totalPages > 1 && (
              <PaginationComponent
                currentPage={page}
                totalPages={pagination.totalPages}
                totalDocs={pagination.total}
                limit={LIMIT}
                hasNextPage={page < pagination.totalPages}
                hasPrevPage={page > 1}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal}
        title="Delete video?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModal(false);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}