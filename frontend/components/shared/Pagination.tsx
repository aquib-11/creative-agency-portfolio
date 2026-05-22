"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (
  current: number,
  total: number
): (number | "...")[] => {
  // Small pages
  if (total <= 5) {
    return Array.from(
      { length: total },
      (_, i) => i + 1
    );
  }

  // Beginning
  if (current <= 2) {
    return [1, 2, 3, "...", total];
  }

  // Ending
  if (current >= total - 1) {
    return [
      1,
      "...",
      total - 2,
      total - 1,
      total,
    ];
  }

  // Middle
  return [
    1,
    "...",
    current,
    "...",
    total,
  ];
};

export function Pagination({
  currentPage: rawPage,
  totalPages: rawTotalPages,
  totalDocs: rawTotalDocs,
  limit: rawLimit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  // Guard against NaN/undefined from API shape mismatches
  const page = Number(rawPage) || 1;
  const totalPages = Number(rawTotalPages) || 1;

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  const btnBase =
    "flex items-center justify-center h-8 min-w-[2rem] px-1 rounded-md border text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  const btnDefault = `${btnBase} border-border text-muted-foreground hover:bg-muted hover:text-foreground`;
  const btnActive = `${btnBase} border-foreground bg-foreground text-background font-medium cursor-default`;
  const btnIcon = `${btnBase} border-border text-muted-foreground hover:bg-muted hover:text-foreground w-8`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 select-none">

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className={btnIcon}
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={btnIcon}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex items-center justify-center w-8 h-8 text-sm text-muted-foreground"
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={p === page ? btnActive : btnDefault}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={btnIcon}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className={btnIcon}
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>

   
    </div>
  );
}