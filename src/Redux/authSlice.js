import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  otp: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  from: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false; // WAIT for OTP verification
      state.user = action.payload.user;
      state.token = action.payload.token;  // may be null at this point
      state.otp = action.payload.otp;
      state.from = action.payload.from;
    },
    otpVerifySuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.otp = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.otp = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  otpVerifySuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
