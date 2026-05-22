'use client';


import Hero from '../../components/Hero';
import Testimonials from '../../components/Testimonials';
import Industries from '../../components/Industries';

export default function Home() {
  return (
    <main className="min-h-screen text-foreground">
      {/* Hero Section - 100vh */}
      <Hero />

      {/* Clients Grid */}

      {/* Industries Grid */}
      <Industries />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
    </main>
  );
}
