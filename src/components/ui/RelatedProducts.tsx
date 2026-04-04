"use client";

import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import type { Product } from "@/const/productData";
import { fetchProductsEnriched } from "@/lib/fetchProductsClient";
import ProductCard from "@/components/ui/ProductCard";

export default function RelatedProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProductsEnriched()
            .then(setProducts)
            .catch((e) => console.error("Related products:", e));
    }, []);

    return (
    <div className="splide slider-no-dots slider-arrows-white four-slider" id="related-product">
            <Splide
                options={{
                    perPage: 4,
                    perMove: 1,
                    gap: "1rem",
                    pagination: false,
                    arrows: true,
                    breakpoints: {
                        1280: { perPage: 3 },
                        1024: { perPage: 2 },
                        640: { perPage: 1 },
                    },
                }}
                aria-label="Related Products"
            >
                {products.map((product: Product) => (
                    <SplideSlide key={product.id} className="me-3">
                        <ProductCard key={product.id} product={product}  />
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
}
