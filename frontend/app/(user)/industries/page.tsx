"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { ConfirmModal } from "@/components/shared/ConfirmModal";

import {
  getAllIndustries,
  deleteIndustry,
  type Industry,
} from "@/services/industryservices";

import toast from "react-hot-toast";

import { Pagination } from "@/services/testimonialservices";

import { Pagination as PaginationComponent } from "@/components/shared/Pagination";

export default function IndustriesPage() {
  const { user } = useAuth();

  const isAdmin =
    user?.role === "admin";

  const [
    industries,
    setIndustries,
  ] = useState<Industry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    deleteModal,
    setDeleteModal,
  ] = useState(false);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Industry | null>(
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

    getAllIndustries(
      page,
      LIMIT
    )
      .then((res) => {
        setIndustries(
          res.data ?? []
        );

        setPagination(
          res.pagination
        );
      })
      .catch(() => {
        setIndustries([]);
      })
      .finally(() =>
        setLoading(false)
      );
  }, [page]);

  // ─────────────────────────────────────────────

  const handleDeleteConfirm =
    async () => {
      if (!deleteTarget) return;

      try {
        setDeleteLoading(true);

        await deleteIndustry(
          deleteTarget._id
        );

        setIndustries((prev) =>
          prev.filter(
            (i) =>
              i._id !==
              deleteTarget._id
          )
        );

        toast.success(
          "Industry deleted successfully"
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

  return (
    <>
      <section className="bg-background px-6 py-16 sm:px-8 md:px-12 md:py-20">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="mb-10 flex items-start justify-between gap-4">

            <div>

              <h2 className="text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl">

                <span className="text-yellow-dark">
                  Industries
                </span>{" "}
                We Serve
              </h2>

              <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                Industries and sectors we
                create campaigns and
                digital experiences for
              </p>
            </div>

            {isAdmin && (
              <Link
                href="/admin/add-industry"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Plus size={15} />
                Add Industry
              </Link>
            )}
          </div>

          {/* Skeleton */}

          {loading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">

              {[...Array(5)].map(
                (_, i) => (
                  <div
                    key={i}
                    className="space-y-3"
                  >
                    <div className="aspect-square animate-pulse rounded-xl bg-muted" />

                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  </div>
                )
              )}
            </div>
          )}

          {/* Content */}

          {!loading && (
            <>
              {industries.length ===
              0 ? (
                <div className="py-24 text-center">

                  <p className="text-base text-muted-foreground">
                    No industries found
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">

                    <span className="font-semibold text-foreground">
                      {industries.length}
                    </span>{" "}
                    industr
                    {industries.length >
                    1
                      ? "ies"
                      : "y"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">

                    {industries.map(
                      (industry) => (
                        <div
                          key={
                            industry._id
                          }
                          className="group relative"
                        >

                          {/* Admin actions */}

                          {isAdmin && (
                            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">

                              <Link
                                href={`/admin/update-industry/${industry._id}`}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-muted"
                                onClick={(
                                  e
                                ) =>
                                  e.stopPropagation()
                                }
                              >
                                <Pencil
                                  size={
                                    12
                                  }
                                  className="text-muted-foreground"
                                />
                              </Link>

                              <button
                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();

                                  setDeleteTarget(
                                    industry
                                  );

                                  setDeleteModal(
                                    true
                                  );
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background transition-colors hover:border-destructive/30 hover:bg-destructive/10"
                              >
                                <Trash2
                                  size={
                                    12
                                  }
                                  className="text-muted-foreground"
                                />
                              </button>
                            </div>
                          )}

                          {/* Card */}

                          <Link
                            href={`/industries/${industry.slug}/videos`}
                            className="block overflow-hidden"
                          >

                            <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-border bg-muted">

                              {industry.coverImage
                                ?.url ? (
                                <img
                                  src={
                                    industry
                                      .coverImage
                                      .url
                                  }
                                  alt={
                                    industry.name
                                  }
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                                  {industry.name.charAt(
                                    0
                                  )}
                                </div>
                              )}
                            </div>

                            <div>

                              <h3 className="text-lg font-semibold tracking-wide transition-colors group-hover:text-primary md:text-xl">
                                {
                                  industry.name
                                }
                              </h3>

                              {industry.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                                  {
                                    industry.description
                                  }
                                </p>
                              )}
                            </div>
                          </Link>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Pagination */}

          {pagination &&
            pagination.totalPages >
              1 && (
              <PaginationComponent
                currentPage={page}
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
                onPageChange={
                  setPage
                }
              />
            )}
        </div>
      </section>

      {/* Delete modal */}

      <ConfirmModal
        open={deleteModal}
        title="Delete industry?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
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