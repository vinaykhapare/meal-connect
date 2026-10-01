export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN !== undefined
    ? import.meta.env.VITE_API_ORIGIN
    : (import.meta.env.PROD ? "" : "http://localhost:3000");

