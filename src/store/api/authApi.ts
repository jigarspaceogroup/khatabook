/**
 * Auth API
 * RTK Query API for authentication endpoints
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

const API_URL = 'http://172.16.17.36:3000/api/v1';

export interface SendOtpRequest {
  phone_number: string;
}

export interface SendOtpResponse {
  message: string;
  expires_in: number;
}

export interface VerifyOtpRequest {
  phone_number: string;
  otp: string;
  device_id: string;
  device_type: string;
  device_name?: string;
}

export interface VerifyOtpResponse {
  user: {
    id: string;
    phone_number: string;
    name: string | null;
    email: string | null;
    language_code: string;
    phone_verified: boolean;
    created_at: string;
  };
  access_token: string;
  refresh_token: string;
  expires_in: number;
  is_new_user: boolean;
}

export interface RefreshTokenRequest {
  refresh_token: string;
  device_id: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<{ success: boolean; data: SendOtpResponse }, SendOtpRequest>({
      query: (body) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<{ success: boolean; data: VerifyOtpResponse }, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    refreshToken: builder.mutation<{ success: boolean; data: RefreshTokenResponse }, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/auth/me',
    }),

    updateMe: builder.mutation<{ success: boolean; data: any }, Partial<{
      name: string;
      email: string;
      language_code: string;
      biometric_enabled: boolean;
    }>>({
      query: (body) => ({
        url: '/auth/me',
        method: 'PUT',
        body,
      }),
    }),

    logout: builder.mutation<{ success: boolean; data: { message: string } }, {
      device_id: string;
      logout_all_devices?: boolean;
    }>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useLogoutMutation,
} = authApi;
