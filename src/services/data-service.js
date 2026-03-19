// Data service boundary: reusable data-access helpers for future extraction from app.js.
export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}
