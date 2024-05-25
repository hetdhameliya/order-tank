import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor, generateGetOrderCountUrl, generateProductSummaryPdfUrl, getAllOrderQueryUrl } from "./util";
import { ProductSummaryFromData, orderFromData } from "../util/helpers";
import axios from "axios";
import { actions } from "../redux/store/store";
import { objectInterface } from "../util/interface";
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: "/api/order/",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getAllOrder: builder.query({
      query: (args) => {
        const queryString = getAllOrderQueryUrl(args);
        const formDataOrder = orderFromData(args);
        return {
          url: queryString,
          method: "GET",
          params: formDataOrder
        };
      },
      providesTags: ["Orders"],
    }),
    AddOrder: builder.mutation({
      query: (body) => {
        return {
          url: "",
          method: "POST",
          body,
        };
      },
      invalidatesTags:["Orders"]
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => {
        return {
          url: `${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags:["Orders"]
    }),
    removeOrder: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => result?.statusCode === 200 ? [
        { type: "Orders", _id: 1 },
      ] : [],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `${id}/updateStatus`,
          method: "PUT",
          body: { status: status }
        };
      },
      invalidatesTags:["Orders"]
    }),

    getOrderCount: builder.query({
      query: (args) => {
        const queryString = generateGetOrderCountUrl(args);
        return {
          url: queryString,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    getBuyerOrderCount: builder.query({
      query: ({ companyId }) => {
        return {
          url: `count/buyer-order?companyId=${companyId}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    OrderInvoice: builder.mutation({
      query: (body) => {
        return {
          url: `sendInvoice/${body.orderId}`,
          method: "POST",
        };
      },
      invalidatesTags:["Orders"]
    }),
    getOrderInvoice: builder.query({
      query: ({ orderId, companyId }) => {
        return {
          url: `${orderId}/get-invoice/${companyId}`,
        };
      },
    }),
  }),
});

export const fetchInvoicePdfUrl = async (orderId: string | number, setPdfUrl: (url: string | null) => void) => {
  actions.auth.setLoading(true);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axios.get(
      `/api/order/invoice/${orderId}`,
      {
        responseType: 'arraybuffer',
      },
    );
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  } catch (error) {
    console.error('Error fetching PDF:', error);
  }
  actions.auth.setLoading(false);
};

export const fetchProductSummaryPdfUrl = async (OrderParams: objectInterface, setPdfUrl: (url: string | null) => void) => {

  actions.auth.setLoading(true);
  const formDataOrder = await ProductSummaryFromData(OrderParams);
  const url = generateProductSummaryPdfUrl(OrderParams, formDataOrder);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axios.get(url, {
      responseType: 'arraybuffer',
    },
    );
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  } catch (error) {
    console.error('Error fetching PDF:', error);
  }
  actions.auth.setLoading(false);
};

export const {
  useGetAllOrderQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useRemoveOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrderCountQuery,
  useGetBuyerOrderCountQuery,
  useOrderInvoiceMutation,
  useGetOrderInvoiceQuery
} = ordersApi;
