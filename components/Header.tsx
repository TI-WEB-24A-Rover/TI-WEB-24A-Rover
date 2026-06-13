"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WelcomeGate from "@/components/customer/WelcomeGate";
import { getCurrentSession } from "@/lib/customer-store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Info Tani", href: "/info-tani" },
  { label: "Info Terkini", href: "/info-terkini" },
  { label: "Profile", href: "/profile" },
];

export default function Header() {
  const [showWelcomeGate, setShowWelcomeGate] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setIsLoggedIn(true);
      setUserName(session.name);
    }
  }, []);

  // Hide header completely on homepage if user is not logged in (splash / login stage)
  if (pathname === "/" && !isLoggedIn) {
    return null;
  }


  return (
    <>
      {showWelcomeGate && (
        <WelcomeGate
          behavior="overlay"
          initialTab="login"
          onClose={() => {
            setShowWelcomeGate(false);
            // Recheck session status after closing login overlay
            const session = getCurrentSession();
            if (session) {
              setIsLoggedIn(true);
              setUserName(session.name);
            }
          }}
        />
      )}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-emerald-900 sm:text-2xl"
          >
            InfoTani 🌾
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/20 cursor-pointer"
              >
                Profil: {userName?.split(" ")[0]}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowWelcomeGate(true)}
                className="rounded-full border border-cyan-300/70 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 cursor-pointer"
              >
                Masuk Customer
              </button>
            )}
            <Link
              href="/hubungi-kami"
              className="rounded-full bg-linear-to-r from-green-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-cyan-500/40"
            >
              Hubungi Kami
            </Link>
          </div>
        </nav>

        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8">
          {navLinks.map((link) => (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className="whitespace-nowrap rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}

