import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { fetchCurrentUser } from "../utils/userApi";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmailId("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setError("");
  };

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!emailId.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      const userPayload = res.data?.user ?? res.data?.data ?? res.data;
      dispatch(addUser(userPayload));
      try {
        const fullUser = await fetchCurrentUser();
        dispatch(addUser(fullUser));
      } catch {
        /* keep login payload if profile view fails */
      }
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message?.toLowerCase() ?? "";
      const isUnauthorized =
        status === 401 ||
        status === 404 ||
        /invalid|not found|no user|unauthorized|wrong credentials/.test(
          message
        );
      if (isUnauthorized) {
        setError(
          "No account found. Only registered users can log in. Please sign up first."
        );
        setIsSignUp(true);
        setFirstName("");
        setLastName("");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim() || !emailId.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      const userPayload = res.data?.user ?? res.data?.data ?? res.data;
      dispatch(addUser(userPayload));
      try {
        const fullUser = await fetchCurrentUser();
        dispatch(addUser(fullUser));
      } catch {
        /* keep signup payload if profile view fails */
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Sign up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleLogin;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl">
              {isSignUp ? "Create account" : "Login"}
            </h2>
            <p className="text-center text-sm text-base-content/70">
              {isSignUp
                ? "Join DevTinder and connect with developers"
                : "Welcome back to DevTinder"}
            </p>
            {!isSignUp && (
              <p className="text-center text-xs text-base-content/60">
                Only registered users can log in. New? Use Sign up.
              </p>
            )}

            {/* Toggle: Login / Sign up */}
            <div className="flex justify-center gap-2 rounded-lg bg-base-200 p-1">
              <button
                type="button"
                onClick={() => !isSignUp || handleToggle()}
                className={`btn btn-sm flex-1 ${
                  !isSignUp ? "btn-primary" : "btn-ghost"
                }`}
                aria-pressed={!isSignUp}
                aria-label="Login"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => isSignUp || handleToggle()}
                className={`btn btn-sm flex-1 ${
                  isSignUp ? "btn-primary" : "btn-ghost"
                }`}
                aria-pressed={isSignUp}
                aria-label="Sign up"
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error"
                >
                  {error}
                </div>
              )}

              {isSignUp && (
                <>
                  <div className="form-control">
                    <label className="label" htmlFor="signup-firstName">
                      <span className="label-text">First name</span>
                    </label>
                    <input
                      id="signup-firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-bordered w-full"
                      autoComplete="given-name"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="signup-lastName">
                      <span className="label-text">Last name</span>
                    </label>
                    <input
                      id="signup-lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input input-bordered w-full"
                      autoComplete="family-name"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="form-control">
                <label className="label" htmlFor="login-email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="input input-bordered w-full"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="login-password">
                  <span className="label-text">Password</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder={isSignUp ? "Min. 6 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  disabled={loading}
                />
              </div>

              <div className="card-actions mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading
                    ? isSignUp
                      ? "Creating account…"
                      : "Logging in…"
                    : isSignUp
                      ? "Sign up"
                      : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
