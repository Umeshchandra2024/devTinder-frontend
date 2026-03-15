import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const pick = (u, ...keys) => {
  for (const k of keys) {
    const v = u?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
};

const getSkillsString = (u) => {
  const raw = u?.skills ?? u?.user?.skills ?? u?.data?.skills;
  return Array.isArray(raw) ? raw.join(", ") : "";
};

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!user) return;
    const u = user?.user ?? user?.data ?? user;
    setFirstName(pick(u, "firstName", "first_name"));
    setLastName(pick(u, "lastName", "last_name"));
    setPhotoURL(pick(u, "photoURL", "photo_url"));
    setAge(u?.age ?? u?.user?.age ?? "");
    setGender(pick(u, "gender"));
    setAbout(u?.about ?? u?.user?.about ?? "");
    setSkills(getSkillsString(u) || getSkillsString(user));
  }, [user]);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
          skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        },
        { withCredentials: true }
      );
      const userPayload = res.data?.user ?? res.data?.data ?? res.data;
      dispatch(addUser(userPayload));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const errMsg = err.response?.data;
      setError(
        typeof errMsg === "string"
          ? errMsg
          : errMsg?.message ?? "Failed to save profile."
      );
    }
  };

  const previewUser = {
    firstName,
    lastName,
    photoURL,
    age,
    gender,
    about,
    skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
  };

  return (
    <>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 lg:flex-row lg:items-start lg:justify-center">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First name</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last name</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 25"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://..."
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <div className="dropdown dropdown-hover">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline w-full justify-between"
                    >
                      {gender || "Select gender"}
                      <span className="text-base-content/60">▼</span>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content rounded-box z-10 w-full bg-base-100 p-2 shadow"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("Male")}
                        >
                          Male
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("Female")}
                        >
                          Female
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("Others")}
                        >
                          Others
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Skills (comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node, JavaScript"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">About</span>
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Short bio..."
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>
              </div>
              {error && (
                <p className="text-center text-sm text-error">{error}</p>
              )}
              <div className="card-actions justify-center pt-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveProfile}
                >
                  Save profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard user={previewUser} />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center z-50 pt-20">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
