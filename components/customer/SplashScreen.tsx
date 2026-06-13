"use client";

import { useRouter } from "next/navigation";
import WelcomeGate from "./WelcomeGate";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <WelcomeGate
      behavior="splash-only"
      onClose={() => {
        router.push("/login");
      }}
    />
  );
}
