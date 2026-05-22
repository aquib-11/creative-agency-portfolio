'use client';

import Link from 'next/link';
import { use } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ industryname: string }>;
}

export default function ClientLayout({ children, params }: LayoutProps) {
  const { industryname } = use(params);
  const pathname = usePathname();


  const isVideos = pathname.includes('/videos');
  const isPosters = pathname.includes('/posters');




  return (
    <main className="min-h-screen bg-background text-foreground">


      {/* ── Navigation Tabs ── */}
      <section className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex gap-8">
            <Link
              href={`/industries/${industryname}/videos`}
              className={`py-4 px-1 border-b-2 font-semibold transition-all tracking-wider ${
                isVideos
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Videos
            </Link>
            <Link
              href={`/industries/${industryname}/posters`}
              className={`py-4 px-1 border-b-2 font-semibold transition-all tracking-wider ${
                isPosters
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Posters
            </Link>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="md:py-8 px-6 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto">{children}</div>
      </section>
    </main>
  );
}