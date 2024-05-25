import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthInterceptor } from "./util";

export const companyUserApi = createApi({
    reducerPath: "companyUserApi",
    baseQuery: baseQueryWithAuthInterceptor({
        baseUrl: "/api/companyUser/",
    }),
    tagTypes: ["companyUser"],
    endpoints: (builder) => ({
        SendInvitation: builder.mutation({
            query: (body) => {
                return {
                    url: "sendInvitation",
                    method: "POST",
                    body: body,
                };
            },
            invalidatesTags: ["companyUser"]
        }),
        getCompanyUser: builder.query({
            query: ({ currentUser, isRequested }) => {
                return {
                    url: `?currentUser=${currentUser}&isRequested=${isRequested}`,
                    method: "GET",
                };
            },
            providesTags: ["companyUser"],
        }),
        deleteCompanyUser: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["companyUser"],
        }),
        updateCompanyUser: builder.mutation({
            query: ({ id, body }) => {
                return {
                    url: `update/${id}`,
                    method: "PUT",
                    body: body,
                };
            },
            invalidatesTags: ["companyUser"]
        }),
        AcceptInvitation: builder.mutation({
            query: ({ id, body }) => ({
                url: `acceptInvitation/${id}`,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["companyUser"]
        }),
        ResendInvitation: builder.mutation({
            query: (body) => {
                return {
                    url: "resendInvitation",
                    method: "POST",
                    body: body,
                };
            },
            invalidatesTags: ["companyUser"]
        }),
        CheckUser: builder.mutation({
            query: (body) => {
                return {
                    url: `checkCompanyUser`,
                    method: "POST",
                    body
                };
            },
            invalidatesTags: ["companyUser"]
        }),
    }),
});



export const {
    useSendInvitationMutation,
    useGetCompanyUserQuery,
    useDeleteCompanyUserMutation,
    useUpdateCompanyUserMutation,
    useAcceptInvitationMutation,
    useResendInvitationMutation,
    useCheckUserMutation
} = companyUserApi;
