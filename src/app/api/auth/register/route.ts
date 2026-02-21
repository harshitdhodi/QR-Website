import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendOTPEmail } from '@/lib/email';
import { randomUUID } from 'crypto'; // or use a cuid library

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    let customer;

    if (existingUser.length > 0) {
      customer = existingUser[0];
      await db.update(customers)
        .set({ name, phone, isPhoneVerified: false })
        .where(eq(customers.id, customer.id));
    } else {
      // ✅ Generate ID before insert — MySQL doesn't support RETURNING
      const newId = randomUUID();

      await db.insert(customers).values({
        id: newId, // ✅ provide the ID explicitly
        name,
        email,
        phone,
      });

      customer = { id: newId, name, email, phone };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(customers)
      .set({ otp, otpExpires: expires })
      .where(eq(customers.id, customer.id));

    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Registration successful! Please check your email for OTP.',
      userId: customer.id,
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({
      message: error.message || 'Registration failed'
    }, { status: 500 });
  }
}