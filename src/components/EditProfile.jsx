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

/** Matches common Mongoose enums (avoid "" or Title Case, which fail many validators). */
const normalizeGender = (g) => {
  const s = String(g ?? "").trim().toLowerCase();
  if (s === "male") return "male";
  if (s === "female") return "female";
  if (s === "others" || s === "other") return "others";
  return "";
};

const GENDER_LABEL = { male: "Male", female: "Female", others: "Others" };

const MAX_SKILLS = 10;
/** Match Mongoose schema on your User model */
const ABOUT_MIN = 10;
const ABOUT_MAX = 200;

/**
 * Only allowed edit fields; omit optional empties so validateEditProfile + schema don’t reject
 * e.g. gender: "", age: "". Omit about when empty so we don’t set about to "".
 */
const buildEditProfileBody = ({
  firstName,
  lastName,
  photoURL,
  age,
  gender,
  about,
  skillsText,
}) => {
  const skillsList = skillsText
    ? String(skillsText)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_SKILLS)
    : [];

  const body = {
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    // Backend allowlist uses camelCase "photoUrl", not "photoURL"
    photoUrl: String(photoURL).trim(),
    skills: skillsList,
  };

  const aboutTrim = String(about ?? "").trim();
  if (aboutTrim.length >= ABOUT_MIN && aboutTrim.length <= ABOUT_MAX) {
    body.about = aboutTrim;
  }

  const g = normalizeGender(gender);
  if (g) body.gender = g;

  const ageStr = String(age ?? "").trim();
  if (ageStr !== "") {
    const n = Number(ageStr);
    if (!Number.isNaN(n) && Number.isFinite(n) && n >= 0) body.age = n;
  }

  return body;
};

const formatSaveError = (data) => {
  if (data == null) return "Failed to save profile.";
  if (typeof data === "string") return data;
  if (typeof data === "object" && data.message) return String(data.message);
  try {
    return JSON.stringify(data);
  } catch {
    return "Failed to save profile.";
  }
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
    setPhotoURL(pick(u, "photoUrl", "photoURL", "photo_url"));
    setAge(u?.age ?? u?.user?.age ?? "");
    setGender(normalizeGender(pick(u, "gender")));
    setAbout(u?.about ?? u?.user?.about ?? "");
    setSkills(getSkillsString(u) || getSkillsString(user));
  }, [user]);

  const saveProfile = async () => {
    setError("");
    const aboutLen = String(about ?? "").trim().length;
    if (
      aboutLen > 0 &&
      (aboutLen < ABOUT_MIN || aboutLen > ABOUT_MAX)
    ) {
      setError(
        `About must be between ${ABOUT_MIN} and ${ABOUT_MAX} characters (or leave it empty to leave your current bio unchanged).`
      );
      return;
    }
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        buildEditProfileBody({
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
          skillsText: skills,
        }),
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const userPayload = res.data?.data ?? res.data?.user ?? res.data;
      dispatch(addUser(userPayload));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(formatSaveError(err.response?.data));
    }
  };

  const previewUser = {
    firstName,
    lastName,
    photoURL,
    age,
    gender: GENDER_LABEL[gender] || gender,
    about,
    skills: skills
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, MAX_SKILLS)
      : [],
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
                      {GENDER_LABEL[gender] || gender || "Select gender"}
                      <span className="text-base-content/60">▼</span>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content rounded-box z-10 w-full bg-base-100 p-2 shadow"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("male")}
                        >
                          Male
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("female")}
                        >
                          Female
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setGender("others")}
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
                    <span className="label-text-alt text-base-content/60">
                      {about.trim().length}/{ABOUT_MAX} · {ABOUT_MIN}–{ABOUT_MAX}{" "}
                      chars if you change it
                    </span>
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder={`At least ${ABOUT_MIN} characters when you add a bio…`}
                    maxLength={ABOUT_MAX}
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
        <UserCard user={previewUser} showActions={false} />
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
