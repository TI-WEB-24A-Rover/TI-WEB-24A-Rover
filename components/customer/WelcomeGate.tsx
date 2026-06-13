"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sprout } from "lucide-react";
import {
  saveCustomer,
  saveToken,
  saveSession,
  CustomerAccount,
} from "@/lib/customer-store";

type WelcomeGateProps = {
  behavior?: "overlay" | "page" | "splash-only";
  initialTab?: "login" | "signup";
  onClose?: () => void;
};

export default function WelcomeGate({
  behavior = "overlay",
  initialTab = "login",
  onClose,
}: WelcomeGateProps) {
  const router = useRouter();

  // Welcome overlay visible state
  const [isVisible, setIsVisible] = useState(false);
  // Splash Screen mode active
  const [showSplash, setShowSplash] = useState(
    behavior === "overlay" || behavior === "splash-only"
  );
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  
  // Auth state
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if session already exists
    const hasSession = typeof window !== "undefined" && window.localStorage.getItem("infotani.customer.session");
    
    if (behavior === "overlay") {
      if (hasSession) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
        setShowSplash(true);
      }
    } else if (behavior === "splash-only") {
      setIsVisible(true);
      setShowSplash(true);
    } else {
      // Direct page mode
      setIsVisible(true);
      setShowSplash(false);
    }
  }, [behavior]);

  // Submit Login/Signup Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (activeTab === "signup") {
        if (!name.trim() || !cleanEmail || !phone.trim() || !password.trim()) {
          throw new Error("Lengkapi seluruh kolom pendaftaran.");
        }
        if (password.trim().length < 6) {
          throw new Error("Password minimal 6 karakter.");
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            password: password.trim(),
            role: "CUSTOMER",
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Gagal membuat akun.");
        }

        const user = payload.user as { id: string; name: string; email: string };
        const token = payload.token as string;
        const account: CustomerAccount = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: phone.trim(),
          password: password.trim(),
          createdAt: new Date().toISOString(),
        };

        saveCustomer(account);
        saveToken(token);
        saveSession({
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
          createdAt: new Date().toISOString(),
        });

        setStatus("success");
        setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
          window.location.href = "/home";
        }, 1200);

      } else {
        if (!cleanEmail || !password.trim()) {
          throw new Error("Email dan password wajib diisi.");
        }

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: password.trim() }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Email atau password tidak cocok.");
        }

        const user = payload.user as { id: string; name: string; email: string; phone?: string };
        const token = payload.token as string;
        const account: CustomerAccount = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          password: password.trim(),
          createdAt: new Date().toISOString(),
        };

        saveCustomer(account);
        saveToken(token);
        saveSession({
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
          createdAt: new Date().toISOString(),
        });

        setStatus("success");
        setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
          window.location.href = "/home";
        }, 1200);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] overflow-hidden ${
        behavior === "splash-only"
          ? "bg-transparent pointer-events-none"
          : "bg-[#f5f4f0] text-[#1c1b18]"
      }`}
    >
      {/* -------------------------------------------------------------
          GREEN CURTAIN OVERLAY: SPLASH SCREEN (Dribbble Video Design)
          ------------------------------------------------------------- */}
      {behavior !== "page" && (
        <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#142d1d] cursor-pointer pointer-events-auto"
        onClick={() => {
          setShowSplash(false);
          if (behavior === "splash-only") {
            setTimeout(() => {
              setIsVisible(false);
              if (onClose) onClose();
            }, 800);
          }
        }}
        animate={{ y: showSplash ? "0%" : "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ pointerEvents: showSplash ? "auto" : "none" }}
      >
        {/* Sprout Icon with Elastic Bounce Entrance */}
        <motion.div
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#a3e635] flex items-center justify-center shadow-lg shadow-emerald-950/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {/* Sprout SVG Inside */}
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 text-[#142d1d]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 20h10" />
            <path d="M10 20c0-5.5 4.5-10 10-10" />
            <path d="M14 20c0-3.5 1.5-6.5 4-8.5" />
            <path d="M4 14c5.5 0 10 4.5 10 10" />
          </svg>
        </motion.div>

        {/* Title & Lampung Subtitle Fading In with Slide Up */}
        <motion.h1
          className="mt-6 font-serif text-3xl sm:text-4xl font-normal tracking-wide text-[#f5f4f0]"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          InfoTani
        </motion.h1>

        <motion.p
          className="mt-2 text-[10px] font-sans tracking-[0.25em] text-[#a3e635] font-bold uppercase"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Wawasan Real-time &amp; Pertanian Indonesia
        </motion.p>

        {/* Tap Prompt */}
        <motion.div
          className="mt-16 text-[9px] tracking-[0.2em] font-bold text-[#f5f4f0]/60 uppercase flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span>Ketuk untuk memulai</span>
          <ArrowRight className="w-3.5 h-3.5 animate-pulse text-[#a3e635]" />
        </motion.div>
      </motion.div>
      )}

      {/* -------------------------------------------------------------
          STAGE 2: MINIMALIST EDITORIAL SPLIT SCREEN (Revealed Under Curtain)
          ------------------------------------------------------------- */}
      {behavior !== "splash-only" && (
        <div className="w-full h-full grid md:grid-cols-2 overflow-hidden bg-[#f5f4f0]">
          {/* LEFT COLUMN: Clean Editorial Input Form */}
          <motion.div
            className="flex flex-col justify-between px-6 py-6 sm:px-12 sm:py-8 overflow-y-auto"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 35 : 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            style={{ pointerEvents: showSplash ? "none" : "auto" }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#1c1b18]/60 font-semibold uppercase">
              <span>MENU</span>
              <span className="font-serif text-sm tracking-normal text-[#1c1b18] font-bold lowercase">
                infotani
              </span>
              <span>CONTACT</span>
            </div>

            {/* Form Content Area */}
            <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center py-10">
              <div className="mb-8 text-left">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-[#1c1b18]">
                  {activeTab === "login" ? "Login customer" : "Buat akun baru"}
                </h1>
                <p className="text-xs text-[#1c1b18]/60 mt-3 leading-relaxed">
                  {activeTab === "login"
                    ? "Nikmati kemudahan mengakses komoditas pertanian Lampung terbaik secara real-time. Silakan isi form di bawah untuk masuk."
                    : "Daftarkan diri Anda untuk melacak posisi armada pengiriman, memantau invoice, serta melihat riwayat transaksi komoditas."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === "signup" && (
                  <label className="block">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#1c1b18]/50 mb-1">
                      Nama Lengkap
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1c1b18]/15 focus:border-[#1c1b18] text-[#1c1b18] py-2.5 outline-none text-sm font-normal tracking-wide transition-all"
                      placeholder="Ketik nama lengkap"
                      required
                    />
                  </label>
                )}

                <label className="block">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#1c1b18]/50 mb-1">
                    Alamat Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#1c1b18]/15 focus:border-[#1c1b18] text-[#1c1b18] py-2.5 outline-none text-sm font-normal tracking-wide transition-all"
                    placeholder="customer@email.com"
                    required
                  />
                </label>

                {activeTab === "signup" && (
                  <label className="block">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#1c1b18]/50 mb-1">
                      Nomor Telepon
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1c1b18]/15 focus:border-[#1c1b18] text-[#1c1b18] py-2.5 outline-none text-sm font-normal tracking-wide transition-all"
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </label>
                )}

                <label className="block">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#1c1b18]/50 mb-1">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-[#1c1b18]/15 focus:border-[#1c1b18] text-[#1c1b18] py-2.5 outline-none text-sm font-normal tracking-wide transition-all"
                    placeholder={activeTab === "signup" ? "Minimal 6 karakter" : "Masukkan password"}
                    required
                  />
                </label>

                {/* Error Notification */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-3 text-xs text-rose-600"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button matching the circular arrow reference style */}
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="mt-8 flex items-center justify-between border-t border-[#1c1b18]/10 pt-6 group cursor-pointer w-full text-[#1c1b18] disabled:opacity-50"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-emerald-700 transition-colors">
                    {status === "loading" ? "Memproses..." : activeTab === "login" ? "Masuk" : "Buat Akun"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#1c1b18]/40 group-hover:text-[#1c1b18]/70 transition-colors">
                      {status === "loading" ? "Loading" : status === "success" ? "Berhasil" : activeTab === "login" ? "Kirim Masuk" : "Kirim Daftar"}
                    </span>
                    <div className="w-12 h-12 rounded-full border border-[#1c1b18]/15 flex items-center justify-center transition-all duration-300 group-hover:border-[#1c1b18] group-hover:bg-[#1c1b18] group-hover:text-white">
                      {status === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </div>
                  </div>
                </button>
              </form>

              {/* Tab switcher link */}
              <div className="mt-8 text-left">
                {activeTab === "login" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setError(null);
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1b18]/70 hover:text-emerald-700 transition"
                  >
                    Belum punya akun? Buat akun &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setError(null);
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1b18]/70 hover:text-emerald-700 transition"
                  >
                    Sudah punya akun? Masuk &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#1c1b18]/40 font-semibold uppercase">
              <span>FACEBOOK / INSTAGRAM</span>
              <span>TERMS &amp; CONDITIONS</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Minimalist agricultural wheat/vase image matching reference style */}
          <motion.div
            className="hidden md:block relative w-full h-full overflow-hidden bg-[#eae9e4] border-l border-[#1c1b18]/5"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: showSplash ? 0 : 1, x: showSplash ? 40 : 0 }}
            transition={{ delay: 0.3, duration: 0.75, ease: "easeOut" }}
            style={{ pointerEvents: showSplash ? "none" : "auto" }}
          >
            <img
              src="/login-visual.png"
              alt="Minimalist pottery vase and wheat stalks"
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-[1.03]"
            />
            
            {/* Subtle Floating Wheat Indicator overlay */}
            <div className="absolute bottom-8 right-8 bg-white/70 backdrop-blur-md text-[9px] tracking-widest uppercase font-semibold text-[#1c1b18] px-4 py-2.5 rounded-full border border-white/40 flex items-center gap-1.5 shadow-sm">
              <Sprout className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              <span>InfoTani Di Seluruh Indonesia</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
