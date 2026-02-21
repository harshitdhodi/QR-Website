import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const customer = await db.query.customers.findFirst({
          where: eq(customers.email, credentials.email),
        });

        if (!customer) return null;

        // Check if OTP is valid and not expired
        if (!customer.otp || customer.otp !== credentials.otp) return null;
        
        if (customer.otpExpires && new Date() > customer.otpExpires) return null;

        // Clear OTP after successful verification
        await db.update(customers)
          .set({ 
            otp: null, 
            otpExpires: null,
            isPhoneVerified: true 
          })
          .where(eq(customers.id, customer.id));

        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};