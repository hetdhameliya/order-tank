import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor} from "./util";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/categories/",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (search) => {
        return {
          url: `?search=${search ? search : ""}&myCategory=${true}`,
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),
    AddCategory: builder.mutation({
      query: (body) => {
        return {
          url: "",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Category"]
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags:["Category"]
    }),
    removeCategory: builder.mutation({
      query: (id) => ({
        url: "",
        method: "DELETE",
        body: id
      }),
      invalidatesTags:["Category"]
    }),
    createCategoryByCsv: builder.mutation({
      query: (body) => {
        return {
          url: "import/csv",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Category"]
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
  useCreateCategoryByCsvMutation
} = categoryApi;
