// src/shared/api/baseQueryWithReauth.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://iapitest.eva.guru/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Function to refresh token and update localStorage.
const refreshToken = async (api: any, extraOptions: any) => {
  const refreshResult = await baseQuery({ url: '/oauth/refresh-token', method: 'POST' }, api, extraOptions);
  if (refreshResult.data) {
    const newAccessToken = (refreshResult.data as any).Data?.AccessToken;
    const newExpiresAt = (refreshResult.data as any).Data?.ExpiresAt;
    localStorage.setItem('access_token', newAccessToken);
    localStorage.setItem('expires_at', newExpiresAt);
  } else if (refreshResult.error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
  }
  return refreshResult;
};

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Check token expiry before the request.
  const tokenExpiry = localStorage.getItem('expires_at');
  if (tokenExpiry) {
    const expiresAt = new Date(tokenExpiry);
    if (new Date() >= expiresAt) {
      const refreshResult = await refreshToken(api, extraOptions);
      if (refreshResult.error) return refreshResult;
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // If request returns 401, attempt refresh.
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await refreshToken(api, extraOptions);
        if (!refreshResult.error) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          return refreshResult;
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
