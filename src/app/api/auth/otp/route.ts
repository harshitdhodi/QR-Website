import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

// Default/bypass OTP for development & demo
const DEFAULT_OTP = '123456';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = body.email as string | undefined;

        if (!email) {
            return NextResponse.json({ message: 'Email or phone is required' }, { status: 400 });
        }

        // Find customer by email or phone
        const customer = await db
            .select()
            .from(customers)
            .where(
                or(
                    eq(customers.email, email),
                    eq(customers.phone, email)
                )
            )
            .limit(1);

        if (!customer[0]) {
            return NextResponse.json({ message: 'Customer not found. Please register first.' }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to DB
        await db
            .update(customers)
            .set({ otp, otpExpires: expiresAt })
            .where(eq(customers.id, customer[0].id));

        // TODO: Send OTP via email/SMS in production
        console.log(`[OTP] Generated for ${email}: ${otp}`);

        return NextResponse.json({
            message: 'OTP sent successfully',
            // NOTE: Default bypass OTP is always 123456. 
            // Shows actual OTP only in development so you can test.
            defaultOtp: DEFAULT_OTP,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        });

    } catch (error) {
        console.error('OTP generation error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
