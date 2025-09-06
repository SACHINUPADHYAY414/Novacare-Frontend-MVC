import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDoctor: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
});

export const { setSelectedDoctor, clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
