import { NextRequest, NextResponse } from "next/server";
import { getAdminOrigin } from "@/lib/adminOrigin";

const ADMIN_ORIGIN = getAdminOrigin();

async function proxy(req: NextRequest) {
  const url = `${ADMIN_ORIGIN}/api/carts${req.nextUrl.search}`;
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

export const GET = proxy;
export const POST = proxy;
export const DELETE = proxy;

