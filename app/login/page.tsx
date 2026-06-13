"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WelcomeGate from "@/components/customer/WelcomeGate";
import { getCurrentSession } from "@/lib/customer-store";

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = getCurrentSession();
    if (session) {
      router.push("/home");
    }
  }, [router]);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f4f0] py-6">
      <WelcomeGate behavior="page" initialTab="login" />
    </main>
  );
}