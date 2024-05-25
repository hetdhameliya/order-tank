/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer, { authSlice } from "../slices/authSlice";
import { authApi } from "../../api/auth";
import modalReducer, { modalSlice } from "../slices/modalSlice";
import { resendemailApi } from "../../api/resendemail";
import { categoryApi } from "../../api/category";
import { productApi } from "../../api/product";
import { buyersApi } from "../../api/buyers";
import { companyreqApi } from "../../api/companyreq";
import { companyApi } from "../../api/company";
import { ordersApi } from "../../api/order";
import { companyRelationsApi } from "../../api/relations";
import { dashboardApi } from "../../api/dashboard";
import { companyUserApi } from "../../api/companyUser";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    [authApi.reducerPath]: authApi.reducer,
    [resendemailApi.reducerPath]: resendemailApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [buyersApi.reducerPath]: buyersApi.reducer,
    [companyreqApi.reducerPath]: companyreqApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [companyRelationsApi.reducerPath]: companyRelationsApi.reducer,
    [companyUserApi.reducerPath]: companyUserApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(resendemailApi.middleware)
      .concat(companyApi.middleware)
      .concat(categoryApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(productApi.middleware)
      .concat(buyersApi.middleware)
      .concat(companyreqApi.middleware)
      .concat(ordersApi.middleware)
      .concat(companyRelationsApi.middleware)
      .concat(companyUserApi.middleware)
});

setupListeners(store.dispatch);

const createActions = (slice: any) =>
  _.mapValues(
    slice.actions,
    (actionCreator: any) => (payload: any) =>
      store.dispatch(actionCreator(payload))
  );

export const actions = {
  auth: createActions(authSlice),
  modal: createActions(modalSlice),
};

export default store;
