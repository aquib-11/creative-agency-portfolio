"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getActiveIndustries, deleteIndustry, type Industry } from "@/services/industryservices";
import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import toast from "react-hot-toast";



const Industries = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getActiveIndustries()
      .then((res) => setIndustries(res.data ?? []))
      .catch(() => setIndustries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteIndustry(deleteTarget._id);
      setIndustries((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      setDeleteModal(false);
      setDeleteTarget(null);
      toast.success("Industry deleted successfully");
    } catch(err: any) {
      setDeleteModal(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <section className="py-16 md:py-20 px-6 sm:px-8 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3 md:mb-4">
            {industries.length > 0 && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-wide font-bold">
                <span className="text-yellow-dark">Industries</span> We Serve
              </h2>
            )}
            {isAdmin && (
              <Link
                href="/admin/add-industry"
                className="flex items-center gap-1.5 shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                <Plus size={15} />
                Add Industry
              </Link>
            )}
          </div>

          {industries.length > 0 && (
            <p className="text-muted-foreground text-base md:text-lg mb-12 md:mb-16 max-w-2xl">
              We create impactful campaigns across diverse industries
            </p>
          )}

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && industries.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {industries.map((industry) => (
                <div key={industry._id} className="group relative">
                  {/* Admin actions */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/update-industry/${industry._id}`}
                        className="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-muted transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil size={12} className="text-muted-foreground" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(industry);
                          setDeleteModal(true);
                        }}
                        className="flex items-center justify-center w-7 h-7 rounded-md border border-border bg-background hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                      >
                        <Trash2 size={12} className="text-muted-foreground" />
                      </button>
                    </div>
                  )}

                  <Link
                    href={`/industries/${industry.slug}/videos`}
                    className="block cursor-pointer overflow-hidden transition-all"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-lg border border-border mb-4 aspect-square bg-muted">
                      {industry.coverImage?.url ? (
                        <img
                          src={industry.coverImage.url}
                          alt={industry.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                          {industry.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                        {industry.name}
                      </h3>
                      {industry.description && (
                        <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                          {industry.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {!loading && industries.length === 0 && (
            <p className="text-muted-foreground text-sm">No industries found.</p>
          )}
        </div>
      </section>

      <ConfirmModal
        open={deleteModal}
        title="Delete industry?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
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
};

export default Industries;