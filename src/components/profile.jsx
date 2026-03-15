import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-base-100 p-8 text-center shadow-lg">
          <p className="text-base-content/80">
            Please log in to view and edit your profile.
          </p>
          <Link to="/login" className="btn btn-primary mt-4">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return <EditProfile />;
};

export default Profile;
