import { useSelector } from "react-redux";

const Requests = () => {
  const sent = useSelector((state) => state.request?.sent ?? []);
  const received = useSelector((state) => state.request?.received ?? []);

  const hasAny = (sent?.length ?? 0) + (received?.length ?? 0) > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl bg-base-100 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Requests
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              Manage your incoming and outgoing connection requests.
            </p>
          </div>
          {hasAny && (
            <div className="mt-2 flex items-center gap-2 text-xs sm:mt-0">
              <span className="badge badge-outline">
                Sent: {sent.length ?? 0}
              </span>
              <span className="badge badge-outline">
                Received: {received.length ?? 0}
              </span>
            </div>
          )}
        </div>

        {!hasAny ? (
          <div className="mt-8 rounded-xl border border-dashed border-base-300 bg-base-200/60 p-8 text-center">
            <h2 className="text-base font-semibold text-base-content">
              No requests yet
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              When you send or receive connection requests, they will show up
              here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
                  {received.map((req) => (
                    <li
                      key={req._id ?? req.id}
                      className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-base-content">
                          {req.from?.firstName} {req.from?.lastName}
                        </p>
                        {req.from?.about && (
                          <p className="text-xs text-base-content/70">
                            {req.from.about}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-xs btn-primary"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost"
                        >
                          Ignore
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Outgoing
              </h2>
              {sent.length === 0 ? (
                <p className="mt-3 text-sm text-base-content/60">
                  No outgoing requests.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {sent.map((req) => (
                    <li
                      key={req._id ?? req.id}
                      className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-base-content">
                          {req.to?.firstName} {req.to?.lastName}
                        </p>
                        {req.to?.about && (
                          <p className="text-xs text-base-content/70">
                            {req.to.about}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost text-error"
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
