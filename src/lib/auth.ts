import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3060/api";

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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        try {
          // CALL ADMIN API for login logic
          const res = await fetch(`${ADMIN_API_URL}/auth/customer-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              otp: credentials.otp,
            }),
          });

          const data = await res.json();

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role || "customer",
            };
          }

          console.error("[AUTH] Admin login failure:", data.message);
          return null;
        } catch (error) {
          console.error("[AUTH] Connection error to Admin API:", error);
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