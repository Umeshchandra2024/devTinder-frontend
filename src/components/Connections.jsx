import { useSelector } from "react-redux";

const Connections = () => {
  const connections = useSelector((state) => state.connection?.list ?? []);

  const hasConnections = connections && connections.length > 0;

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

        {!hasConnections ? (
          <div className="mt-8 rounded-xl border border-dashed border-base-300 bg-base-200/60 p-8 text-center">
            <h2 className="text-base font-semibold text-base-content">
              No connections yet
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Start sending requests to developers from your feed to build your
              network.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((conn) => (
              <article
                key={conn._id ?? conn.id}
                className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
              >
                <div className="card-body gap-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="w-10 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-semibold">
                          {(conn.firstName ?? conn.name ?? "?")
                            .toString()
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="font-semibold text-base-content">
                        {conn.firstName} {conn.lastName}
                      </h2>
                      {conn.title && (
                        <p className="text-xs text-base-content/70">
                          {conn.title}
                        </p>
                      )}
                    </div>
                  </div>
                  {conn.about && (
                    <p className="line-clamp-2 text-sm text-base-content/80">
                      {conn.about}
                    </p>
                  )}
                  {Array.isArray(conn.skills) && conn.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {conn.skills.slice(0, 5).map((skill, idx) => (
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
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-primary"
                    >
                      View profile
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;