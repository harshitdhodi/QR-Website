import axios from 'axios';
import { ShiprocketOrderData } from '@/types';

const API_URL = process.env.SHIPROCKET_API_URL;
const EMAIL = process.env.SHIPROCKET_EMAIL ?? 'harshit@rndtechnosoft.com';
const PASSWORD = 'HnwWhPOsc#p^74PzWyiNkkzTN#$aR9mE';

let token: string | null = null;

// ─── State normalizer ─────────────────────────────────────────────────────────
const STATE_MAP: Record<string, string> = {
  AN: 'Andaman & Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  CH: 'Chandigarh',
  DD: 'Daman & Diu',
  DL: 'Delhi',
  DN: 'Dadra & Nagar Haveli',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu & Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TG: 'Telangana',
  TN: 'Tamil Nadu',
  TR: 'Tripura',
  UK: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
};

export const normalizeState = (state: string): string => {
  if (!state) return '';
  if (!state.includes(',') && state.length > 2) return state;
  const parts = state.split(',').map((p) => p.trim());
  const stateCode = parts[parts.length - 1].toUpperCase();
  return STATE_MAP[stateCode] ?? state;
};

export const normalizeAddress = (address: string, city: string, state: string): string => {
  if (!address) return '';
  let normalizedAddress = address;
  normalizedAddress = normalizedAddress.replace(new RegExp(state, 'gi'), '');
  normalizedAddress = normalizedAddress.replace(new RegExp(city, 'gi'), '');
  normalizedAddress = normalizedAddress.replace(/\b\d{6}\b/g, '');
  normalizedAddress = normalizedAddress
    .replace(/,\s*,/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s+$/g, '')
    .trim();
  return normalizedAddress;
};

export const normalizeCity = (city: string): string => {
  if (!city) return '';
  return city.replace(/\s*\(.*?\)$/g, '').trim();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const getShiprocketToken = async (): Promise<string> => {
  if (token) return token;

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD,
    });
    token = response.data.token;
    return token as string;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Shiprocket Login Error:', error.response?.data);
    } else {
      console.error('Shiprocket Login Error:', error);
    }
    console.error('Credentials used:', {
      email: EMAIL,
      password: PASSWORD ? '***set***' : 'MISSING',
    });
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

export const createShiprocketOrder = async (orderData: ShiprocketOrderData) => {
  const authToken = await getShiprocketToken();

  const normalizedCity = normalizeCity(orderData.billing_city);
  const normalizedState = normalizeState(orderData.billing_state);
  const normalizedAddress = normalizeAddress(
    orderData.billing_address,
    orderData.billing_city,
    orderData.billing_state
  );

  const payload = {
    // ─── Order Info ───────────────────────────────────────────────────────────
    order_id: orderData.order_id,
    order_date: orderData.order_date,
    pickup_location: orderData.pickup_location ?? 'Primary', // ✅ required by Shiprocket

    // ─── Billing ──────────────────────────────────────────────────────────────
    billing_customer_name: orderData.billing_customer_name,
    billing_last_name: orderData.billing_last_name ?? '',
    billing_address: normalizedAddress,
    billing_address_2: orderData.billing_address_2 ?? '',
    billing_city: normalizedCity,
    billing_state: normalizedState,
    billing_pincode: Number(orderData.billing_pincode),       // ✅ number, not string
    billing_country: orderData.billing_country ?? 'India',
    billing_email: orderData.billing_email,
    billing_phone: orderData.billing_phone,

    // ─── Shipping (empty when shipping_is_billing = true) ─────────────────────
    shipping_is_billing: true,
    shipping_customer_name: '',
    shipping_last_name: '',
    shipping_address: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_pincode: '',
    shipping_country: '',
    shipping_state: '',
    shipping_email: '',
    shipping_phone: '',

    // ─── Payment & Charges ────────────────────────────────────────────────────
    payment_method: orderData.payment_method,
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: orderData.sub_total,

    // ─── Dimensions ───────────────────────────────────────────────────────────
    length: orderData.length ?? 10,
    breadth: orderData.breadth ?? 10,
    height: orderData.height ?? 5,
    weight: orderData.weight ?? 0.5,

    // ─── Items ────────────────────────────────────────────────────────────────
    order_items: orderData.order_items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: Number(item.selling_price),              // ✅ number, not string
      discount: item.discount ?? '',
      tax: item.tax ?? '',
      hsn: item.hsn ?? '',
    })),
  };

  console.log('Shiprocket payload:', JSON.stringify(payload, null, 2));

  const sendRequest = async (tkn: string) =>
    axios.post(`${API_URL}/orders/create/adhoc`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tkn}`,
      },
    });

  try {
    const response = await sendRequest(authToken);
    return response.data;
  } catch (error: unknown) {
    // Retry once on token expiry
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      token = null;
      const newToken = await getShiprocketToken();
      const response = await sendRequest(newToken);
      return response.data;
    }

    if (axios.isAxiosError(error)) {
      console.error(
        'Shiprocket Create Order Error:',
        JSON.stringify(error.response?.data, null, 2) ?? error.message
      );
      throw new Error(
        error.response?.data?.message || 'Failed to create order in Shiprocket'
      );
    }

    throw error;
  }
};