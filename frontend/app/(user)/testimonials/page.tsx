"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, Star, X } from "lucide-react";
import {
  getAllTestimonials,
  getTestimonialStats,
  deleteTestimonial,
  type Testimonial,
  type TestimonialStats,
  type Pagination,
} from "@/services/testimonialservices";
import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Pagination as PaginationComponent } from "@/components/shared/Pagination";

import toast from "react-hot-toast";

// ─── Star rating display ──────────────────────────────────────────────────────
const StarRow = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center  gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= rating
            ? " text-yellow-dark"
            : " text-yellow-dark"
        }
      />
    ))}
  </div>
);

// ─── Rating bar ───────────────────────────────────────────────────────────────
const RatingBar = ({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-2">{star}</span>
      <Star size={11} className="fill-muted-foreground text-muted-foreground shrink-0" />
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
};

// ─── Stats panel ─────────────────────────────────────────────────────────────
const StatsPanel = ({ stats }: { stats: TestimonialStats }) => (
  <div className="border border-border rounded-lg p-6 bg-card mb-8 flex flex-col sm:flex-row gap-6 sm:gap-10">
    {/* Big number */}
    <div className="flex flex-col items-center justify-center shrink-0 text-center sm:pr-8 sm:border-r sm:border-border">
      <span className="text-5xl font-bold text-foreground leading-none">
        {stats.avgRating.toFixed(1)}
      </span>
      <StarRow rating={Math.round(stats.avgRating)} size={16} />
      <span className="text-xs text-muted-foreground mt-1">
        {stats.totalRatings.toLocaleString()} ratings
      </span>
    </div>

    {/* Breakdown bars */}
    <div className="flex-1 space-y-2 justify-center flex flex-col">
      {[5, 4, 3, 2, 1].map((s) => (
        <RatingBar
          key={s}
          star={s}
          count={stats.breakdown[s] ?? 0}
          total={stats.totalRatings}
        />
      ))}
    </div>

    {/* Summary counts */}
    <div className="flex sm:flex-col gap-6 sm:gap-2 shrink-0 sm:pl-8 sm:border-l sm:border-border sm:justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{stats.featured}</p>
        <p className="text-xs text-muted-foreground">Featured</p>
      </div>
    </div>
  </div>
);

// ─── Testimonial card ─────────────────────────────────────────────────────────
const TestimonialCard = ({
  testimonial,
  isAdmin,
  onDelete,
}: {
  testimonial: Testimonial;
  isAdmin: boolean;
  onDelete: (t: Testimonial) => void;
}) => (
  <div className="group relative p-5 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors space-y-3">
    {/* Admin actions */}
    {isAdmin && (
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/admin/update-testimonial/${testimonial._id}`}
          className="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-muted transition-colors"
        >
          <Pencil size={12} className="text-muted-foreground" />
        </Link>
        <button
          onClick={() => onDelete(testimonial)}
          className="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
        >
          <Trash2 size={12} className="text-muted-foreground" />
        </button>
      </div>
    )}

    {/* Rating */}
    {testimonial.rating && (
      <StarRow  rating={testimonial.rating} size={13} />
    )}

    {/* Text */}
    {testimonial.text && (
      <p className="text-sm text-foreground leading-relaxed line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
    )}

    {/* Author */}
    <div className="flex items-center gap-3 pt-2 border-t border-border">
      {testimonial.image?.url ? (
        <img
          src={testimonial.image.url}
          alt={testimonial.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-semibold text-muted-foreground">
          {testimonial.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {testimonial.name}
        </p>
        {testimonial.role && (
          <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
        )}
      </div>
      {testimonial.isFeatured && (
        <span className="ml-auto shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
          Featured
        </span>
      )}
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AllTestimonialsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
  const LIMIT = 25;
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>(undefined);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  // delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch stats once
  useEffect(() => {
    getTestimonialStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllTestimonials(page, LIMIT, debouncedSearch, isFeatured);
      setTestimonials(res.data);
      setPagination(res.pagination);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, isFeatured]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDeleteClick = (t: Testimonial) => {
    setDeleteTarget(t);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteTestimonial(deleteTarget._id);
      setTestimonials((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      if (stats) {
        setStats((s) =>
          s ? { ...s, total: s.total - 1, featured: deleteTarget.isFeatured ? s.featured - 1 : s.featured } : s
        );
      }
      setDeleteModal(false);
      setDeleteTarget(null);
      toast.success("Testimonial deleted successfully");
    } catch {
      setDeleteModal(false);
      toast.error("Failed to delete testimonial");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              <span className="text-yellow-dark">Testimonials</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              What our clients say about us
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/admin/add-testimonial"
              className="flex items-center gap-1.5 shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Plus size={15} />
              Add
            </Link>
          )}
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="border border-border rounded-lg p-6 bg-card mb-8 h-28 animate-pulse" />
        ) : stats && stats.totalRatings > 0 ? (
          <StatsPanel stats={stats} />
        ) : null}
{ isAdmin && (  
      <div className="flex gap-2 mb-6">
  {/* Search input */}
  <div className="relative flex-1">
    <Search
      size={15}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by name, role or content..."
      className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
    />
    {search && (
      <button
        onClick={() => setSearch("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X size={14} />
      </button>
    )}
  </div>

  {/* Featured filter */}
<select
  value={
    isFeatured === undefined
      ? "all"
      : isFeatured
      ? "true"
      : "false"
  }
  onChange={(e) => {
    const value = e.target.value;

    if (value === "all") setIsFeatured(undefined);
    else if (value === "true") setIsFeatured(true);
    else setIsFeatured(false);
  }}
  className="px-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
>
  <option value="all">All</option>
  <option value="true">Featured</option>
  <option value="false">Not Featured</option>
</select>
</div>)
}
        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <p className="text-foreground font-medium">No testimonials found</p>
            {search && (
              <p className="text-sm text-muted-foreground">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <TestimonialCard
                key={t._id}
                testimonial={t}
                isAdmin={isAdmin}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <PaginationComponent
            currentPage={page}
            totalPages={pagination.totalPages}
            totalDocs={pagination.totalDocs}
            limit={LIMIT}
            hasNextPage={page < pagination.totalPages}
            hasPrevPage={page > 1}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmModal
        open={deleteModal}
        title="Delete testimonial?"
        description={`This will permanently remove ${deleteTarget?.name}'s testimonial.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModal(false);
          setDeleteTarget(null);
        }}
      />
    </main>
  );
}