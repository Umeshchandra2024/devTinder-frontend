import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setConnections: (state, action) => {
      state.list = action.payload;
      state.error = null;
    },
    addConnection: (state, action) => {
      state.list.push(action.payload);
    },
    removeConnection: (state, action) => {
      state.list = state.list.filter(
        (c) => c.id !== action.payload?.id && c._id !== action.payload?.id
      );
    },
    setConnectionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConnectionError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearConnections: (state) => {
      state.list = [];
      state.error = null;
    },
  },
});

export const {
  setConnections,
  addConnection,
  removeConnection,
  setConnectionLoading,
  setConnectionError,
  clearConnections,
} = connectionSlice.actions;
export default connectionSlice.reducer;
