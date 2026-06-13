import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import RouteGuard from "@/components/customer/RouteGuard";

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
    <html lang="id" suppressHydrationWarning>
      <body className={plusJakartaSans.className}>
        <RouteGuard>{children}</RouteGuard>
      </body>
    </html>
  );
}



