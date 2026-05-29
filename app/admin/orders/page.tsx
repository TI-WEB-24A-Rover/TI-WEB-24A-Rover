"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DeliveryStatus,
  ShippingOption,
  analyzeLogisticsLoad,
  toRupiah,
  updateTenantOrderStatus,
} from "@/lib/admin-store";
import { useAdminTenant } from "@/components/admin/useAdminTenant";

type Order = {
  id: string;
  trackingId: string;
  billCode: string;
  createdAt: string;
  status: string;
  statusLabel: string;
  buyer: { id: string; name: string; email: string };
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  logisticsCost: number;
  total: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantityKg: number;
    unitPrice: number;
    subtotal: number;
  }>;
};

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

const statuses: DeliveryStatus[] = ["Konfirmasi", "Proses", "Berangkat", "Selesai", "Dibatalkan"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { ready, session } = useAdminTenant();
  const [isMounted, setIsMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [weightTonInput, setWeightTonInput] = useState<number>(8);
  const [shippingOption, setShippingOption] = useState<ShippingOption>("PT_INFO_TANI");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  async function readResponseError(response: Response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      return typeof payload?.error === "string" ? payload.error : JSON.stringify(payload);
    }

    return await response.text();
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  async function fetchOrders() {
    if (!session) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/orders?scope=active&limit=20`, {
        headers: {
          "x-farmer-id": session.tenantId,
        },
      });

      if (!response.ok) {
        const errorMessage = await readResponseError(response);
        console.error("Fetch orders error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorMessage,
        });
        addToast(errorMessage || `Gagal mengambil data pesanan (${response.status})`, "error");
        return;
      }

      const data = await response.json();
      const newOrders = data.data || [];

      setOrders(newOrders);

      // Auto-notify on new paid orders
      if (newOrders.length > prevCountRef.current) {
        const newlyPaidCount = newOrders.filter(
          (order: Order) => order.paymentStatus === "SUCCESS",
        ).length;
        if (newlyPaidCount > 0) {
          addToast(`✓ ${newlyPaidCount} pesanan baru pembayaran sukses!`, "success");
        }
      }
      prevCountRef.current = newOrders.length;

      if (newOrders.length > 0 && !activeOrder) {
        setActiveOrder(newOrders[0]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      console.error("Fetch error:", error);
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  const memoFetchOrders = useCallback(fetchOrders, [session, addToast, activeOrder]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!session) {
      router.push("/admin/login");
      return;
    }

    // Initial fetch
    memoFetchOrders();

    // Setup polling every 5 seconds
    pollIntervalRef.current = setInterval(() => {
      memoFetchOrders();
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [ready, router, session, memoFetchOrders]);

  const analysis = useMemo(() => analyzeLogisticsLoad(weightTonInput), [weightTonInput]);

  function handleStatusChange(nextStatus: DeliveryStatus) {
    if (!session || !activeOrder) {
      return;
    }

    // Legacy fallback to localStorage
    try {
      updateTenantOrderStatus(session.tenantId, activeOrder.id, nextStatus);
      addToast(`Status diupdate ke ${nextStatus}`, "success");
      memoFetchOrders();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal update status";
      addToast(msg, "error");
    }
  }

  if (!isMounted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-3xl border border-white/60 bg-white/35 px-6 py-10 shadow-[0_24px_60px_rgba(14,116,144,0.12)] backdrop-blur-xl">
        <div className="relative flex flex-col items-center gap-4 rounded-[2rem] border border-cyan-200/70 bg-white/55 px-8 py-10 text-center shadow-[0_18px_40px_rgba(2,132,199,0.12)] backdrop-blur-lg">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
          <div className="space-y-2">
            <div className="mx-auto h-4 w-56 animate-pulse rounded-full bg-cyan-100/80" />
            <div className="mx-auto h-3 w-36 animate-pulse rounded-full bg-sky-100/80" />
          </div>
          <p className="text-sm font-medium text-slate-600">Menyiapkan pesanan Aqua Sky...</p>
        </div>
      </div>
    );
  }

  if (!ready || !session) {
    return null;
  }

  return (
    <section className="space-y-6">
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition ${
                toast.type === "success"
                  ? "bg-emerald-500"
                  : toast.type === "error"
                    ? "bg-rose-500"
                    : "bg-cyan-500"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}

      <header className="rounded-3xl border border-white/80 bg-white/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Order Management</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Kelola Pesanan Masuk</h1>
        <p className="mt-2 text-sm text-slate-600">
          {orders.length} pesanan aktif • Auto-refresh setiap 5 detik
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="space-y-3 rounded-3xl border border-white/80 bg-white/65 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Pesanan</h2>
          {isLoading && (
            <p className="text-sm text-slate-600">Memuat data...</p>
          )}
          {orders.map((order) => {
            const active = order.id === activeOrder?.id;
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => setActiveOrder(order)}
                className={`w-full rounded-2xl border p-4 text-left ${
                  active ? "border-cyan-400 bg-cyan-50/70" : "border-cyan-100 bg-white/80"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-cyan-700">Bill #{order.billCode}</p>
                    <h3 className="text-base font-semibold text-slate-900">{order.buyer.name}</h3>
                    <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "SUCCESS"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus === "SUCCESS" ? "✓ BAYAR" : "PENDING"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">Total: Rp {order.total.toLocaleString("id-ID")}</p>
              </button>
            );
          })}
          {orders.length === 0 && !isLoading && (
            <p className="text-sm text-slate-600">Belum ada pesanan aktif</p>
          )}
        </article>

        <article className="rounded-3xl border border-white/80 bg-white/65 p-5">
          {activeOrder ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-cyan-700">Detail Pesanan</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{activeOrder.buyer.name}</h2>
                <p className="text-sm text-slate-600">{activeOrder.buyer.email}</p>
              </div>

              <div className="grid gap-3 rounded-2xl border border-cyan-100 bg-white/80 p-4 text-sm text-slate-700">
                <p>Metode Pembayaran: {activeOrder.paymentMethod}</p>
                <p>Status Pembayaran: {activeOrder.paymentStatus}</p>
                <p>Total Bayar: Rp {activeOrder.total.toLocaleString("id-ID")}</p>
                <p>Produk: {activeOrder.items.map((item) => `${item.productName} (${item.quantityKg} kg)`).join(", ")}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">Opsi Pengiriman</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShippingOption("PT_INFO_TANI")}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      shippingOption === "PT_INFO_TANI"
                        ? "border-cyan-400 bg-cyan-50 text-cyan-800"
                        : "border-cyan-100 bg-white"
                    }`}
                  >
                    Kirim via Truk PT InfoTani
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingOption("SELF_PICKUP")}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      shippingOption === "SELF_PICKUP"
                        ? "border-cyan-400 bg-cyan-50 text-cyan-800"
                        : "border-cyan-100 bg-white"
                    }`}
                  >
                    Ambil Sendiri ke Lokasi Petani
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-white/80 p-4">
                <p className="text-sm font-semibold text-slate-800">Logistik Analyzer (PT InfoTani)</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-slate-700">Berat Muatan (ton)</label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={weightTonInput}
                    onChange={(event) => setWeightTonInput(Number(event.target.value))}
                    placeholder="Contoh: 8"
                    title="Input berat muatan dalam ton"
                    className="w-36 rounded-lg border border-cyan-100 bg-white px-3 py-2"
                  />
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {analysis.recommendation.map((plan) => (
                    <p key={plan.vehicleType}>
                      {plan.vehicleType}: {plan.count} unit x {toRupiah(plan.additionalCost)} = {toRupiah(plan.subtotalCost)}
                    </p>
                  ))}
                  <p className="font-semibold text-cyan-800">Total Tambahan: {toRupiah(analysis.totalAdditionalCost)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">Update Status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className="rounded-lg border border-cyan-200 bg-white px-3 py-1.5 text-sm text-cyan-700"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Belum ada pesanan.</p>
          )}
        </article>
      </div>
    </section>
  );
}