import type { Product } from "@/const/productData";

/** Loads products from `/api/products` (proxied to admin API) and maps category UUIDs to display names using `/api/categories`. */
export async function fetchProductsEnriched(): Promise<Product[]> {
    const [catRes, prodRes] = await Promise.all([
        fetch("/api/backend/categories"),
        fetch("/api/backend/products"),
    ]);
    if (!prodRes.ok) {
        throw new Error("Failed to load products");
    }
    const data: Product[] = await prodRes.json();
    let categoryMap: Record<string, string> = {};
    if (catRes.ok) {
        const cats = (await catRes.json()) as Array<{ id: string; title: string; is_active?: boolean }>;
        const activeCats = cats.filter((c) => c && c.is_active !== false);
        categoryMap = Object.fromEntries(activeCats.map((c) => [c.id, c.title]));
    }
    return data.map((p) => ({
        ...p,
        // Only expose active category titles. Inactive categories are intentionally omitted.
        categoryNames: (p.categories || []).map((id) => categoryMap[id]).filter(Boolean) as string[],
    }));
}
