import axios from 'axios';

const API_URL = process.env.SHIPROCKET_API_URL;
const EMAIL = process.env.SHIPROCKET_API_EMAIL;
const PASSWORD = process.env.SHIPROCKET_API_PASSWORD;

let token: string | null = null;

export const getShiprocketToken = async () => {
  if (token) return token;

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD,
    });
    token = response.data.token;
    return token;
  } catch (error: any) {
    // ✅ Log the actual Shiprocket response
    console.error('Shiprocket Login Error:', error.response?.data);
    console.error('Credentials used:', { email: EMAIL, password: PASSWORD ? '***set***' : 'MISSING' });
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

export const createShiprocketOrder = async (orderData: any) => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.post(
      `${API_URL}/orders/create/adhoc`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // Retry once if token expired
    if (error.response?.status === 401) {
      token = null;
      const newToken = await getShiprocketToken();
      const response = await axios.post(
        `${API_URL}/orders/create/adhoc`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
      return response.data;
    }
    
    console.error('Shiprocket Create Order Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create order in Shiprocket'
    );
  }
};