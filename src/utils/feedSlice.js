import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addFeed: (state, action) => {
      state.items = action.payload;
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
  },
});

export const { addFeed, setFeedLoading, setFeedError, removeFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
