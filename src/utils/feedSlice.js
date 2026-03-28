import { createSlice } from "@reduxjs/toolkit";

/** API may return an array or wrap it (e.g. { data: [...] }). */
function normalizeFeedItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.feed)) return payload.feed;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addFeed: (state, action) => {
      state.items = normalizeFeedItems(action.payload);
      state.error = null;
    },
    setFeedLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFeedError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    removeFeed: (state) => {
      state.items = [];
      state.error = null;
    },
    removeFeedItem: (state, action) => {
      const id = action.payload?.id ?? action.payload?._id ?? action.payload;
      state.items = state.items.filter((u) => {
        const uid = u?._id ?? u?.id;
        return uid !== id;
      });
    },
  },
});

export const { addFeed, setFeedLoading, setFeedError, removeFeed, removeFeedItem } =
  feedSlice.actions;
export default feedSlice.reducer;
