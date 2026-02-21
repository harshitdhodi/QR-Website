import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    // Check if exists
    const existing = await db.query.customers.findFirst({
        where: eq(customers.email, email)
    });

    if (existing) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create with a static OTP for demonstration/testing
    const otp = "123456"; 
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await db.insert(customers).values({
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        otp,
        otpExpires
    });

    return NextResponse.json({ success: true, message: "User registered. OTP is 123456" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}