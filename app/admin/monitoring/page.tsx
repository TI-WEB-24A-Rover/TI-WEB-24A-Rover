"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getShipmentTracking,
  getTenantOrders,
  upsertShipmentTracking,
} from "@/lib/admin-store";
import { useAdminTenant } from "@/components/admin/useAdminTenant";

const movement = [
  { lat: -5.429, lng: 105.262, label: "Gudang InfoTani" },
  { lat: -5.417, lng: 105.281, label: "Simpang Rajabasa" },
  { lat: -5.401, lng: 105.302, label: "Koridor Distribusi" },
  { lat: -5.382, lng: 105.325, label: "Area Customer" },
];

export default function AdminMonitoringPage() {
  const router = useRouter();
  const { ready, session } = useAdminTenant();
  const [isMounted, setIsMounted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState<string>("");

  const activeMovement = movement[trackIndex] ?? movement[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!session) {
      router.push("/admin/login");
      return;
    }

    const orders = getTenantOrders(session.tenantId).filter((item) => item.deliveryStatus === "Berangkat");
    if (!orders.length) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveOrderId(orders[0].id);
  }, [ready, router, session]);

  const liveOrders = useMemo(() => {
    if (!session) {
      return [];
    }
    return getTenantOrders(session.tenantId).filter((item) => item.deliveryStatus === "Berangkat");
  }, [session]);

  const syncedTracking = useMemo(() => {
    if (!session) {
      return [];
    }
    return getShipmentTracking(session.tenantId);
  }, [session]);

  function handleMoveTruck() {
    if (!session) {
      return;
    }

    const order = liveOrders.find((item) => item.id === activeOrderId) ?? liveOrders[0];
    if (!order) {
      return;
    }

    const nextIdx = (trackIndex + 1) % movement.length;
    const point = movement[nextIdx];

    upsertShipmentTracking(session.tenantId, {
      orderId: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      vehicleLabel: order.logisticsTypeLabel,
      truckLocationLabel: point.label,
      latitude: point.lat,
      longitude: point.lng,
      status: "Berangkat",
    });

    setTrackIndex(nextIdx);
  }

  if (!isMounted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-3xl border border-white/60 bg-white/35 px-6 py-10 shadow-[0_24px_60px_rgba(14,116,144,0.12)] backdrop-blur-xl">
        <div className="relative flex flex-col items-center gap-4 rounded-4xl border border-cyan-200/70 bg-white/55 px-8 py-10 text-center shadow-[0_18px_40px_rgba(2,132,199,0.12)] backdrop-blur-lg">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
          <div className="space-y-2">
            <div className="mx-auto h-4 w-56 animate-pulse rounded-full bg-cyan-100/80" />
            <div className="mx-auto h-3 w-36 animate-pulse rounded-full bg-sky-100/80" />
          </div>
          <p className="text-sm font-medium text-slate-600">Menyiapkan monitoring Aqua Sky...</p>
        </div>
      </div>
    );
  }

  if (!ready || !session) {
    return null;
  }

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-white/80 bg-white/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Monitoring Pengiriman</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Shopee Style Tracking - Google Maps</h1>
        <p className="mt-2 text-sm text-slate-600">Data posisi akan tersinkron ke halaman profil customer.</p>
      </header>

      <article className="rounded-3xl border border-white/80 bg-white/65 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600">Posisi armada sekarang</p>
            <p className="text-lg font-semibold text-slate-900">{activeMovement.label}</p>
          </div>
          <button onClick={handleMoveTruck} className="rounded-xl bg-cyan-600 px-4 py-2.5 font-semibold text-white">
            Simulasikan Gerak Truk
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100 bg-white">
          <iframe
            title="Google Maps Monitoring"
            src={`https://maps.google.com/maps?q=${activeMovement.lat},${activeMovement.lng}&z=13&output=embed`}
            className="h-90 w-full"
            loading="lazy"
          />
        </div>
      </article>

      <article className="rounded-3xl border border-white/80 bg-white/65 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Status Sinkronisasi Customer</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          {syncedTracking.length === 0 ? (
            <p>Belum ada tracking tersimpan.</p>
          ) : (
            syncedTracking.map((item) => (
              <p key={item.orderId}>
                {item.customerName} - {item.truckLocationLabel} ({new Date(item.updatedAt).toLocaleTimeString("id-ID")})
              </p>
            ))
          )}
        </div>
      </article>
    </section>
  );
}