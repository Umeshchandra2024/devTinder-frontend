const UserCard = ({ user }) => {
  if (!user) return null;
  const {
    firstName,
    lastName,
    photoURL,
    about,
    age,
    gender,
    skills = [],
  } = user;
  const skillList = Array.isArray(skills) ? skills : [];

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure className="px-6 pt-6">
        <div className="avatar">
          <div className="w-32 rounded-full ring-2 ring-primary/20">
            <img
              src={photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
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
      </div>
    </div>
  );
};

export default UserCard;
