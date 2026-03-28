import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeFeedItem, setFeedError } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const feedItems = useSelector((state) => {
    const items = state.feed?.items;
    return Array.isArray(items) ? items : [];
  });

  useEffect(() => {
    if (!user) return;
    if (feedItems.length > 0) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/feed`, {
          withCredentials: true,
        });
        if (!cancelled) dispatch(addFeed(res.data));
      } catch (err) {
        if (!cancelled && err.response?.status !== 401) {
          console.error(err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, feedItems.length, dispatch]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          Sign in to see developers
        </h1>
        <p className="text-sm text-base-content/70">
          Log in to load your personalized developer feed.
        </p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  const handleSwipe = async ({ status, userId }) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedItem({ id: userId }));
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.message ??
        "Could not send request action.";
      dispatch(setFeedError(msg));
      console.error(err);
    }
  };

  const topUser = feedItems[0];

  if (!topUser) {
    return (
      <h1 className="m-52 flex justify-center text-3xl">
        No more users!!!!
      </h1>
    );
  }

  return (
    <div className="my-5 flex flex-col items-center gap-4">
      <UserCard
        key={topUser._id ?? topUser.id}
        user={topUser}
        onSwipe={handleSwipe}
      />
    </div>
  );
};

export default Feed;
