import { log } from "console";

/**
 * Backend (admin API) origin for server rewrites and server-side fetches.
 * Set ADMIN_ORIGIN, NEXT_PUBLIC_ADMIN_ORIGIN, or NEXT_PUBLIC_ADMIN_API_URL in .env.
 */
export function getAdminOrigin() {
  const explicit =
    process.env.ADMIN_ORIGIN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, "");
  if (explicit) return explicit;

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;


  if (apiUrl) {
    try {
      const fi = new URL(apiUrl).origin
      console.log(fi, "fefe");

      return new URL(apiUrl).origin;
    } catch {
      /* ignore invalid URL */
    }
  }

  // return "https://qradmin.rndtd.com";
}
