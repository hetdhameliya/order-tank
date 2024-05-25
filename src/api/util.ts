/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCurrentUser } from "../redux/slices/authSlice";
import Cookies from "js-cookie";
import { objectInterface } from "../util/interface";
import { Datakey } from "../util/massages";

export const baseQueryWithAuthInterceptor = (args: any) => {
  const baseQuery = fetchBaseQuery(args);
  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401 && !Cookies.get(Datakey.COOKIE_NAME)) {
      api.dispatch(setCurrentUser(null));
    }
    return result;
  };
};

export const platformHeaders = {
  "platform-type": "web"
}

export const getAllOrderQueryUrl = (args: objectInterface) => {
  const { fromDate, toDate, fromApproxDate, toApproxDate, search, isBuyerOrderWithMe, status } = args;
  return `?fromDate=${fromDate ? fromDate : ""}&toDate=${toDate ? toDate : ""}&fromApproxDate=${fromApproxDate ? fromApproxDate : ""}&toApproxDate=${toApproxDate ? toApproxDate : ""}&search=${search ? search : ""}&isSellerOrder=${true}&isBuyerOrderWithMe=${isBuyerOrderWithMe || ""}
  ${Array.isArray(args?.status) ? '' : `&status=${status?.value || ""}`}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateProductSummaryPdfUrl = (OrderParams: objectInterface, formDataOrder: any) => {
  return `/api/order/orderSummary?fromDate=${OrderParams?.fromDate ? OrderParams?.fromDate : ""}&toDate=${OrderParams?.toDate ? OrderParams?.toDate : ""}
  &search=${OrderParams?.search ? OrderParams?.search : ""}&isSellerOrder=${true}&${formDataOrder.toString()}`;
};

export const generateGetOrderCountUrl = (args: objectInterface) => {
  const { OrderCountfromDate, OrderCounttoDate, search } = args;
  return `count/orders?fromDate=${OrderCountfromDate ? OrderCountfromDate : ""}&toDate=${OrderCounttoDate ? OrderCounttoDate : ""}&search=${search || ""}`
}