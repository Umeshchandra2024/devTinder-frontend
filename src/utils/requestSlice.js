import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    sent: [],
    received: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSentRequests: (state, action) => {
      state.sent = action.payload;
      state.error = null;
    },
    setReceivedRequests: (state, action) => {
      state.received = action.payload;
      state.error = null;
    },
    addSentRequest: (state, action) => {
      state.sent.push(action.payload);
    },
    addReceivedRequest: (state, action) => {
      state.received.push(action.payload);
    },
    removeSentRequest: (state, action) => {
      const id = action.payload?.id ?? action.payload?._id;
      state.sent = state.sent.filter((r) => r.id !== id && r._id !== id);
    },
    removeReceivedRequest: (state, action) => {
      const id = action.payload?.id ?? action.payload?._id;
      state.received = state.received.filter((r) => r.id !== id && r._id !== id);
    },
    setRequestLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRequestError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearRequests: (state) => {
      state.sent = [];
      state.received = [];
      state.error = null;
    },
  },
});

export const {
  setSentRequests,
  setReceivedRequests,
  addSentRequest,
  addReceivedRequest,
  removeSentRequest,
  removeReceivedRequest,
  setRequestLoading,
  setRequestError,
  clearRequests,
} = requestSlice.actions;
export default requestSlice.reducer;
