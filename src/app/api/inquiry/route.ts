import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inquiries } from '@/db/schema';
import { sendInquiryAdminEmail, sendInquiryUserEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { firstName, lastName, email, phone, message } = data;

        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json({ error: 'All fields are required except phone' }, { status: 400 });
        }

        // Insert into db
        await db.insert(inquiries).values({
            firstName,
            lastName,
            email,
            phone,
            message,
        });

        // Send emails
        await Promise.all([
            sendInquiryAdminEmail({ firstName, lastName, email, phone, message }),
            sendInquiryUserEmail({ firstName, email }),
        ]);

        return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
    } catch (error) {
        console.error('Inquiry submission error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
    }
}
