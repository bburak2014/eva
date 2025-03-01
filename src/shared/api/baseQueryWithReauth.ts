// src/shared/api/baseQueryWithReauth.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { toastManager } from '@/shared/utils/toastManager';
import localStorageManager from '@/shared/utils/localStorageManager';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorageManager.get('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const tokenExpiry = localStorageManager.get('expires_at');
  if (tokenExpiry) {
    const expiresAt = new Date(String(tokenExpiry));

    if (new Date() >= expiresAt) {
      toastManager.showToast('Session Expired!', 'error', 2000);
      localStorageManager.remove('access_token');
      localStorageManager.remove('expires_at');
      return { error: { status: 401, data: { message: 'Token expired' } } };

    }toastManager
  }

  let result = await baseQuery(args, api, extraOptions);

  // If request returns 401, clear tokens and return error.
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        toastManager.showToast('Authorization Failed!', 'error', 2000);
        localStorageManager.remove('access_token');
        localStorageManager.remove('expires_at');
        return result;
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
