import { useRef, useState } from "react";

/** Min horizontal drag (px) to count as swipe */
const DIST_THRESHOLD = 85;
/** Quick flick: px per ms — fast throw counts even if distance is smaller */
const VELOCITY_THRESHOLD = 0.45;
/** With strong velocity, allow smaller travel */
const VELOCITY_ASSIST_MIN = 40;

const UserCard = ({ user, onSwipe, showActions = true }) => {
  if (!user) return null;
  const {
    firstName,
    lastName,
    photoURL,
    photoUrl,
    about,
    age,
    gender,
    skills = [],
  } = user;
  const imageSrc = photoURL || photoUrl;
  const skillList = Array.isArray(skills) ? skills : [];
  const userId = user?._id ?? user?.id;

  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const decidedRef = useRef(false);
  const draggingRef = useRef(false);
  /** Latest drag offset — must not read state in pointerup (stale closure) */
  const dragXRef = useRef(0);
  const lastMoveRef = useRef({ x: 0, t: 0 });
  const velocityRef = useRef(0);

  const handleDecision = (status) => {
    if (!onSwipe || !userId || decidedRef.current || !showActions) return;
    decidedRef.current = true;
    draggingRef.current = false;
    setIsDragging(false);
    setOffsetX(status === "interested" ? 520 : -520);
    setTimeout(() => {
      onSwipe({ status, userId });
    }, 220);
  };

  const onPointerDown = (e) => {
    if (!showActions || decidedRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startXRef.current = e.clientX;
    dragXRef.current = 0;
    velocityRef.current = 0;
    lastMoveRef.current = { x: e.clientX, t: performance.now() };
    draggingRef.current = true;
    setIsDragging(true);
    setOffsetX(0);

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || decidedRef.current) return;

    const now = performance.now();
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;

    const dt = now - lastMoveRef.current.t;
    if (dt > 0) {
      velocityRef.current =
        (e.clientX - lastMoveRef.current.x) / Math.max(dt, 1);
    }
    lastMoveRef.current = { x: e.clientX, t: now };

    setOffsetX(dx);
  };

  const endDrag = (e) => {
    if (!draggingRef.current || decidedRef.current) return;

    draggingRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }

    const x = dragXRef.current;
    const v = velocityRef.current;

    const flickRight = v > VELOCITY_THRESHOLD && x > VELOCITY_ASSIST_MIN;
    const flickLeft = v < -VELOCITY_THRESHOLD && x < -VELOCITY_ASSIST_MIN;

    if (x >= DIST_THRESHOLD || flickRight) {
      handleDecision("interested");
      return;
    }
    if (x <= -DIST_THRESHOLD || flickLeft) {
      handleDecision("ignored");
      return;
    }

    setOffsetX(0);
  };

  const swipeHint = !showActions
    ? ""
    : offsetX > 24
      ? "INTERESTED"
      : offsetX < -24
        ? "IGNORED"
        : "";

  return (
    <div
      className="relative select-none"
      style={{
        touchAction: showActions ? "none" : undefined,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => {
        draggingRef.current = false;
        setIsDragging(false);
      }}
    >
      <div
        style={{
          transform: `translateX(${offsetX}px) rotate(${offsetX / 28}deg)`,
          transition: isDragging ? "none" : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: isDragging ? "transform" : "auto",
        }}
      >
        {swipeHint ? (
          <div
            className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold tracking-wider ${
              offsetX > 0
                ? "bg-success/25 text-success"
                : "bg-error/25 text-error"
            }`}
          >
            {swipeHint}
          </div>
        ) : null}
        <div className="card w-96 bg-base-100 shadow-xl">
          <figure className="px-6 pt-6">
            <div className="avatar">
              <div className="w-32 rounded-full ring-2 ring-primary/20">
                <img
                  draggable={false}
                  src={
                    imageSrc ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt={`${firstName} ${lastName}`}
                />
              </div>
            </div>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-base-content">
              {firstName} {lastName}
            </h2>
            {age && (
              <p className="text-sm text-base-content/70">Age: {age}</p>
            )}
            {gender && (
              <p className="text-sm text-base-content/70">{gender}</p>
            )}
            {about && (
              <p className="text-sm text-base-content/80">{about}</p>
            )}
            {skillList.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1">
                {skillList.map((skill, i) => (
                  <span
                    key={i}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
            {showActions ? (
              <div className="card-actions mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleDecision("ignored")}
                >
                  Ignore
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => handleDecision("interested")}
                >
                  Interested
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
