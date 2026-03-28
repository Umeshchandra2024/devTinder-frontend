import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const senderIdFromRequest = (req) => {
  const fu = req?.fromUserId;
  if (fu == null) return null;
  if (typeof fu === "string" || typeof fu === "number") return String(fu);
  return String(fu._id ?? fu.id ?? "");
};

const RequestSenderProfile = () => {
  const { id } = useParams();
  const received = useSelector((state) =>
    Array.isArray(state.request?.received) ? state.request.received : []
  );

  const request = received.find(
    (r) => senderIdFromRequest(r) === String(id)
  );
  const profile = request?.fromUserId;
  const sender =
    profile && typeof profile === "object" && profile.firstName != null
      ? profile
      : null;

  if (!sender) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-base-100 p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-base-content">
            Profile not available
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Open this from your requests list, or go back and try again.
          </p>
          <Link to="/requests" className="btn btn-primary mt-4">
            Back to requests
          </Link>
        </div>
      </div>
    );
  }

  const photo =
    sender.photoURL ||
    sender.photoUrl ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img
                src={photo}
                alt={`${sender.firstName ?? ""} profile`}
              />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-base-content">
              {sender.firstName} {sender.lastName}
            </h1>
            {sender.age != null && sender.gender ? (
              <p className="mt-1 text-sm text-base-content/70">
                {sender.age} • {sender.gender}
              </p>
            ) : null}
            {sender.about ? (
              <p className="mt-3 text-base text-base-content/85">
                {sender.about}
              </p>
            ) : null}
            {Array.isArray(sender.skills) && sender.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sender.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-outline">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6">
          <Link to="/requests" className="btn btn-ghost btn-sm">
            Back to requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestSenderProfile;
