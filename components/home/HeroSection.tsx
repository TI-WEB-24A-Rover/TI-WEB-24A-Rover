"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-[#ebfcfc] p-8 sm:p-10 md:p-14 shadow-lg">
      <svg
        className="absolute inset-0 h-full w-full opacity-50 pointer-events-none"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
      >
        {[150, 350, 550, 750, 950].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1="0"
            x2={x - 80}
            y2="500"
            stroke="#0ea5a8"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: i * 0.1 }}
          />
        ))}
      </svg>

      <div className="relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-cyan-700 uppercase shadow-sm"
          >
            PLATFORM SMART FARMING - JAKARTA PUSAT
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Wawasan Real-time untuk Hasil Panen Maksimal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-3xl text-lg text-slate-700 leading-relaxed font-medium"
          >
            Platform Smart Farming untuk menghubungkan petani Jakarta Pusat dan
            distributor di seluruh Indonesia. Pantau stok, validasi kualitas,
            dan percepat transaksi dalam satu dashboard yang ringkas.[cite: 5]
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button className="rounded-xl bg-[#0f172a] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all">
              Mulai Jelajah
            </button>
            <button className="rounded-xl border border-cyan-200 bg-transparent px-6 py-3 text-sm font-bold text-cyan-800 transition-all hover:bg-cyan-50">
              Pelajari Fitur
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mt-12 w-full overflow-hidden rounded-[24px] shadow-lg"
        >
          <div className="relative h-[250px] w-full sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src="/hero-tani.jpg"
              alt="Traktor menyemprot lahan pertanian saat matahari terbenam"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
