import { NextRequest, NextResponse } from "next/server";
import { getAdminOrigin } from "@/lib/adminOrigin";

const ADMIN_ORIGIN = getAdminOrigin();

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";

  const res = await fetch(`${ADMIN_ORIGIN}/api/orders/my${req.nextUrl.search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { authorization: auth } : {}),
    },
    redirect: "follow",
    cache: "no-store",
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

