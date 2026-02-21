import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Check if customer exists, if not create one
    let customer = await db.query.customers.findFirst({
      where: eq(customers.email, email),
    });
    
    if (!customer) {
      // Create new customer with email
      const [newCustomer] = await db.insert(customers).values({
        email,
        otp,
        otpExpires: expires,
      }).returning();
      customer = newCustomer;
    } else {
      // Update existing customer with new OTP
      await db.update(customers)
        .set({ otp, otpExpires: expires })
        .where(eq(customers.id, customer.id));
    }
    
    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'OTP sent successfully',
      // Don't return the actual OTP in production
      // otp: process.env.NODE_ENV === 'development' ? otp : undefined 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}