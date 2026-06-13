"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCurrentSession } from "@/lib/customer-store";

// Publicly allowed paths for unauthenticated users
const ALLOWED_PATHS = ["/", "/login", "/signup"];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = getCurrentSession();
    const isPublicPath = ALLOWED_PATHS.includes(pathname);

    if (session || isPublicPath) {
      // User is authenticated OR they are accessing a allowed public entry page (Splash/Login)
      setIsAuthorized(true);
    } else {
      // User is not authenticated and trying to access a protected page
      setIsAuthorized(false);
      // Redirect to login page where they can authenticate
      window.location.href = "/login";
    }
  }, [pathname]);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        <span className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
          Memuat halaman...
        </span>
      </div>
    );
  }

  // If not authorized (redirecting), render a loader instead of flashing the page content
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        <span className="text-xs text-slate-500 tracking-wider uppercase font-semibold">
          Mengalihkan rute...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}