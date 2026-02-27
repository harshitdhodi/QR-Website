import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { customers, orders, orderItems, addresses } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { createShiprocketOrder } from '@/lib/shiprocket';
import { randomUUID } from 'crypto';
import { OrderItem } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentMethod, guestEmail, guestName, guestPhone, address } = body;
    const session = await getServerSession(authOptions);

    let customer;
    let customerAddresses: (typeof addresses.$inferSelect)[] = [];

    if (session?.user?.email) {
      // Authenticated user — avoid LATERAL join by querying separately
      customer = await db
        .select()
        .from(customers)
        .where(eq(customers.email, session.user.email))
        .limit(1)
        .then((rows) => rows[0]);

      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      // Fetch addresses separately (MariaDB doesn't support LATERAL joins)
      customerAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.customerId, customer.id));

      console.log('customerAddresses', customerAddresses);
    } else {
      // Guest checkout
      if (!guestEmail || !guestName || !guestPhone) {
        return NextResponse.json({ error: 'Guest details required' }, { status: 400 });
      }

      customer = await db
        .select()
        .from(customers)
        .where(eq(customers.email, guestEmail))
        .limit(1)
        .then((rows) => rows[0]);

      if (!customer) {
        const newUserId = randomUUID();
        await db
          .insert(customers)
          .values({
            id: newUserId,
            name: guestName,
            email: guestEmail,
            phone: guestPhone
          });

        customer = {
          id: newUserId,
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        };
      }
    }

    // Resolve shipping address: use provided address, or fall back to first saved address
    const shippingAddress = address ?? customerAddresses?.[0];
    console.log('shippingAddress', shippingAddress);
    console.log('customer', customer);

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (acc: number, item: OrderItem) => acc + item.price * item.quantity,
      0
    );
    console.log('totalAmount', totalAmount);

    // Split customer name into first and last
    const nameParts = customer.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // fallback to first if no last name

    // Format order date as "YYYY-MM-DD HH:MM" (Shiprocket requires datetime, not date-only)
    const orderDate = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 16);

    // Create order in DB and trigger Shiprocket
    const { orderId, shiprocketResponse } = await db.transaction(async (tx) => {
      const newOrderId = randomUUID();

      // ✅ Use raw SQL insert to reliably get insertId on MariaDB
      await tx.execute(
        sql`INSERT INTO \`Order\` (id, customer_id, amount, status, paymentMethod)
  VALUES (${newOrderId}, ${customer.id}, ${totalAmount}, 'PENDING', ${paymentMethod})`
      );

      console.log('newOrderId', newOrderId);

      if (!newOrderId) {
        throw new Error('Order insert failed — ID is 0 or undefined');
      }

      await tx.insert(orderItems).values(
        items.map((item: OrderItem) => ({
          orderId: newOrderId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      // ─── Shiprocket Order ──────────────────────────────────────────────────
      const shiprocketResponse = await createShiprocketOrder({
        // Order info
        order_id: String(newOrderId),
        order_date: orderDate,                                    // ✅ "YYYY-MM-DD HH:MM"
        pickup_location: 'Primary',                               // ✅ required — match your Shiprocket dashboard

        // Billing
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_email: customer.email,
        billing_phone: customer.phone,
        billing_address: shippingAddress.street,
        billing_address_2: '',
        billing_city: shippingAddress.city,                       // normalized inside createShiprocketOrder
        billing_state: shippingAddress.state,                     // normalized inside createShiprocketOrder
        billing_pincode: Number(shippingAddress.pincode),         // ✅ number
        billing_country: shippingAddress.country ?? 'India',

        // Payment
        payment_method: paymentMethod === 'COD' ? 'COD' : 'Prepaid',

        // Charges
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: totalAmount,

        // Dimensions
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5,

        // Items
        order_items: items.map((item: OrderItem) => ({
          name: item.name,
          sku: item.sku,
          units: item.quantity,
          selling_price: Number(item.price),                      // ✅ number
          discount: '',
          tax: '',
          hsn: '',
        })),
      });

      console.log('shiprocketResponse', shiprocketResponse);

      return { orderId: newOrderId, shiprocketResponse };
    });

    console.log('orderId', orderId);

    return NextResponse.json({
      success: true,
      orderId,
      shiprocketOrderId: shiprocketResponse?.order_id ?? null,
      requiresAuth: !session?.user?.email,
      message: session?.user?.email
        ? 'Order created successfully'
        : 'Please register to complete your order',
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Checkout Error:', err);
    return NextResponse.json(
      { error: err.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, session.user.email),
      with: { orders: { with: { items: true }, orderBy: [desc(orders.createdAt)] } },
    });

    return NextResponse.json(customer?.orders || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}