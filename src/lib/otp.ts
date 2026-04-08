import crypto from "crypto";

export type OtpPurpose = "login" | "signup";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  // intentionally simple; avoids heavy deps
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateOtp() {
  // 6-digit numeric OTP
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(opts: { email: string; otp: string; purpose: OtpPurpose; secret: string }) {
  // Bind OTP to email + purpose, so replays across flows are harder
  const material = `${normalizeEmail(opts.email)}|${opts.purpose}|${opts.otp}|${opts.secret}`;
  return crypto.createHash("sha256").update(material).digest("hex");
}

export function getClientIp(headers: Headers) {
  // best-effort; works behind most proxies
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}

