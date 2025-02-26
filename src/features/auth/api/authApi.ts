import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-base-url.com' }),
  endpoints: (builder) => ({
    // Define endpoints here
  }),
});

export const { /* hooks */ } = authApi;
