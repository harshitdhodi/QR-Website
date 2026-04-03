'use client';

import { useEffect } from 'react';

/** Ensures the app stays in light mode (no dark class on body). */
export default function ForceLightTheme() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
