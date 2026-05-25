"use client";
import TransparencyDashboard from "@/components/info-terkini/TransparencyDashboard";

export default function InfoTerkiniPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header navigasi internal */}
      <header className="mb-8 ml-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Wawasan Pasar</h2>
        <p className="text-slate-500 text-[10px] mt-1 font-medium">PEMBARUAN DATA: 5 MEI 2026</p>
      </header>

      {/* Render Fitur Utama */}
      <TransparencyDashboard />
    </div>
  );
}