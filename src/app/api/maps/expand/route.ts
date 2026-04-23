import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow Google Maps short URLs
  if (!url.startsWith("https://maps.app.goo.gl/") && !url.startsWith("https://goo.gl/maps/")) {
    return NextResponse.json({ error: "Only Google Maps short URLs are supported" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    const expanded = response.url;

    if (!expanded || expanded === url) {
      return NextResponse.json({ error: "Could not resolve URL" }, { status: 422 });
    }

    return NextResponse.json({ expanded });
  } catch {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
