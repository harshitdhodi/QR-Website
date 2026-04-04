import type { Product } from "@/const/productData";

/** Loads products from `/api/products` (proxied to admin API) and maps category UUIDs to display names using `/api/categories`. */
export async function fetchProductsEnriched(): Promise<Product[]> {
    const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
    ]);
    if (!prodRes.ok) {
        throw new Error("Failed to load products");
    }
    const data: Product[] = await prodRes.json();
    let categoryMap: Record<string, string> = {};
    if (catRes.ok) {
        const cats: { id: string; title: string }[] = await catRes.json();
        categoryMap = Object.fromEntries(cats.map((c) => [c.id, c.title]));
    }
    return data.map((p) => ({
        ...p,
        categoryNames: (p.categories || []).map((id) => categoryMap[id] || id),
    }));
}
