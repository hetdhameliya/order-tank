import { Colors } from "../../redux/constants/Colors";
import { objectInterface } from "../../util/interface";

const { dark, light } = Colors;

const commonStyle: objectInterface = {
  borderRadius: "5px",
  padding: "4px 6px",
  textAlign: "center",
  width: "max-content",
  fontSize: "14px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
  height: "30px",
};
const completed: objectInterface = {
  backgroundColor: light.green,
  color: dark.green,
  border: `1px solid ${light.green}`,
};
const pending: objectInterface = {
  backgroundColor: dark.gray,
  color: light.white,
  border: `1px solid ${dark.gray}`,
};

const cancel: objectInterface = {
  backgroundColor: light.red,
  color: dark.red,
  border: `1px solid ${light.red}`,
};

const going: objectInterface = {
  backgroundColor: light.yellow,
  color: dark.yellow,
  border: `1px solid ${light.yellow}`,
};

const invoice: objectInterface = {
  backgroundColor: light.purple,
  color: dark.purple,
  border: `1px solid ${light.purple}`,
};

const partial: objectInterface = {
  backgroundColor: light.partial,
  color: dark.partial,
  border: `1px solid ${light.partial}`,
};

const pendingDashboard: objectInterface = {
  backgroundColor: dark.gray,
  color: light.white,
  border: `1px solid ${dark.gray}`,
  height: "25px",
  fontSize: "13px",
};

export const handleStatusesBadge = (status: string) => {
  if (status) {
    switch (status) {
      case "pending":
        return { ...commonStyle, ...pending };
      case "delivered":
        return { ...commonStyle, ...completed };
      case "partialDelivered":
        return { ...commonStyle, ...partial };
      case "accepted":
        return { ...commonStyle, ...completed };
      case "active":
        return { ...commonStyle, ...completed };
      case "processing":
        return { ...commonStyle, ...going };
      case "inProcess":
        return { ...commonStyle, ...going };
      case "cancelled":
        return { ...commonStyle, ...cancel };
      case "inactive":
        return { ...commonStyle, ...cancel };
      case "pendingDashboard":
        return { ...commonStyle, ...pendingDashboard };
      default:
        return commonStyle;
    }
  }
};

const commonStyles: objectInterface = {
  borderRadius: "5px",
  padding: "4px 3px",
  textAlign: "center",
  width: "auto",
  fontSize: "88%",
  fontWeight: "500",
  whiteSpace: "nowrap",
  textTransform: "capitalize",
  display: "flex",
  alignItems: "center",
  height: "28px",
  // marginRight: "14px"
};

export const handleOrderBadge = (status: string) => {
  if (status) {
    switch (status) {
      case "Total Orders":
        return { ...commonStyles, ...pending };
      case "Total Shipped":
        return { ...commonStyles, ...completed };
      case "Total Delivered":
        return { ...commonStyles, ...completed };
      case "Delivered":
        return { ...commonStyles, ...completed };
      case "Invoice":
        return { ...commonStyles, ...invoice };
      case "Today’s Money":
        return { ...commonStyles, ...pending };
      case "To Be Shipped":
        return { ...commonStyles, ...going };
      case "To Be Delivered":
        return { ...commonStyles, ...completed };
      case "Cancelled":
      case "Total Cancelled":
        return { ...commonStyles, ...cancel };
      case "Pending":
      case "Total Pending":
        return { ...commonStyles, ...pending };
      case "Partial Delivered":
      case "Total Partial Delivered ":
        return { ...commonStyles, ...partial };
      case "In Proccess":
      case "Total In Proccess":
        return { ...commonStyles, ...going };
      default:
        return commonStyle;
    }
  }
};




