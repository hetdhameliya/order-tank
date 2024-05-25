import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, platformHeaders } from "./util";
import { AddCompanyFormData } from "../util/helpers";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/company/",
  }),
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    AddCompany: builder.mutation({
      query: (body) => {
        const formData = AddCompanyFormData(body);
        return {
          url: "",
          method: "POST",
          body: formData,
          headers: platformHeaders
        };
      },
      invalidatesTags:["Company"]
    }),
    getSingleCompany: builder.query({
      query: (id) => {
        return {
          url: id,
          method: "GET",
        };
      },
      providesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: (body) => {
        const formData = AddCompanyFormData(body);
        return {
          url: `${body.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags:["Company"]
    }),
    getAddress: builder.query({
      query: ({ id, search }) => {
        return {
          url: `${id}/get/address?search=${search || ""}`,
          method: "GET",
        };
      },
      providesTags: ["Company"],
    }),
    addAddress: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `${id}/add/address`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags:["Company"]
    }),
    updateAddress: builder.mutation({
      query: ({ compId, id, ...body }) => {
        return {
          url: `${compId}/updateAddress/${id}`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags:["Company"]
    }),

    deleteAddress: builder.mutation({
      query: ({ compId, id }) => ({
        url: `${compId}/removeAddress/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Company"]
    }),

  }),
});

export const {
  useAddCompanyMutation,
  useGetSingleCompanyQuery,
  useUpdateCompanyMutation,
  useGetAddressQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation
} = companyApi;
