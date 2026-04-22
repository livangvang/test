import { NextRequest, NextResponse } from "next/server";
import { fetchVehiclePage } from "@/lib/queries/products";
import { PRODUCT_SLUGS } from "@/lib/types/product";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!PRODUCT_SLUGS.includes(slug as typeof PRODUCT_SLUGS[number])) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor");
  if (!cursor) {
    return NextResponse.json({ error: "Missing cursor" }, { status: 400 });
  }

  try {
    const { vehicles, nextCursor } = await fetchVehiclePage(slug, cursor);
    return NextResponse.json(
      { vehicles, nextCursor },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } }
    );
  } catch (error) {
    console.error("fetchVehiclePage failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle page" },
      { status: 500 }
    );
  }
}
