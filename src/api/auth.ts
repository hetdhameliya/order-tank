import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, platformHeaders } from "./util";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/",
  }),
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["CurrentUser"],
    }),
    login: builder.mutation({
      query: (body) => {
        return {
          url: "auth/login",
          method: "POST",
          body,
          headers: platformHeaders
        };
      },
      invalidatesTags: ["CurrentUser"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
        headers: platformHeaders
      }),
    }),
    updateProfile: builder.mutation({
      query: (body) => {
        return {
          url: "auth/updateProfile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["CurrentUser"]
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),
    ForgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    ResetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/auth/reset-password/${token ? token : ""}`,
        method: "POST",
        body,
      }),
    }),
    ConfirmRegistration: builder.query({
      query: ({ token }) => {
        return {
          url: `/auth/verify/${token}`,
        };
      },
    }),
    Logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useConfirmRegistrationQuery,
  useLogoutMutation
} = authApi;
