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
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const expanded = response.url;
    console.log("Resolved URL:", expanded);

    if (!expanded || expanded === url) {
      return NextResponse.json({ error: "Could not resolve URL" }, { status: 422 });
    }

    return NextResponse.json({ expanded });
  } catch {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
