import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { unwrapConnectionProfile } from "../utils/apiNormalize";

const getProfileId = (conn, profile) =>
  profile?._id ??
  profile?.id ??
  conn?.toUserId?._id ??
  conn?.toUserId?.id ??
  conn?.fromUserId?._id ??
  conn?.fromUserId?.id;

const ConnectionProfile = () => {
  const { id } = useParams();
  const connections = useSelector((state) =>
    Array.isArray(state.connection?.list) ? state.connection.list : []
  );

  const selected = connections.find((conn) => {
    const profile = unwrapConnectionProfile(conn);
    return String(getProfileId(conn, profile) ?? "") === String(id);
  });
  const profile = selected ? unwrapConnectionProfile(selected) : null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-base-100 p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-base-content">
            Connection not found
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Go back to connections and open a profile card again.
          </p>
          <Link to="/connections" className="btn btn-primary mt-4">
            Back to connections
          </Link>
        </div>
      </div>
    );
  }

  const photo =
    profile.photoURL ||
    profile.photoUrl ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img src={photo} alt={`${profile.firstName ?? ""} profile`} />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-base-content">
              {profile.firstName} {profile.lastName}
            </h1>
            {profile.age && profile.gender ? (
              <p className="mt-1 text-sm text-base-content/70">
                {profile.age} • {profile.gender}
              </p>
            ) : null}
            {profile.about ? (
              <p className="mt-3 text-base text-base-content/85">{profile.about}</p>
            ) : null}
            {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-outline">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6">
          <Link to="/connections" className="btn btn-ghost btn-sm">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConnectionProfile;
