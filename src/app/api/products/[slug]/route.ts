import { NextResponse } from 'next/server';
import { products } from '@/const/productData';
import type { Product } from '@/const/productData';

function slugForProduct(p: Product) {
  return p.slug || p.title.toLowerCase().replace(/\s+/g, '-');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = products.find((p) => slugForProduct(p) === slug);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}
