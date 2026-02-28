"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const quantities = [1, 2, 3, 4, 5, 10]

export default function QuantityDropdown({ quantity, setQuantity }: { quantity: number, setQuantity: (q: number) => void }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-20" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-base font-medium focus:outline-none focus:border-blue-900 bg-white"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{quantity}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Options */}
            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden" role="listbox">
                    {quantities.map((q) => (
                        <li
                            key={q}
                            onClick={() => { setQuantity(q); setOpen(false) }}
                            className={`px-3 py-2 text-base font-medium cursor-pointer hover:bg-blue-50 transition-colors ${quantity === q ? "bg-blue-100 text-blue-900" : "text-gray-700"
                                }`}
                            role="option"
                            aria-selected={quantity === q}
                        >
                            {q}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
