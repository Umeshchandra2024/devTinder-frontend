import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedItems = useSelector((state) => state.feed?.items ?? []);

  const getFeed = async () => {
    if (feedItems && feedItems.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!feedItems) return null;

  if (feedItems.length === 0) {
    return (
      <h1 className="m-52 flex justify-center text-3xl">
        No more users!!!!
      </h1>
    );
  }

  return (
    <div className="my-5 flex flex-col items-center gap-4">
      {feedItems.map((user) => (
        <UserCard key={user._id ?? user.id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
