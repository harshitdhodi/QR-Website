import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { customers } from "@/db/schema";
import { eq, or } from "drizzle-orm";

// Universal default/bypass OTP for development & demo access
const DEFAULT_OTP = "123456";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        isCustomer: { label: "isCustomer", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const { email, otp } = credentials;

        try {
          // Find customer by email or phone
          const customerRows = await db
            .select()
            .from(customers)
            .where(
              or(
                eq(customers.email, email),
                eq(customers.phone, email)
              )
            )
            .limit(1);

          const customer = customerRows[0];

          if (!customer) {
            console.log("[AUTH] Customer not found for:", email);
            return null;
          }

          // ── OTP validation ──────────────────────────────────────────────
          // 1. Accept the universal default OTP "123456" (bypass for demo/dev)
          const isDefaultOtp = otp === DEFAULT_OTP;

          // 2. Accept if it matches the OTP stored in DB and hasn't expired
          const isStoredOtpValid =
            customer.otp &&
            customer.otp === otp &&
            customer.otpExpires &&
            new Date() <= new Date(customer.otpExpires);

          if (!isDefaultOtp && !isStoredOtpValid) {
            console.log("[AUTH] OTP invalid or expired for:", email);
            return null;
          }

          // Clear OTP after successful login (non-fatal)
          try {
            await db
              .update(customers)
              .set({ otp: null, otpExpires: null, isPhoneVerified: true })
              .where(eq(customers.id, customer.id));
          } catch (updateErr) {
            console.warn("[AUTH] Failed to clear OTP (non-fatal):", updateErr);
          }

          return {
            id: customer.id,
            name: customer.name ?? "",
            email: customer.email ?? email,
            role: customer.role ?? "customer",
          };
        } catch (error) {
          console.error("[AUTH] Error during customer authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};