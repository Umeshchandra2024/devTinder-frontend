import axios from "axios";
import { BASE_URL } from "./constants";

/**
 * Full logged-in user from the API (login/signup payloads are often minimal).
 * Backend: GET /profile/view + userAuth (Namaste DevTinder pattern).
 */
export async function fetchCurrentUser() {
  const res = await axios.get(`${BASE_URL}/profile/view`, {
    withCredentials: true,
  });
  return res.data?.user ?? res.data?.data ?? res.data;
}
