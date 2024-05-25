import { createSlice } from "@reduxjs/toolkit";
const emptyObj = { open: false, id: null };
export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    emailVerification: emptyObj,
    resendEmail: emptyObj,
    categoryDrawer: emptyObj,
    deleteCategory: emptyObj,
    productDrawer: emptyObj,
    deleteProduct: emptyObj,
    productDetail: emptyObj,
    AddBuyers: emptyObj,
    deleteBuyer: emptyObj,
    ordersDrawer: emptyObj,
    deleteOrder: emptyObj,
    OrderInvoice: emptyObj,
    AccessDenied: emptyObj,
    Available: emptyObj,
    blockBuyer: emptyObj,
    AddressDrawer: emptyObj,
    deleteAddress: emptyObj,
    imageShow: emptyObj,
    rejectCsvTable: emptyObj,
    productSummary: emptyObj,
    Logout: emptyObj,
    InvateUser: emptyObj,
    RejectInviteUser: emptyObj,
    ResendInvite: emptyObj,
  },
  reducers: {
    openEmailVerification: (state, { payload }) => {
      state.emailVerification = { open: true, id: payload };
    },
    openResendEmail: (state, { payload }) => {
      state.resendEmail = { open: true, id: payload };
    },
    openCategoryDrawer: (state, { payload }) => {
      state.categoryDrawer = { open: true, id: payload };
    },
    openDeleteCategory: (state, { payload }) => {
      state.deleteCategory = { open: true, id: payload };
    },
    openProductDrawer: (state, { payload }) => {
      state.productDrawer = { open: true, id: payload };
    },
    openDeleteProduct: (state, { payload }) => {
      state.deleteProduct = { open: true, id: payload };
    },
    openProductDetail: (state, { payload }) => {
      state.productDetail = { open: true, id: payload };
    },
    openAddBuyers: (state, { payload }) => {
      state.AddBuyers = { open: true, id: payload };
    },
    openDeleteBuyer: (state, { payload }) => {
      state.deleteBuyer = { open: true, id: payload };
    },
    openOrdersDrawer: (state, { payload }) => {
      state.ordersDrawer = { open: true, id: payload };
    },
    openDeleteOrder: (state, { payload }) => {
      state.deleteOrder = { open: true, id: payload };
    },
    openOrderInvoice: (state, { payload }) => {
      state.OrderInvoice = { open: true, id: payload };
    },
    openAccessDenied: (state, { payload }) => {
      state.AccessDenied = { open: true, id: payload };
    },
    openAvailable: (state, { payload }) => {
      state.Available = { open: true, id: payload };
    },
    openBlockBuyer: (state, { payload }) => {
      state.blockBuyer = { open: true, id: payload };
    },
    openAddressDrawer: (state, { payload }) => {
      state.AddressDrawer = { open: true, id: payload };
    },
    openDeleteAddress: (state, { payload }) => {
      state.deleteAddress = { open: true, id: payload };
    },
    openImageShowModal: (state, { payload }) => {
      state.imageShow = { open: true, id: payload };
    },
    openRejectCsvTableModal: (state, { payload }) => {
      state.rejectCsvTable = { open: true, id: payload };
    },
    openProductSummaryModal: (state, { payload }) => {
      state.productSummary = { open: true, id: payload };
    },
    openLogoutModal: (state, { payload }) => {
      state.Logout = { open: true, id: payload };
    },
    openInvateUserModal: (state, { payload }) => {
      state.InvateUser = { open: true, id: payload };
    },
    openRejectInviteUserModal: (state, { payload }) => {
      state.RejectInviteUser = { open: true, id: payload };
    },
    openResendInviteUserModal: (state, { payload }) => {
      state.ResendInvite = { open: true, id: payload };
    },

    closeEmailVerification: (state) => {
      state.emailVerification = emptyObj;
    },
    closeResendEmail: (state) => {
      state.resendEmail = emptyObj;
    },
    closeCategoryDrawer: (state, { payload }) => {
      state.categoryDrawer = { open: false, id: payload };
    },
    closeDeleteCategory: (state) => {
      state.deleteCategory = emptyObj;
    },
    closeProductDrawer: (state, { payload }) => {
      state.productDrawer = { open: false, id: payload };
    },
    closeDeleteProduct: (state) => {
      state.deleteProduct = emptyObj;
    },
    closeProductDetail: (state) => {
      state.productDetail = emptyObj;
    },
    closeAddBuyers: (state) => {
      state.AddBuyers = emptyObj;
    },
    closeDeleteBuyer: (state) => {
      state.deleteBuyer = emptyObj;
    },
    closeOrdersDrawer: (state, { payload }) => {
      state.ordersDrawer = { open: false, id: payload };
    },
    closeDeleteOrder: (state) => {
      state.deleteOrder = emptyObj;
    },
    closeOrderInvoice: (state) => {
      state.OrderInvoice = emptyObj;
    },
    closeAccessDenied: (state) => {
      state.AccessDenied = emptyObj;
    },
    closeAvailable: (state) => {
      state.Available = emptyObj;
    },
    closeBlockBuyer: (state) => {
      state.blockBuyer = emptyObj;
    },
    closeAddressDrawer: (state, { payload }) => {
      state.AddressDrawer = { open: false, id: payload };
    },
    closeDeleteAddress: (state) => {
      state.deleteAddress = emptyObj;
    },
    closeImageShowModal: (state) => {
      state.imageShow = emptyObj;
    },
    closeRejectCsvTableModal: (state) => {
      state.rejectCsvTable = emptyObj;
    },
    closeProductSummaryModal: (state) => {
      state.productSummary = emptyObj;
    },
    closeLogoutModal: (state) => {
      state.Logout = emptyObj;
    },
    closeInvateUserModal: (state) => {
      state.InvateUser = emptyObj;
    },
    closeRejectInviteUserModal: (state) => {
      state.RejectInviteUser = emptyObj;
    },
    closeResendInviteUserModal: (state) => {
      state.ResendInvite = emptyObj;
    },
  },
});

export const {
  openEmailVerification,
  openResendEmail,
  openCategoryDrawer,
  openDeleteCategory,
  openProductDrawer,
  openDeleteProduct,
  openProductDetail,
  openAddBuyers,
  openDeleteBuyer,
  openOrdersDrawer,
  openDeleteOrder,
  openOrderInvoice,
  openAccessDenied,
  openAvailable,
  openBlockBuyer,
  openAddressDrawer,
  openDeleteAddress,
  openImageShowModal,
  openRejectCsvTableModal,
  openProductSummaryModal,
  openLogoutModal,
  openInvateUserModal,
  openRejectInviteUserModal,
  openResendInviteUserModal,
  closeEmailVerification,
  closeResendEmail,
  closeCategoryDrawer,
  closeDeleteCategory,
  closeProductDrawer,
  closeDeleteProduct,
  closeProductDetail,
  closeAddBuyers,
  closeDeleteBuyer,
  closeOrdersDrawer,
  closeDeleteOrder,
  closeOrderInvoice,
  closeAccessDenied,
  closeAvailable,
  closeBlockBuyer,
  closeAddressDrawer,
  closeDeleteAddress,
  closeImageShowModal,
  closeRejectCsvTableModal,
  closeProductSummaryModal,
  closeLogoutModal,
  closeInvateUserModal,
  closeRejectInviteUserModal,
  closeResendInviteUserModal
} = modalSlice.actions;
export default modalSlice.reducer;
