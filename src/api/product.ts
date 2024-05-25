import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./util";
import { AddProductFormData, updateProductFormData } from "../util/helpers";
import queryString from "query-string";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/product/",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paramsSerializer: function (params: any) {
      return queryString.stringify(params, { arrayFormat: 'bracket' })
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: ({ search, isAvailable, categoryId }) => {
        return {
          url: `?search=${search ? search : ""}&isAvailable=${isAvailable ? isAvailable : ""}&myProduct=${true}`,
          method: "GET",
          params: { category: categoryId || [] }
        };
      },
      providesTags: ["Product"],
    }),
    AddProduct: builder.mutation({
      query: (body) => {
        const formData = AddProductFormData(body);
        return {
          url: "",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags:["Product"]
    }),
    updateProduct: builder.mutation({
      query: (body) => {
        const formData = updateProductFormData(body);
        return {
          url: `${body.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags:["Product"]
    }),
    removeProduct: builder.mutation({
      query: (id) => ({
        url: ``,
        method: "DELETE",
        body: id
      }),
      invalidatesTags:["Product"]
    }),
    DeleteAllProducts: builder.mutation({
      query: (body) => {
        return {
          url: "delete-products",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Product"]
    }),
    createProductsByCsv: builder.mutation({
      query: (body) => {
        return {
          url: "import/csv",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Product"]
    }),
    productAvailability: builder.mutation({
      query: (body) => {
        return {
          url: "changePublished",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,
  useDeleteAllProductsMutation,
  useCreateProductsByCsvMutation,
  useProductAvailabilityMutation
} = productApi;
