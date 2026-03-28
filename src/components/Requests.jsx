import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import {
  removeReceivedRequest,
  setReceivedRequests,
  setRequestError,
} from "../utils/requestSlice";

const fromUser = (req) => req?.fromUserId ?? req?.fromUser ?? req?.from ?? req?.user;

const senderProfileId = (req) => {
  const fu = req?.fromUserId;
  if (fu == null) return null;
  if (typeof fu === "string" || typeof fu === "number") return String(fu);
  if (typeof fu === "object") return fu._id ?? fu.id ?? null;
  return null;
};

const Requests = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const received = useSelector((state) => {
    const r = state.request?.received;
    return Array.isArray(r) ? r : [];
  });
  const loadError = useSelector((state) => state.request?.error);

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeReceivedRequest({ _id: requestId }));
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.message ??
        "Could not review request.";
      dispatch(setRequestError(msg));
    }
  };

  useEffect(() => {
    if (!user) return;
    if (received.length > 0) return;

    let cancelled = false;

    (async () => {
      dispatch(setRequestError(null));
      try {
        let res;
        try {
          res = await axios.get(`${BASE_URL}/user/requests/received`, {
            withCredentials: true,
          });
        } catch (e) {
          if (e.response?.status !== 404) throw e;
          // Some backends use the typo `recieved` in route naming.
          res = await axios.get(`${BASE_URL}/user/requests/recieved`, {
            withCredentials: true,
          });
        }
        if (cancelled) return;
        const payload =
          res.data?.connectionRequests ?? res.data?.received ?? res.data ?? [];
        dispatch(setReceivedRequests(payload));
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 401) return;
        const msg =
          err.response?.data?.message ?? err.message ?? "Could not load requests.";
        dispatch(setRequestError(msg));
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, received.length, dispatch]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          Sign in to see requests
        </h1>
        <p className="text-sm text-base-content/70">
          Log in to manage incoming and outgoing connection requests.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  const hasAny = received.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl bg-base-100 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Requests
            </h1>
            <p className="mt-1 text-sm text-base-content/70">Review incoming friend requests.</p>
          </div>
          {hasAny && (
            <div className="mt-2 flex items-center gap-2 text-xs sm:mt-0">
              <span className="badge badge-outline">
                Received: {received.length}
              </span>
            </div>
          )}
        </div>

        {loadError && (
          <p className="mt-4 text-center text-sm text-error">{loadError}</p>
        )}

        {!hasAny && !loadError ? (
          <div className="mt-8 rounded-xl border border-dashed border-base-300 bg-base-200/60 p-8 text-center">
            <h2 className="text-base font-semibold text-base-content">
              No requests yet
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              No requests found.
            </p>
          </div>
        ) : null}

        {hasAny ? (
          <div className="mt-8">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Incoming
              </h2>
              {received.length === 0 ? (
                <p className="mt-3 text-sm text-base-content/60">
                  No incoming requests.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {received.map((req) => {
                    const other = fromUser(req);
                    const profileId = senderProfileId(req);
                    return (
                      <li
                        key={req._id ?? req.id}
                        className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-base-content">
                            {other?.firstName} {other?.lastName}
                          </p>
                          {other?.about && (
                            <p className="text-xs text-base-content/70">
                              {other.about}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {profileId ? (
                            <Link
                              to={`/requests/person/${profileId}`}
                              className="btn btn-xs btn-ghost text-primary"
                            >
                              View profile
                            </Link>
                          ) : null}
                          <button
                            type="button"
                            className="btn btn-xs btn-primary"
                            onClick={() =>
                              reviewRequest("accepted", req._id ?? req.id)
                            }
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-ghost"
                            onClick={() =>
                              reviewRequest("rejected", req._id ?? req.id)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Requests;
