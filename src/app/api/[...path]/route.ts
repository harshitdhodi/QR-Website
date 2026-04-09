// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminOrigin } from "@/lib/adminOrigin";

const ADMIN_ORIGIN = getAdminOrigin();

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = `${ADMIN_ORIGIN}/api/${path.join("/")}${req.nextUrl.search}`;

    const res = await fetch(url, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
        redirect: "follow", // ← server follows redirect, browser never sees it
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