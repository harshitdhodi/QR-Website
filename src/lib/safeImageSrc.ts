export function safeImageSrc(src: string) {
  // next/image can choke on spaces and some characters in string URLs.
  // Encode only the path portion for local assets.
  if (!src) return src;
  // If it's an absolute URL, encode pathname only.
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const u = new URL(src);
      u.pathname = u.pathname
        .split("/")
        .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
        .join("/");
      return u.toString();
    } catch {
      return src;
    }
  }
  return src
    .split("/")
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join("/");
}

