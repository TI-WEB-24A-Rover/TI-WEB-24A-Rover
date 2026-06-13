"use client";

import Header from "@/components/Header";
import FooterWrapper from "@/components/FooterWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#00FFFF_0%,#E0FFFF_52%,#B0E0E6_100%)] text-slate-800">
      <Header />
      <main className="min-h-screen px-4 pb-16 pt-32 md:pt-24 sm:px-6 lg:px-8">
        {children}
      </main>
      <FooterWrapper />
    </div>
  );
}
