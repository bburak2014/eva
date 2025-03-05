// src/features/auth/model/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/api/authApi';
import localStorageManager from '@/shared/utils/localStorageManager';

interface AuthState {
    accessToken: string | null;
    expiresAt: string | null;
}

const initialState: AuthState = {
    accessToken: localStorageManager.get('access_token') || null,
    expiresAt: localStorageManager.get('expires_at') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.accessToken = null;
            state.expiresAt = null;
            localStorageManager.remove('access_token');
            localStorageManager.remove('expires_at');
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.accessToken = payload.Data.AccessToken;
                state.expiresAt = payload.Data.ExpiresAt;
                localStorageManager.set('access_token', payload.Data.AccessToken);
                localStorageManager.set('expires_at', payload.Data.ExpiresAt);

            }
        );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
