import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./util";
import { AddBuyerFormData } from "../util/helpers";

export const buyersApi = createApi({
  reducerPath: "buyersApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/",
  }),
  tagTypes: ["Buyers"],
  endpoints: (builder) => ({
    getAllBuyers: builder.query({
      query: ({ search, status }) => {
        return {
          url: `/company/buyers/get?search=${search || ""}&status=${status || ""}`,
          method: "GET",
        };
      },
      providesTags: ["Buyers"],
    }),
    AddBuyer: builder.mutation({
      query: (body) => {
        const formData = AddBuyerFormData(body);
        return {
          url: "/user/createbuyer",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags:["Buyers"]
    }),
    EditBuyer: builder.mutation({
      query: (body) => {
        const formData = AddBuyerFormData(body);
        return {
          url: `/company/update-buyer/${body.id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags:["Buyers"]
    }),
    removeBuyer: builder.mutation({
      query: (id) => ({
        url: `/company/remove-buyer/${id}`,
        method: "POST",
      }),
      invalidatesTags:["Buyers"]
    }),
    blockBuyer: builder.mutation({
      query: (id) => ({
        url: `/company/user/block/${id}`,
        method: "POST",
      }),
      invalidatesTags:["Buyers"]
    }),
    accpetedBuyer: builder.mutation({
      query: (id) => ({
        url: `/company/user/unblock/${id}`,
        method: "POST",
      }),
      invalidatesTags:["Buyers"]
    }),
  }),
});

export const {
  useGetAllBuyersQuery,
  useAddBuyerMutation,
  useEditBuyerMutation,
  useRemoveBuyerMutation,
  useBlockBuyerMutation,
  useAccpetedBuyerMutation
} = buyersApi;
