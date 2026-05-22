"use client";

import { use, useEffect, useState } from "react";

import { notFound } from "next/navigation";

import Link from "next/link";

import NextImage from "next/image";

import {
  ExternalLink,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";

import { ConfirmModal } from "@/components/shared/ConfirmModal";

import { Pagination as PaginationComponent } from "@/components/shared/Pagination";

import {
  deleteImage,
  getImagesByIndustrySlug,
  type Image,
} from "@/services/imageservices";

import { Pagination } from "@/services/testimonialservices";

// ─────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────

function Lightbox({
  image,
  onClose,
}: {
  image: Image;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);

    return () =>
      window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="flex w-full max-w-4xl flex-col gap-3">

        {/* Top Bar */}

        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 transition-colors hover:bg-white/20"
          >
            <X
              size={15}
              className="text-white"
            />
          </button>
        </div>

        {/* Image */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {image.image?.url ? (
            <NextImage
              src={image.image.url}
              alt={
                image.industry?.name ||
                "Poster"
              }
              width={100}
              height={100}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="h-auto max-h-[85vh] w-full object-contain"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center">
              <ImageIcon
                size={34}
                className="text-white/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IMAGE CARD
// ─────────────────────────────────────────────────────────────

function ImageCard({
  image,
  onView,
  isAdmin,
  onDeleteClick,
}: {
  image: Image;
  onView: (img: Image) => void;
  isAdmin: boolean;
  onDeleteClick: (img: Image) => void;
}) {
  const [imageLoaded, setImageLoaded] =
    useState(false);

  return (
    <div className="group relative mb-4 break-inside-avoid">

      {/* Admin Actions */}

      {isAdmin && (
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

          <Link
            href={`/admin/update-image/${image._id}`}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/90 backdrop-blur transition-colors hover:bg-muted"
          >
            <Pencil
              size={13}
              className="text-muted-foreground"
            />
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();

              onDeleteClick(image);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/90 backdrop-blur transition-colors hover:border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2
              size={13}
              className="text-muted-foreground"
            />
          </button>
        </div>
      )}

      {/* Image */}

      <div
        onClick={() => onView(image)}
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-muted"
      >

        {/* Skeleton */}

        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {image.image?.url ? (
          <NextImage
            src={image.image.url}
            alt={
              image.industry?.name ||
              "Poster"
            }
            width={0}
            height={0}
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            onLoadingComplete={() =>
              setImageLoaded(true)
            }
            className={`block h-auto w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-muted">
            <ImageIcon
              size={24}
              className="text-muted-foreground"
            />
          </div>
        )}

        {/* Overlay */}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
          <ExternalLink
            size={20}
            className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white"
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────

function SkeletonCard({
  tall,
}: {
  tall?: boolean;
}) {
  return (
    <div
      className={`mb-4 break-inside-avoid animate-pulse rounded-2xl bg-muted ${
        tall
          ? "aspect-[3/4]"
          : "aspect-square"
      }`}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function PostersPage({
  params,
}: {
  params: Promise<{
    industryname: string;
  }>;
}) {
  const { industryname } = use(params);

  const { user } = useAuth();

  const isAdmin =
    user?.role === "admin";

  const [images, setImages] =
    useState<Image[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [missing, setMissing] =
    useState(false);

  const [
    activeImage,
    setActiveImage,
  ] = useState<Image | null>(null);

  const [
    deleteModal,
    setDeleteModal,
  ] = useState(false);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Image | null>(
    null
  );

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination | null>(
    null
  );

  const [page, setPage] =
    useState(1);

  const LIMIT = 40;

  // ─────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);

    getImagesByIndustrySlug(
      industryname,
      page,
      LIMIT
    )
      .then((res) => {
        if (!res.data) {
          setMissing(true);

          return;
        }

        setImages(res.data ?? []);

        setPagination(
          res.pagination
        );
      })
      .catch(() => {
        setMissing(true);
      })
      .finally(() =>
        setLoading(false)
      );
  }, [industryname, page]);

  // ─────────────────────────────────────────────

  const handleDeleteConfirm =
    async () => {
      if (!deleteTarget) return;

      try {
        setDeleteLoading(true);

        await deleteImage(
          deleteTarget._id
        );

        setImages((prev) =>
          prev.filter(
            (img) =>
              img._id !==
              deleteTarget._id
          )
        );

        toast.success(
          "Poster deleted successfully"
        );

        setDeleteModal(false);

        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(
          err?.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  // ─────────────────────────────────────────────

  if (missing) {
    return notFound();
  }

  // ─────────────────────────────────────────────

  return (
    <>
      {activeImage && (
        <Lightbox
          image={activeImage}
          onClose={() =>
            setActiveImage(null)
          }
        />
      )}

      <div className="space-y-8">

        {/* Header */}

        <div className="flex items-start justify-between gap-4">

          <div className="space-y-2">

            <h1 className="text-3xl font-bold capitalize tracking-tight">
              {industryname.replaceAll(
                "-",
                " "
              )}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Explore industry-related
              posters
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin/add-image"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Plus size={15} />
              Add Poster
            </Link>
          )}
        </div>

        {/* Skeleton */}

        {loading && (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <SkeletonCard
                key={i}
                tall={i % 2 === 0}
              />
            ))}
          </div>
        )}

        {/* Content */}

        {!loading && (
          <>
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ImageIcon
                    size={18}
                    className="text-muted-foreground"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  No posters yet
                </p>
              </div>
            ) : (
              <>
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">

                  {images.map(
                    (image) => (
                      <ImageCard
                        key={image._id}
                        image={image}
                        onView={
                          setActiveImage
                        }
                        isAdmin={
                          isAdmin
                        }
                        onDeleteClick={(
                          img
                        ) => {
                          setDeleteTarget(
                            img
                          );

                          setDeleteModal(
                            true
                          );
                        }}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}

                {pagination &&
                  pagination.totalPages >
                    1 && (
                    <PaginationComponent
                      currentPage={
                        page
                      }
                      totalPages={
                        pagination.totalPages
                      }
                      totalDocs={
                        pagination.totalDocs
                      }
                      limit={LIMIT}
                      hasNextPage={
                        page <
                        pagination.totalPages
                      }
                      hasPrevPage={
                        page > 1
                      }
                      onPageChange={(
                        newPage
                      ) => {
                        setPage(
                          newPage
                        );

                        window.scrollTo({
                          top: 0,
                          behavior:
                            "smooth",
                        });
                      }}
                    />
                  )}
              </>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}

      <ConfirmModal
        open={deleteModal}
        title="Delete poster?"
        description="This will permanently remove this poster."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
        onConfirm={
          handleDeleteConfirm
        }
        onCancel={() => {
          setDeleteModal(false);

          setDeleteTarget(null);
        }}
      />
    </>
  );
}