import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { customers, orders, orderItems, addresses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createShiprocketOrder } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentMethod, guestEmail, guestName, guestPhone, address } = body;
    const session = await getServerSession(authOptions);

    let customer;
    let customerAddresses: any[] = [];

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
        const [newCustomer] = await db
          .insert(customers)
          .values({ name: guestName, email: guestEmail, phone: guestPhone })
          .$returningId();

        customer = { id: newCustomer.id, name: guestName, email: guestEmail, phone: guestPhone };
      }
    }

    // Resolve shipping address: use provided address, or fall back to first saved address
    const shippingAddress = address ?? customerAddresses?.[0];

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    // Create order in DB and trigger Shiprocket
    const { orderId, shiprocketResponse } = await db.transaction(async (tx) => {
      const [orderResult] = await tx.insert(orders).values({
        customerId: customer.id,
        amount: totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod,
      });

      const newOrderId = orderResult.insertId;

      await tx.insert(orderItems).values(
        items.map((item: any) => ({
          orderId: newOrderId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      // Create Shiprocket order
      const shiprocketResponse = await createShiprocketOrder({
        order_id: String(newOrderId),
        order_date: new Date().toISOString().split('T')[0],
        billing_customer_name: customer.name,
        billing_email: customer.email,
        billing_phone: customer.phone,
        billing_address: shippingAddress.street,
        billing_city: shippingAddress.city,
        billing_state: shippingAddress.state,
        billing_pincode: shippingAddress.pincode,
        billing_country: shippingAddress.country ?? 'India',
        shipping_is_billing: true,
        payment_method: paymentMethod === 'COD' ? 'COD' : 'Prepaid',
        sub_total: totalAmount,
        order_items: items.map((item: any) => ({
          name: item.name,
          sku: item.sku,
          units: item.quantity,
          selling_price: item.price,
        })),
      });

      return { orderId: newOrderId, shiprocketResponse };
    });

    return NextResponse.json({
      success: true,
      orderId,
      shiprocketOrderId: shiprocketResponse?.order_id ?? null,
      requiresAuth: !session?.user?.email,
      message: session?.user?.email
        ? 'Order created successfully'
        : 'Please register to complete your order',
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
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