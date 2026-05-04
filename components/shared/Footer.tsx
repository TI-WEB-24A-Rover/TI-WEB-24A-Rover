import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { FiInstagram, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/40 bg-white/50 backdrop-blur-sm pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid gap-12 md:grid-cols-4 text-sm">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-emerald-900">InfoTani 🌾</h3>
          <p className="text-slate-500 leading-relaxed">
            Ekosistem digital untuk mempertemukan petani Jakarta Pusat dengan
            distributor seluruh Indonesia.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">
            Info Tani
          </h4>
          <ul className="space-y-2 text-slate-500">
            <li>
              <Link href="#">Komoditas</Link>
            </li>
            <li>
              <Link href="#">Harga Harian</Link>
            </li>
            <li>
              <Link href="#">Mitra Petani</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">
            Kontak
          </h4>
          <ul className="space-y-3 text-slate-500">
            <li className="flex gap-2">
              <Mail size={16} /> halo@infotani.id
            </li>
            <li className="flex gap-2">
              <Phone size={16} /> +62 813-7777-9090
            </li>
            <li className="flex gap-2">
              <MapPin size={16} /> Jakarta Pusat, DKI Jakarta
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider">
            Social Media
          </h4>
          <div className="flex gap-4 text-slate-400">
            <FiInstagram size={20} /> <Send size={20} /> <FiYoutube size={20} />{" "}
            <MessageCircle size={20} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-slate-400">
        <p>© 2026 InfoTani. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
