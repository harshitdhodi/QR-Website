import { NextRequest, NextResponse } from "next/server";
import { getAdminOrigin } from "@/lib/adminOrigin";

const ADMIN_ORIGIN = getAdminOrigin();

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = `${ADMIN_ORIGIN}/api/${path.join("/")}${req.nextUrl.search}`;
  const auth = req.headers.get("authorization") || "";
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { authorization: auth } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    redirect: "follow",
    cache: "no-store",
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
