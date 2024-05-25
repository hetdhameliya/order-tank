import { createApi } from "@reduxjs/toolkit/query/react";
import { AddBuyerFormData } from "../util/helpers";
import { baseQueryWithAuthInterceptor } from "./util";

export const companyRelationsApi = createApi({
  reducerPath: "companyRelationsApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/",
  }),
  tagTypes: ["companyRelations"],
  endpoints: (builder) => ({
    getRelations: builder.query({
      query: (params) => {
        return {
          url: `companyRelations/getRelations`,
          method: "GET",
          params: {
            buyerLists: true,
            ...params
          }
        };
      },
      providesTags: ["companyRelations"],
    }),
    changeCompanyRelations: builder.mutation({
      query: ({ id, params }) => {
        return {
          url: `companyRelations/acceptRequest/${id}`,
          method: "POST",
          params: params
        };
      },
      invalidatesTags:["companyRelations"]
    }),
    createBuyer: builder.mutation({
      query: (body) => {
        const formData = AddBuyerFormData(body);
        return {
          url: "company/createbuyer",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags:["companyRelations"]
    }),
    updateBuyer: builder.mutation({
      query: (body) => {
        const formData = AddBuyerFormData(body);
        return {
          url: `company/${body.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags:["companyRelations"]
    }),
    deleteBuyer: builder.mutation({
      query: (id) => {
        return {
          url: `company/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags:["companyRelations"]
    }),

  }),
});

export const {
  useGetRelationsQuery,
  useChangeCompanyRelationsMutation,
  useCreateBuyerMutation,
  useDeleteBuyerMutation,
  useUpdateBuyerMutation
} = companyRelationsApi;
