import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const auth = await requireAuth(req, ["FARMER", "ADMIN"]);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { productId } = await params;
    const body = await req.json();
    const { name, stockKg, pricePerKg, imageUrl, description } = body;

    const existing = await prisma.product.findUnique({ where: { id: productId } });

    if (!existing || (auth.user.role !== "ADMIN" && existing.farmerId !== auth.user.id)) {
      return NextResponse.json({ error: "Produk tidak ditemukan atau Anda tidak memiliki akses" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? String(description).trim() : null;
    if (stockKg !== undefined) {
      const normalizedStock = Number(stockKg);
      if (Number.isNaN(normalizedStock) || normalizedStock < 0) {
        return NextResponse.json({ error: "Stok tidak valid." }, { status: 400 });
      }
      updateData.stock = parseFloat(normalizedStock.toFixed(3));
      updateData.status = parseFloat(normalizedStock.toFixed(3)) < 50 ? "Menipis" : "Ready";
    }
    if (pricePerKg !== undefined) {
      const normalizedPrice = Number(pricePerKg);
      if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
        return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
      }
      updateData.price = parseFloat(normalizedPrice.toFixed(2));
    }
    if (imageUrl !== undefined) updateData.image = imageUrl ? String(imageUrl).trim() : null;

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        stock: parseFloat(product.stock.toString()),
        stockKg: parseFloat(product.stock.toString()),
        price: parseFloat(product.price.toString()),
        pricePerKg: parseFloat(product.price.toString()),
        image: product.image || null,
        imageUrl: product.image || null,
        stockStatus: product.status,
        updatedAt: product.updatedAt,
      },
      message: "Produk berhasil diupdate",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal update produk";
    console.error("PUT /api/admin/products/[productId] error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const auth = await requireAuth(req, ["FARMER", "ADMIN"]);
    if (!auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { productId } = await params;
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || (auth.user.role !== "ADMIN" && product.farmerId !== auth.user.id)) {
      return NextResponse.json({ error: "Produk tidak ditemukan atau Anda tidak memiliki akses" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ ok: true, message: `Produk '${product.name}' berhasil dihapus` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal hapus produk";
    console.error("DELETE /api/admin/products/[productId] error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}