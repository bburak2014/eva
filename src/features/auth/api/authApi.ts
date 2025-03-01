// src/features/auth/api/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  ApiStatus: boolean | any;
  ApiStatusCode: number | any;
  Data: {
    AccessToken: string;
    TokenType: string;
    ExpiresAt: string;

  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: '/oauth/token',
        method: 'POST',
        body: {
          Email: email,
          Password: password,
          GrantType: 'password',
          Scope: 'amazon_data',
          ClientId: 'C0001',
          ClientSecret: 'SECRET0001',
          RedirectUri: 'https://api.eva.guru'
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
