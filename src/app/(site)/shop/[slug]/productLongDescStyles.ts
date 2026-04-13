/** Scoped styles for CMS HTML inside product detail accordion. */
export const PRODUCT_LONG_DESC_CSS = `
.product-longdesc {
  font-family: var(--font-dm, 'DM Sans', sans-serif);
  font-size: 0.875rem;
  line-height: 1.7;
  color: #475569;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
@media (min-width: 768px) {
  .product-longdesc {
    font-size: 0.9375rem;
    line-height: 1.85;
  }
}
.product-longdesc p { margin-bottom: 0.875rem; }
.product-longdesc img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
.product-longdesc h1,
.product-longdesc h2,
.product-longdesc h3,
.product-longdesc h4 {
  font-weight: 600;
  color: #0f172a;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.35;
}
.product-longdesc h1:first-child,
.product-longdesc h2:first-child,
.product-longdesc h3:first-child { margin-top: 0; }
.product-longdesc h1 { font-size: 1.2rem; }
.product-longdesc h2 { font-size: 1.1rem; }
.product-longdesc h3 { font-size: 1.05rem; }
@media (min-width: 768px) {
  .product-longdesc h1 { font-size: 1.35rem; }
  .product-longdesc h2 { font-size: 1.2rem; }
  .product-longdesc h3 { font-size: 1.1rem; }
}
.product-longdesc ul,
.product-longdesc ol {
  padding-left: 1.25rem;
  margin-bottom: 0.875rem;
}
.product-longdesc ul { list-style-type: disc; }
.product-longdesc ol { list-style-type: decimal; }
.product-longdesc li { margin-bottom: 0.3rem; }
.product-longdesc strong,
.product-longdesc b { font-weight: 600; color: #1e293b; }
.product-longdesc a {
  color: #1e3a8a;
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-word;
}
.product-longdesc a:hover { color: #172554; }
.product-longdesc blockquote {
  border-left: 3px solid #1e3a8a;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
}
.product-longdesc .table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 0.875rem;
}
.product-longdesc table {
  width: 100%;
  min-width: 320px;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.product-longdesc th,
.product-longdesc td {
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.65rem;
  text-align: left;
}
.product-longdesc th {
  background: #f1f5f9;
  font-weight: 600;
  color: #0f172a;
}
.product-longdesc tr:nth-child(even) td { background: #f8fafc; }
.product-longdesc hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.25rem 0;
}
.product-longdesc code {
  background: #f1f5f9;
  border-radius: 4px;
  padding: 0.1em 0.35em;
  font-size: 0.875em;
  color: #1e293b;
  word-break: break-word;
}
`;
