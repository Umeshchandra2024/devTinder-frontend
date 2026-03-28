import axios from "axios";
import { BASE_URL } from "./constants";

/**
 * Tries common DevTinder / Namaste route shapes until one works (404 = try next).
 * Override with env if yours is different:
 *   VITE_API_REQUESTS_COMBINED=/your/combined
 *   VITE_API_REQUESTS_RECEIVED=/your/received  +  VITE_API_REQUESTS_SENT=/your/sent
 */
const COMBINED_PATHS = [
  import.meta.env.VITE_API_REQUESTS_COMBINED,
  "/user/requests",
  "/user/connectionRequests",
].filter(Boolean);

const SPLIT_PATH_PAIRS = [
  import.meta.env.VITE_API_REQUESTS_RECEIVED &&
  import.meta.env.VITE_API_REQUESTS_SENT
    ? [
        import.meta.env.VITE_API_REQUESTS_RECEIVED,
        import.meta.env.VITE_API_REQUESTS_SENT,
      ]
    : null,
  ["/request/received", "/request/sent"],
  ["/user/request/received", "/user/request/sent"],
  ["/user/request/incoming", "/user/request/outgoing"],
  ["/request/incoming", "/request/outgoing"],
  ["/user/receivedRequests", "/user/sentRequests"],
  ["/user/receivedConnectionRequests", "/user/sentConnectionRequests"],
  ["/user/requests/received", "/user/requests/sent"],
].filter(Boolean);

const RECEIVED_ONLY_PATHS = [
  import.meta.env.VITE_API_REQUESTS_RECEIVED,
  "/user/requests/received",
  "/user/request/received",
  "/request/received",
  "/request/incoming",
].filter(Boolean);

/**
 * @returns {{ kind: "bundle", data: unknown } | { kind: "split", received: unknown, sent: unknown }}
 */
export async function fetchConnectionRequestsData() {
  for (const path of COMBINED_PATHS) {
    try {
      const res = await axios.get(`${BASE_URL}${path}`, {
        withCredentials: true,
      });
      return { kind: "bundle", data: res.data };
    } catch (e) {
      if (e.response?.status === 404) continue;
      throw e;
    }
  }

  for (const pair of SPLIT_PATH_PAIRS) {
    const [receivedPath, sentPath] = pair;
    try {
      const [recvRes, sentRes] = await Promise.all([
        axios.get(`${BASE_URL}${receivedPath}`, { withCredentials: true }),
        axios.get(`${BASE_URL}${sentPath}`, { withCredentials: true }),
      ]);
      return {
        kind: "split",
        received: recvRes.data,
        sent: sentRes.data,
      };
    } catch (e) {
      if (e.response?.status === 404) continue;
      throw e;
    }
  }

  // Some backends only expose received/incoming requests list.
  for (const receivedPath of RECEIVED_ONLY_PATHS) {
    try {
      const recvRes = await axios.get(`${BASE_URL}${receivedPath}`, {
        withCredentials: true,
      });
      return {
        kind: "split",
        received: recvRes.data,
        sent: [],
      };
    } catch (e) {
      if (e.response?.status === 404) continue;
      throw e;
    }
  }

  const err = new Error(
    "No matching connection-requests routes. Set VITE_API_REQUESTS_* in .env or add your paths in src/utils/requestApi.js."
  );
  err.code = "REQUEST_ROUTES_NOT_FOUND";
  throw err;
}
