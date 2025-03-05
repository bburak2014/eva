// src/features/auth/api/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { LoginRequest, LoginResponse, UserInformationResponse } from '@/features/auth/types/authTypes';


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
    getUserInformation: builder.mutation<UserInformationResponse, { email: string }>({
      query: ({ email }) => ({
        url: '/user/user-information',
        method: 'POST',
        body: { email: email },
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
      }),
    }),

  }),
});

export const { useLoginMutation, useGetUserInformationMutation,useLogoutMutation } = authApi;
