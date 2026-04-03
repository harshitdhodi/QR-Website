import { NextResponse } from 'next/server';
import { products } from '@/const/productData';

export async function GET() {
  return NextResponse.json(products);
}
