// src/features/auth/model/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api/authApi';

interface AuthState {
  accessToken: string | null;
  expiresAt: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.expiresAt = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires_at');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.Data.AccessToken;
        state.expiresAt = payload.Data.ExpiresAt;
        localStorage.setItem('access_token', payload.Data.AccessToken);
        localStorage.setItem('expires_at', payload.Data.ExpiresAt);
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
