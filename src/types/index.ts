import { Product } from "@/const/productData";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    name: string;
    email: string;
    country: string;
}

export interface OrderItem {
    name: string;
    sku: string;
    quantity: number;
    price: number;
}

export interface UserAddress {
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string | null;
    phone: string;
    customerId: string;
}

export interface ShiprocketOrderData {
    order_id: string;
    order_date: string;
    pickup_location?: string;
    billing_customer_name: string;
    billing_last_name?: string;
    billing_address: string;
    billing_address_2?: string;
    billing_city: string;
    billing_state: string;
    billing_pincode: number | string;
    billing_country?: string;
    billing_email: string;
    billing_phone: string;
    payment_method: string;
    shipping_charges?: number;
    giftwrap_charges?: number;
    transaction_charges?: number;
    total_discount?: number;
    sub_total: number;
    length?: number;
    breadth?: number;
    height?: number;
    weight?: number;
    order_items: {
        name: string;
        sku: string;
        units: number;
        selling_price: number | string;
        discount?: string;
        tax?: string;
        hsn?: string;
    }[];
}
