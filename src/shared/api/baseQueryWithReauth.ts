// src/shared/api/baseQueryWithReauth.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { showToast } from '@/shared/utils/toast';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const tokenExpiry = localStorage.getItem('expires_at');
  if (tokenExpiry) {
    const expiresAt = new Date(tokenExpiry);

    if (new Date() >= expiresAt) {
      showToast('Oturumun Süresi Doldu!', 2000, 'error');
      localStorage.clear()
      return { error: { status: 401, data: { message: 'Token expired' } } };

    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // If request returns 401, clear tokens and return error.
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        showToast('Yetki Hatası!', 2000, 'error');
        localStorage.clear()

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
