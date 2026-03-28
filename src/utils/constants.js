/**
 * API base URL.
 * - Dev default: "/api" → Vite proxies to Render (cookies stay on localhost origin).
 * - Production: hosted API URL.
 * - Override anytime: VITE_API_URL in .env
 */
export const BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV
    ? "/api"
    : "https://devtinder-hg5f.onrender.com");

/** Connection list path; requests use fallbacks in `requestApi.js`. */
export const API_USER_CONNECTIONS = "/user/connections";
