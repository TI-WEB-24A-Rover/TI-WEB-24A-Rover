import "./globals.css";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Send, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={plusJakartaSans.className}>
        {/* Gradien Background Global */}
        <div className="min-h-screen bg-[linear-gradient(135deg,#00FFFF_0%,#E0FFFF_50%,#B0E0E6_100%)] text-slate-800">
          {/* NAVBAR GLOBAL */}
          <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-bold text-cyan-900">
                InfoTani<span className="text-cyan-600">.</span>
              </Link>
              <div className="hidden gap-8 md:flex">
                <Link
                  href="/"
                  className="text-sm font-bold hover:text-cyan-700"
                >
                  Home
                </Link>
                <Link
                  href="/info-tani"
                  className="text-sm font-bold hover:text-cyan-700"
                >
                  Info Tani
                </Link>
                <Link
                  href="/info-terkini"
                  className="text-sm font-bold hover:text-cyan-700"
                >
                  Info Terkini
                </Link>
              </div>
              <Link
                href="/hubungi-kami"
                className="rounded-full bg-cyan-600 px-5 py-2 text-sm font-bold text-white hover:bg-cyan-700 transition-all"
              >
                Hubungi Kami
              </Link>
            </nav>
          </header>

          {/* KONTEN HALAMAN */}
          <main className="min-h-screen px-4 pb-12 pt-32 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* FOOTER GLOBAL */}
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
                {/* Kolom 1: Logo & Deskripsi */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">InfoTani</h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Platform informasi pertanian modern yang membantu petani dan
                    mitra memahami komoditas, harga, serta perkembangan pasar
                    secara cepat dan akurat.
                  </p>
                </div>

                {/* Kolom 2: INFO TANI */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Info Tani
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>
                      <Link href="/info-tani" className="hover:text-cyan-600">
                        Komoditas
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/info-terkini"
                        className="hover:text-cyan-600"
                      >
                        Harga
                      </Link>
                    </li>
                    <li>
                      <button className="hover:text-cyan-600">Mitra</button>
                    </li>
                  </ul>
                </div>

                {/* Kolom 3: INFO TERKINI */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Info Terkini
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>
                      <Link href="/" className="hover:text-cyan-600">
                        Artikel
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="hover:text-cyan-600">
                        Cuaca
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="hover:text-cyan-600">
                        Pasar
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Kolom 4: KONTAK */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Kontak
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>halo@infotani.id</li>
                    <li>+62 812-3456-7890</li>
                    <li>Indonesia, sabang sampai merauke</li>
                  </ul>
                </div>
              </div>

              {/* Bottom: Copyright & Social Media */}
              <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
                <p className="text-xs font-medium text-slate-500">
                  Copyright 2026 InfoTani. All rights reserved.
                </p>
                <div className="flex gap-4 text-slate-600">
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok InfoTani"
                    title="TikTok InfoTani"
                    className="hover:text-cyan-600 transition-colors"
                  >
                    <Send size={20} />
                  </a>
                  <a
                    href="https://telegram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram InfoTani"
                    title="Telegram InfoTani"
                    className="hover:text-cyan-600 transition-colors"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube InfoTani"
                    title="YouTube InfoTani"
                    className="hover:text-cyan-600 transition-colors"
                  >
                    <FaYoutube size={20} />
                  </a>
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp InfoTani"
                    title="WhatsApp InfoTani"
                    className="hover:text-cyan-600 transition-colors"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
