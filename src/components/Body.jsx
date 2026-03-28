import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavBar from "./Navbar";
import Footer from "./footer";
import { addUser } from "../utils/userSlice";
import { fetchCurrentUser } from "../utils/userApi";

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await fetchCurrentUser();
        if (!cancelled && u) dispatch(addUser(u));
      } catch {
        /* no valid session cookie */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
