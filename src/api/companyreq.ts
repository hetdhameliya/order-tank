import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor} from "./util";

export const companyreqApi = createApi({
  reducerPath: "companyreqApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/company/request/",
  }),
  tagTypes: ["companyReq"],
  endpoints: (builder) => ({
    getAllCompanyReq: builder.query({
      query: (body) => {
        return {
          url: `get?search=${body}`,
          method: "GET",
        };
      },
      providesTags: ["companyReq"],
    }),
    AcceptReq: builder.mutation({
      query: (id) => {
        return {
          url: `accept/${id}`,
          method: "POST",
        };
      },
      invalidatesTags:["companyReq"]
    }),
    CancelReq: builder.mutation({
      query: (id) => {
        return {
          url: `cancel/${id}`,
          method: "POST",
        };
      },
      invalidatesTags:["companyReq"]
    }),
  }),
});

export const {
  useGetAllCompanyReqQuery,
  useAcceptReqMutation,
  useCancelReqMutation,
} = companyreqApi;
