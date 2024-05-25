import moment from "moment";
import { Msg } from "../util/massages";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { objectInterface } from "../util/interface";

export const arrOfOverviewData = [
  { title: Msg.TOTAL_ORDER, data: 200 },
  { title: Msg.TOTAL_SHIPPED, data: 200 },
  { title: Msg.TO_BE_DELIVERED, data: 200 },
  { title: Msg.INVOICED, data: 200 },
];

export const arrOfBuyersOrdersData = [
  { title: Msg.TODAYS_MONEY, data: "684 Qty.", daysData: "Last 30 day’s" },
  { title: Msg.TO_BE_SHIPPED, data: "684 Qty.", daysData: "Last 30 day’s" },
  { title: Msg.TO_BE_DELIVERED, data: "684 Qty.", daysData: "-" },
];

export const OrderCountDetails = (dataObj: objectInterface) => {
  const arr = [
    // { title: Msg.TODAYS_MONEY, data: Number(dataObj?.todayMoney)?.toFixed(2), daysData: "To day’s" },
    // { title: Msg.IN_PROCCESS, data: dataObj?.inProcessOrder, daysData: "Last 30 day’s" },
    // { title: Msg.DELIVERED, data: dataObj?.deliveredOrder, daysData: "All Delivered" },
    // { title: Msg.PARTIAL_DELIVERED, data: dataObj?.partialDeliveredOrder },
    { title: Msg.PENDING, data: dataObj?.pendingOrder },
    { title: Msg.CANCELLED, data: dataObj?.cancelledOrder },
  ]
  return arr;
}

export const BuyerOrderCounts = (dataObj: objectInterface) => {
  const arr = [
    { title: Msg.TOTAL_ORDERS, data: dataObj?.totalOrders, bg: "red" },
    { title: Msg.TOTAL_DELIVERED, data: dataObj?.deliveredOrder },
    { title: Msg.TOTAL_PENDING, data: dataObj?.pendingOrder },
    { title: Msg.TOTAL_CANCELLED, data: dataObj?.cancelledOrder },
    { title: Msg.TOTAL_INPROCESS, data: dataObj?.inProcessOrder },
    { title: Msg.TOTAL_PARTIAL_DELIVERED, data: dataObj?.partialDeliveredOrder },
  ]
  return arr;
}

export const BuyerDetailsArr = (dataObj: objectInterface) => {
  const arr = [
    ...(dataObj?.createdByCompany?.gstNo ? [{ title: Msg.GST_NO_LABEL, data: dataObj?.createdByCompany?.gstNo || "-" }] : []),
    ...(dataObj?.createdByCompany?.panNo ? [{ title: Msg.PAN_NO_LABEL, data: dataObj?.createdByCompany?.panNo || "-" }] : []),
    { title: Msg.COMPANY_NAME_LABEL, data: dataObj?.createdByCompany?.companyName || "-" },
    { title: Msg.BUYER_NAME, data: dataObj?.createdByCompany?.name || "-" },
    { title: Msg.PHONE_LABEL, data: dataObj?.createdByCompany?.phone || "-" },
    { title: Msg.EMAIL_LABEL, data: dataObj?.createdByCompany?.isAccountCreated ? dataObj?.createdBy?.email : dataObj?.createdByCompany?.email || "-" },
    {
      title: Msg.ADDRESS_NAME_LABEL,
      data: dataObj?.createdByCompany?.addresses[0]?.addressName || "-",
    },
    {
      title: Msg.ADDRESS_LINE_LABEL,
      data: dataObj?.createdByCompany?.addresses[0]?.addressLine || "-",
    },
    { title: Msg.STATE_LABEL, data: dataObj?.createdByCompany?.addresses[0]?.state || "-" },
    { title: Msg.CITY_LABEL, data: dataObj?.createdByCompany?.addresses[0]?.city || "-" },
  ];
  return arr;
};

export const OrderOfBuyerData = (dataObj: objectInterface) => {
  console.log(dataObj, "dataObj");
  console.log(dataObj?.createdByCompany?.id === dataObj?.createdBy?.company?.id, "dataObj1");
  console.log(dataObj?.createdByCompany, "2");

  const arr = [
    { title: Msg.BUYER_LABEL, data: dataObj?.createdByCompany?.companyName || "-" },
    {
      title: Msg.ORDER_DATE_LABEL,
      data: moment(dataObj?.createdAt).format("ll") || "-",
      lg: 2
    },
    {
      title: Msg.SCHEDULRD_DATE_DATE,
      data: moment(dataObj?.approxDeliveryDate).format("ll") || "-",
      lg: 2
    },
    { title: Msg.VIEW_ORDER_STATUS, data: dataObj?.status || "-", lg: 2 },
  ];
  return arr;
};

export const OrderDetailData = (dataObj: objectInterface) => {
  const arr = [
    { title: Msg.NOTES_LABEL, data: dataObj?.notes || "-", lg: 8 },
    { title: Msg.BILLING_ADDRESS, data: dataObj?.billingAddress || "-", lg: 12 },
    { title: Msg.DELIVERY_ADDRESS, data: dataObj?.deliveryAddress || "-", lg: 12 },
    { title: Msg.CONTACT_DETAILS, data: dataObj?.createdByCompany?.id === dataObj?.createdBy?.company?.id ? dataObj?.createdBy?.email : dataObj?.createdByCompany?.isAccountCreated ? dataObj?.createdByCompany?.createdBy?.email : "-", data2: dataObj?.createdByCompany?.id === dataObj?.createdBy?.company?.id ? dataObj?.createdBy?.phone : dataObj?.createdByCompany?.isAccountCreated ? dataObj?.createdByCompany?.createdBy?.phone : dataObj?.createdByCompany?.phone },
  ];
  return arr;
};

export const DashboardDataArr = (dataObj: objectInterface) => {
  const arr = [
    { title: Msg.ORDERS_TITLE, data: dataObj?.orders, icon: AssignmentIcon },
    { title: Msg.REVENUE_TITLE, data: dataObj?.revenue, icon: PaymentOutlinedIcon },
    { title: Msg.VOLUME_TOTLE, data: dataObj?.volume, icon: ViewInArOutlinedIcon },
    { title: Msg.TOTAL_BUYER, data: dataObj?.buyers, icon: Diversity3Icon },
  ]
  return arr;
}


export const orderStepsArr = [Msg.STEP_1, Msg.STEP_2, Msg.STEP_3, Msg.STEP_4];
export const publicRoutes = ["/login", "/forgetPassword"]
export const privateRoutes = ["/user", "/dashboard", "/category", "/product", "/buyers", "/buyersAdd", "/buyersEdit", "/buyersInfo", "/buyersRequest", "/orders", "/ordersInfo", "/profile"]
