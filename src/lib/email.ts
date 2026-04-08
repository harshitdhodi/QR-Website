import nodemailer from 'nodemailer';

function getTransporter() {
  const mode = (process.env.EMAIL_MODE || "").toLowerCase();
  if (mode === "mock") return null;

  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const secure = String(process.env.EMAIL_SECURE || "").toLowerCase() === "true";

  if (!host || !user || !pass) {
    throw new Error("Missing email configuration (EMAIL_HOST/EMAIL_USER/EMAIL_PASS).");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports
    auth: { user, pass },
  });
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const mode = (process.env.EMAIL_MODE || "").toLowerCase();
    if (mode === "mock") {
      console.log(`[EMAIL:MOCK] OTP for ${email}: ${otp}`);
      return { success: true, message: "OTP sent successfully (mock)" };
    }

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp-container {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            display: inline-block;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
          }
          .expiry {
            color: #6c757d;
            font-size: 14px;
            margin-top: 10px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
          }
          .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
          </div>
          <div class="content">
            <h2>Your One-Time Password (OTP)</h2>
            <p>Use the code below to verify your email address and complete your login.</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏰ This code will expire in 10 minutes</div>
            </div>
            
            <div class="security-note">
              <strong>🛡️ Security Notice:</strong><br>
              Never share this OTP with anyone. Our team will never ask for your OTP via phone or email.
            </div>
            
            <p>If you didn't request this code, please ignore this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your OTP Verification Code',
      html: htmlTemplate,
    };

    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[EMAIL:MOCK] OTP for ${email}: ${otp}`);
      return { success: true, message: "OTP sent successfully (mock)" };
    }

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send OTP email. Please check email settings.' };
  }
}

export async function sendInquiryAdminEmail(data: { firstName: string, lastName: string, email: string, phone?: string, message: string }) {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border: 1px solid #ddd; }
          h2 { color: #333; }
          .label { font-weight: bold; color: #555; }
          .detail { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Inquiry Received</h2>
          <p>You have a new inquiry from your website.</p>
          <div class="detail"><span class="label">Name:</span> ${data.firstName} ${data.lastName}</div>
          <div class="detail"><span class="label">Email:</span> ${data.email}</div>
          <div class="detail"><span class="label">Phone:</span> ${data.phone || 'N/A'}</div>
          <div class="detail"><span class="label">Message:</span><br/>${data.message.replace(/\n/g, '<br/>')}</div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Website System" <' + process.env.EMAIL_USER + '>',
      to: process.env.EMAIL_USER, // sending it to the admin
      subject: 'New Inquiry from ' + data.firstName + ' ' + data.lastName,
      html: htmlTemplate,
    };

    const transporter = getTransporter();
    if (!transporter) return { success: true };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Admin Email sending failed:', error);
    return { success: false, error };
  }
}

export async function sendInquiryUserEmail(data: { firstName: string, email: string }) {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border: 1px solid #ddd; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Thank you for your inquiry, ${data.firstName}!</h2>
          <p>We have successfully received your message.</p>
          <p>Our team is currently reviewing your request and will get back to you as soon as possible, usually within 24-48 business hours.</p>
          <p>If you have any further questions, simply reply to this email.</p>
          <br/>
          <p>Best regards,<br/>The Team</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Support Team" <' + process.env.EMAIL_USER + '>',
      to: data.email,
      subject: 'Thank you for contacting us',
      html: htmlTemplate,
    };

    const transporter = getTransporter();
    if (!transporter) return { success: true };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('User Email sending failed:', error);
    return { success: false, error };
  }
}

