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
    
  // Replace lines 24-31 with:
if (!customer) {
  // Generate a unique ID for the customer
  const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create new customer with email and a temporary phone
  await db.insert(customers).values({
    id: customerId,
    email,
    phone: `temp_${Date.now()}`, // Temporary phone since it's required
    otp,
    otpExpires: expires,
  });
  
  // Fetch the newly created customer
  customer = await db.query.customers.findFirst({
    where: eq(customers.email, email),
  });
}else {
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