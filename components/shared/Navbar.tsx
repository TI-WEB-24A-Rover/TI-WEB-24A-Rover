"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-emerald-900">
          InfoTani 🌾
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          <Link href="/info-tani" className="hover:text-emerald-700">
            Info Tani
          </Link>
          <Link href="/info-terkini" className="hover:text-emerald-700">
            Info Terkini
          </Link>
          <Link
            href="/hubungi-kami"
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-white"
          >
            Hubungi Kami
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-white p-4 space-y-4 border-t">
          <Link href="/" className="block font-medium">
            Home
          </Link>
          <Link href="/info-tani" className="block font-medium">
            Info Tani
          </Link>
          <Link href="/info-terkini" className="block font-medium">
            Info Terkini
          </Link>
        </div>
      )}
    </header>
  );
}
