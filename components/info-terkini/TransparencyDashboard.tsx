"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Info } from "lucide-react";

const stats = [
  {
    value: "15,240",
    label: "Total Pasokan Tersedia",
    subLabel: "Ton bahan pangan dan hortikultura",
    color: "text-emerald-600",
  },
  {
    value: "11",
    label: "Wilayah Aktif",
    subLabel: "Kecamatan terpantau aktif",
    color: "text-blue-600",
  },
  {
    value: "847",
    label: "Laporan Diproses",
    subLabel: "Transaksi dan laporan harian",
    color: "text-indigo-600",
  },
];

export default function TransparencyDashboard() {
  return (
    <section className="px-6 py-4">
      <div className="bg-white rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-cyan-50">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-md text-xs font-bold text-gray-500 mb-6">
            🛡️ GOVERNMENT TRANSPARENCY DASHBOARD
          </span>
          <h1 className="text-5xl font-bold text-slate-800 leading-tight mb-6">
            Dashboard Transparansi Pasokan Pertanian
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-xl">
            Pantau pasokan sayuran, bahan baku makanan, dan buah-buahan secara real-time dengan tampilan resmi bergaya pemerintah untuk membantu pengambilan keputusan yang cepat dan akurat.
          </p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl border border-dashed border-gray-200 aspect-video overflow-hidden">
          <Image
            src="/govertment.webp"
            alt="Infografis transparansi pasokan pertanian"
            width={1200}
            height={720}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}