import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayName =
    user?.firstName ??
    user?.first_name ??
    user?.user?.firstName ??
    user?.user?.first_name ??
    user?.data?.firstName ??
    user?.data?.first_name ??
    user?.name ??
    "";

  const avatarUrl =
    user?.photoURL ||
    user?.avatar ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
    } catch (_) {
      // ignore logout network errors on client
    } finally {
      dispatch(removeUser());
      dispatch(removeFeed());
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 text-base-content backdrop-blur">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="flex-1">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            aria-label="DevTinder home"
          >
            DevTinder 🔥
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden rounded-xl bg-base-200 px-4 py-2 text-sm font-semibold text-primary shadow-sm sm:block">
              👋 Welcome{displayName ? `, ${displayName}` : ""}
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:bg-base-200 transition-colors"
                aria-label="User menu"
              >
                <div className="w-10 rounded-full border border-base-300">
                  <img alt="User avatar" src={avatarUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content right-0 z-50 mt-3 w-52 rounded-md border border-base-300 bg-base-100 p-2 text-base-content shadow-lg"
              >
                <li>
                  <Link
                    to="/profile"
                    className="justify-between rounded-md p-2 hover:bg-base-200"
                  >
                    Profile{" "}
                    <span className="badge badge-success badge-sm">Edit</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="justify-between rounded-md p-2 hover:bg-base-200"
                  >
                    Connections{" "}
                    <span className="badge badge-error badge-sm">💗</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="justify-between rounded-md p-2 hover:bg-base-200"
                  >
                    Requests{" "}
                    <span className="badge badge-warning badge-sm">👁️</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md p-2 text-left text-error hover:bg-base-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;
