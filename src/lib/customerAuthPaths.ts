/**
 * Same-origin customer auth routes proxied by our app.
 * We keep them under `/api/backend/*` so NextAuth can own `/api/auth/*`.
 */
export const CUSTOMER_REGISTER_REQUEST_OTP = "/api/backend/auth/register/request-otp";
export const CUSTOMER_REGISTER_VERIFY_OTP = "/api/backend/auth/register/verify-otp";

export const CUSTOMER_LOGIN_REQUEST_OTP = "/api/backend/auth/login/request-otp";
export const CUSTOMER_LOGIN_VERIFY_OTP = "/api/backend/auth/login/verify-otp";

