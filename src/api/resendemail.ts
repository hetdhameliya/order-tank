import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor} from "./util";

export const resendemailApi = createApi({
  reducerPath: "resendemailApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/",
  }),
  tagTypes: ["resendEmail"],
  endpoints: (builder) => ({
    resendemail: builder.mutation({
      query: (body) => {
        return {
          url: "auth/resend-verify-email",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["resendEmail"],
    }),
  }),
});

export const { useResendemailMutation } = resendemailApi;
