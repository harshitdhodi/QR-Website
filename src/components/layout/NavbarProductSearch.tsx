'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'react-feather';
import type { Product } from '@/const/productData';

type ProductWithCategories = Product & { categoryNames?: string[] };

function slugForProduct(p: Product) {
  return p.slug || p.title.toLowerCase().replace(/\s+/g, '-');
}

export default function NavbarProductSearch({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch {
        /* ignore */
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const title = (p.title || '').toLowerCase();
        const sub = (p.subtitle || '').toLowerCase();
        const cats = [...(p.categories || []), ...((p as ProductWithCategories).categoryNames || [])]
          .join(' ')
          .toLowerCase();
        return title.includes(q) || sub.includes(q) || cats.includes(q);
      })
      .slice(0, 8);
  }, [query, products]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const closeAndClear = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  return (
    <div ref={wrapRef} className={`relative w-full min-w-0 ${className}`}>
      <label htmlFor="navbar-product-search" className="sr-only">
        Search products
      </label>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400 pointer-events-none shrink-0" size={18} />
        <input
          id="navbar-product-search"
          type="search"
          autoComplete="off"
          placeholder="Search products"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filtered[0]) {
              e.preventDefault();
              const slug = slugForProduct(filtered[0]);
              closeAndClear();
              router.push(`/shop/${slug}`);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          className="w-full min-w-0 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-[min(20rem,70vh)] w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">No products found.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const slug = slugForProduct(p);
                return (
                  <li key={p.id}>
                    <Link
                      href={`/shop/${slug}`}
                      onClick={closeAndClear}
                      className="flex w-full min-w-0 items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-50"
                    >
                      <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={p.imgOne}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="min-w-0 flex-1 font-medium text-gray-900 line-clamp-2">{p.title}</span>
                      <span className="shrink-0 text-gray-600 tabular-nums">₹{Number(p.price).toLocaleString()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-gray-100 px-2 py-1.5 text-center">
            <Link
              href="/shop"
              className="text-xs font-medium text-brand-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              View all in shop
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
