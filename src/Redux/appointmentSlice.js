import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    uppcomingAppointment: null,
  },
  reducers: {
    setUppcomingAppointment: (state, action) => {
      state.uppcomingAppointment = action.payload;
    },
    clearUppcomingAppointment: (state) => {
      state.uppcomingAppointment = null;
    },
  },
});

export const { setUppcomingAppointment, clearUppcomingAppointment } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
