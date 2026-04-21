import { NextRequest, NextResponse } from "next/server";
import { getAdminOrigin } from "@/lib/adminOrigin";

const ADMIN_ORIGIN = getAdminOrigin();

export async function POST(req: NextRequest) {
  const res = await fetch(`${ADMIN_ORIGIN}/api/razorpay/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text(),
    redirect: "follow",
    cache: "no-store",
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

