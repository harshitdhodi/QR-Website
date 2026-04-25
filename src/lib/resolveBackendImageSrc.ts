import type { StaticImageData } from "next/image";
import { safeImageSrc } from "@/lib/safeImageSrc";

function getAdminOriginFromEnv() {
  const direct = process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, "");
  if (direct) return direct;
  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
  if (apiUrl) {
    try {
      return new URL(apiUrl).origin.replace(/\/$/, "");
    } catch {
      // ignore invalid URL
    }
  }
  return "https://qradmin.rndtd.com";
}

function getUploadsOriginFromEnv() {
  const direct = process.env.NEXT_PUBLIC_UPLOADS_ORIGIN?.replace(/\/$/, "");
  return direct || "";
}

/**
 * Normalizes backend-provided image paths so `next/image` can load them.
 * - Keeps local `/public/*` assets (e.g. `/images/...`) relative
 * - Prefixes admin origin for backend API paths like `/api/...`
 * - For `/uploads/...`: defaults to the admin origin (uploads are served by dashboard),
 *   but can be overridden by setting `NEXT_PUBLIC_UPLOADS_ORIGIN` (e.g. CDN).
 * - Encodes URL safely via `safeImageSrc`
 */
export function resolveBackendImageSrc(
  src: string | null | undefined,
  fallback: string | StaticImageData,
): string | StaticImageData {
  if (!src) return fallback;
  if (typeof src !== "string") return fallback;

  if (src.startsWith("http://") || src.startsWith("https://")) return safeImageSrc(src);
  if (src.startsWith("/api/")) return safeImageSrc(`${getAdminOriginFromEnv()}${src}`);
  if (src.startsWith("/uploads/")) {
    const uploadsOrigin = getUploadsOriginFromEnv() || getAdminOriginFromEnv();
    return safeImageSrc(`${uploadsOrigin}${src}`);
  }
  return safeImageSrc(src);
}

