"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSWrapper() {
    useEffect(() => {
        AOS.init({
            duration: 650,
            once: true,
            easing: "ease-out-cubic",
            offset: 48,
            delay: 0,
        });
    }, []);

    return null; // this component doesn't render anything
}
