import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BASE_URL,
  API_USER_CONNECTIONS,
} from "../utils/constants";
import { unwrapConnectionProfile } from "../utils/apiNormalize";
import {
  setConnections,
  setConnectionError,
} from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const connections = useSelector((state) => {
    const list = state.connection?.list;
    return Array.isArray(list) ? list : [];
  });
  const loadError = useSelector((state) => state.connection?.error);

  useEffect(() => {
    if (!user) return;
    if (connections.length > 0) return;

    let cancelled = false;

    (async () => {
      dispatch(setConnectionError(null));
      try {
        const res = await axios.get(`${BASE_URL}${API_USER_CONNECTIONS}`, {
          withCredentials: true,
        });
        if (!cancelled) dispatch(setConnections(res.data));
      } catch (err) {
        if (!cancelled && err.response?.status !== 401) {
          dispatch(
            setConnectionError(
              err.response?.data?.message ??
                "Could not load connections. Check API path in constants.js."
            )
          );
          console.error(err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, connections.length, dispatch]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          Sign in to see connections
        </h1>
        <p className="text-sm text-base-content/70">
          Log in to load people you&apos;re connected with.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  const hasConnections = connections.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl bg-base-100 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Connections
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              People you&apos;re connected with on DevTinder.
            </p>
          </div>
          {hasConnections && (
            <span className="badge badge-primary mt-2 self-start sm:mt-0">
              {connections.length} active
            </span>
          )}
        </div>

        {loadError && (
          <p className="mt-4 text-center text-sm text-error">{loadError}</p>
        )}

        {!hasConnections && !loadError ? (
          <div className="mt-8 rounded-xl border border-dashed border-base-300 bg-base-200/60 p-8 text-center">
            <h2 className="text-base font-semibold text-base-content">
              No connections yet
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Start sending requests to developers from your feed to build your
              network.
            </p>
          </div>
        ) : null}

        {hasConnections ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((conn) => {
              const profile = unwrapConnectionProfile(conn);
              const key = conn._id ?? conn.id ?? profile?._id ?? profile?.id;
              const profileId =
                profile?._id ??
                profile?.id ??
                conn?.toUserId?._id ??
                conn?.toUserId?.id ??
                conn?.fromUserId?._id ??
                conn?.fromUserId?.id;
              return (
                <article
                  key={key}
                  className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
                >
                  <div className="card-body gap-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            alt=""
                            src={
                              profile?.photoURL ||
                              profile?.photoUrl ||
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="font-semibold text-base-content">
                          {profile?.firstName} {profile?.lastName}
                        </h2>
                        {profile?.title && (
                          <p className="text-xs text-base-content/70">
                            {profile.title}
                          </p>
                        )}
                      </div>
                    </div>
                    {profile?.about && (
                      <p className="line-clamp-2 text-sm text-base-content/80">
                        {profile.about}
                      </p>
                    )}
                    {Array.isArray(profile?.skills) &&
                      profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 5).map((skill, idx) => (
                            <span
                              key={idx}
                              className="badge badge-sm badge-outline text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="card-actions justify-end pt-1">
                      <Link
                        to={profileId ? `/connections/${profileId}` : "/connections"}
                        className="btn btn-ghost btn-xs text-primary"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Connections;
