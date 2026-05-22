"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { getFeaturedTestimonials, deleteTestimonial } from "@/services/testimonialservices";
import { useAuth } from "@/context/AuthContext";

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  text?: string;
  isFeatured: boolean;
  image?: { url?: string; key?: string };
}

const Testimonials = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);



  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getFeaturedTestimonials(1, 30);
        setTestimonials(res.data ?? []);
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Duplicate for seamless marquee
  const marqueeItems = [...testimonials, ...testimonials];

  if (testimonials.length === 0 && !isAdmin) return null;

  if (loading) {
    return (
      <section className="py-16 md:py-20 px-6 sm:px-8 md:px-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
          <div className="flex gap-4 overflow-hidden mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-52 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const animDuration = testimonials.length > 0 ? `${testimonials.length * 15}s` : "0s";

  return (
    <>
      <style>{`
        /* ── Horizontal marquee (tablet+) ── */
        @keyframes marquee-x {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track-x {
          display: flex;
          width: max-content;
          animation: marquee-x ${animDuration} linear infinite;
        }
        .marquee-track-x.paused {
          animation-play-state: paused;
        }

        /* ── Vertical marquee (mobile) ── */
        @keyframes marquee-y {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .marquee-track-y {
          display: flex;
          flex-direction: column;
          animation: marquee-y ${animDuration} linear infinite;
        }
        .marquee-track-y.paused {
          animation-play-state: paused;
        }

        /* Mobile wrapper: fixed height, clip overflow */
        .marquee-viewport-y {
          height: 480px;          /* show ~2 cards */
          overflow: hidden;
          position: relative;
        }

        /* Fade edges – vertical */
        .fade-top {
          background: linear-gradient(to bottom, var(--card, #fff), transparent);
        }
        .fade-bottom {
          background: linear-gradient(to top, var(--card, #fff), transparent);
        }
      `}</style>

      <section className="py-16 md:py-20 px-6 sm:px-8 md:px-12 bg-card border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto mb-12 md:mb-16 flex items-start justify-between gap-4">
          {testimonials.length > 0 && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-wide font-bold text-balance">
              What<span className="text-yellow-dark"> Our Clients</span> Say
            </h2>
          )}

          {isAdmin && (
            <Link
              href="/admin/add-testimonial"
              className="flex items-center tracking-widest gap-1.5 shrink-0 px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Plus size={15} />
              Add Testimonial
            </Link>
          )}
        </div>

        {/* ── MOBILE: vertical scroll ── */}
        <div className="block md:hidden">
          <div className="marquee-viewport-y relative">
            {/* Fade top */}
            <div className="fade-top pointer-events-none absolute left-0 top-0 w-full h-16 z-10" />
            {/* Fade bottom */}
            <div className="fade-bottom pointer-events-none absolute left-0 bottom-0 w-full h-16 z-10" />

            <div
              className={`marquee-track-y ${paused ? "paused" : ""}`}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              {marqueeItems.map((testimonial, index) => (
                <div
                  key={`y-${testimonial._id}-${index}`}
                  className="flex-shrink-0 w-full mb-4 p-6 bg-background border border-border rounded-lg space-y-4"
                >
                  <p className="text-base text-foreground leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {testimonial.image?.url ? (
                      <img
                        src={testimonial.image.url}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold text-muted-foreground">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {testimonial.name}
                      </p>
                      {testimonial.role && (
                        <p className="text-xs text-muted-foreground truncate">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABLET/DESKTOP: horizontal scroll ── */}
        <div className="hidden md:block relative overflow-hidden">
          {/* Fade left */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
            style={{ background: "linear-gradient(to right, var(--card, #fff), transparent)" }}
          />
          {/* Fade right */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
            style={{ background: "linear-gradient(to left, var(--card, #fff), transparent)" }}
          />

          <div
            className={`marquee-track-x ${paused ? "paused" : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {marqueeItems.map((testimonial, index) => (
              <div
                key={`x-${testimonial._id}-${index}`}
                className="relative flex-shrink-0 w-80 md:w-96 mx-3 p-6 md:p-8 bg-background border border-border rounded-lg space-y-6 group"
              >
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-border">
                  {testimonial.image?.url ? (
                    <img
                      src={testimonial.image.url}
                      alt={testimonial.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold text-muted-foreground">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm md:text-base truncate">
                      {testimonial.name}
                    </p>
                    {testimonial.role && (
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 md:mt-12 flex items-start justify-end gap-4">
          <Link className="text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors hover:underline" href="/testimonials">
            <ArrowRight className="w-4 h-4" /> View All Testimonials
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials;