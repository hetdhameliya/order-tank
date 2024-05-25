import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor} from "./util";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: "/api//dashboard/",
    }),
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: (value) => {
                const { filterBy } = value;
                return {
                    url: `?filterBy=${filterBy?.value ? filterBy?.value : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),

        getOrderList: builder.query({
            query: (value) => {
                const { filterBy } = value;
                return {
                    url: `orderList?filterBy=${filterBy ? filterBy : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),


    }),
});

export const { useGetDashboardQuery, useGetOrderListQuery } = dashboardApi;
