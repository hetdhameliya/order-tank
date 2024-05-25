/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { Button, Checkbox, IconButton, Whisper } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import VisibleIcon from "@rsuite/icons/Visible";
import { CheckIcon, CloseIcon } from "../../assets/Esvgs";
import { Datakey, Msg } from "../../util/massages";
import moment from "moment";
import { handleStatusesBadge } from "../extras/customBadge";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BuyersInfoMenu } from "../../views/Buyers/BuyerInfo";
import { actions } from "../../redux/store/store";
import { Status } from "../../redux/constants/arrays";
import Select from "../../components/common/Select_Picker";
import DoneIcon from '@mui/icons-material/Done';
import "../../views/Orders/style.scss"
import CloseIcons from '@mui/icons-material/Close';
import { DefaultProductImg } from "../../assets/Esvgs";
import { BuyerImg } from "../../assets/Esvgs"
import PopOverMenu from "../../components/common/PopOverMenu";
import NoAccountsOutlinedIcon from '@mui/icons-material/NoAccountsOutlined';
import SyncIcon from '@mui/icons-material/Sync';

export const CategoryColumns = (onSelect: Function, categoryPermission: any) => {

  const column = [
    {
      headercell: Msg.CATEGORY_HC_CODE,
      dataKey: Datakey.CATEGORY_CODE,
      width: 300,
      sortable: true,
    },
    {
      headercell: Msg.CATEGORY_HC,
      dataKey: Datakey.NAME,
      flexGrow: 2,
      sortable: true,
    },
    {
      dataKey: (categoryPermission?.isUpdate || categoryPermission?.isDelete) ? "" : "HIDE",
      align: "center",
      render: (item: any) => {
        return (
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", cursor: "pointer" }}>
              {categoryPermission?.isUpdate &&
                <div
                  onClick={() => onSelect(item, Datakey.EDIT_CATEGORY)}
                  style={{ fontSize: "1.1rem", paddingTop: "0", paddingBottom: "0" }}>
                  <EditIcon />
                </div>}

              {categoryPermission?.isDelete &&
                <div
                  onClick={() => onSelect(item, Datakey.DELETE_CATEGORY)}
                  style={{ color: "red", fontSize: "1.1rem" }}>
                  <TrashIcon />
                </div>}
            </div>
          </>
        );
      },

    },
  ];
  return column;
};

export const CategoryRejectCsvColumns = () => {

  const column = [
    {
      headercell: Msg.CATEGORY_HC_CODE,
      dataKey: Datakey.CATEGORY_CODE,
      width: 300,
      sortable: true,
    },
    {
      headercell: Msg.CATEGORY_HC,
      dataKey: Datakey.NAME,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.REASON_HC,
      dataKey: "message",
      sortable: true,
      align: "left",
      width: 300,
    },
  ];
  return column;
};

export const ProductColumns = (onSelect: Function, productPermission: any) => {
  const handleItemMenu = (item: any) => {
    return {
      edit: true,
      delete: !item?.isOneTimeUsed,
      view: true,
    }
  }
  const column = [
    {
      header: (checked: any, indeterminate: any, handleCheckAll: Function) => {
        return (
          <Checkbox
            inline
            checked={checked}
            indeterminate={indeterminate}
            onChange={(value, checked) => handleCheckAll(value, checked)}
            style={{ marginTop: "-7px" }} />
        );
      },
      dataKey: Datakey.ID,
      width: 60,
      align: "center",
      render: (rowData: any, checkedKeys: any, handleCheck: Function) => {
        return (
          <>
            <Checkbox
              value={rowData["id"]}
              inline
              onChange={(value, checked) => handleCheck(value, checked)}
              checked={checkedKeys?.some(
                (item: any) => item === rowData["id"]
              )}
              style={{ marginTop: "-7px" }} />
          </>
        );
      },
    },
    {
      headercell: Msg.IMAGE_HC,
      dataKey: Datakey.IMAGE,
      width: 100,
      align: "center",
      render: (item: any) => {
        return (
          <div onClick={() => actions.modal.openImageShowModal({ image: item?.image, defImg: DefaultProductImg })}>
            <img
              src={item?.image ? `${item?.image}` : DefaultProductImg}
              alt={Msg.NOT_FOUND}
              style={{
                width: "40px",
                height: "40px",
                marginTop: "-10px",
                marginBottom: "-10px",
                borderRadius: "50%",
                cursor: "pointer"
              }} />
          </div>
        );
      },
    },
    {
      headercell: Msg.SKU_HOC,
      dataKey: Datakey.SKU,
      width: 120,
      sortable: true,
    },
    {
      headercell: Msg.NAME_HC,
      dataKey: Datakey.PRODUCT_NAME,
      width: 150,
      sortable: true,
    },
    {
      headercell: Msg.CATEGORY_HC,
      dataKey: Datakey.CATEGORY_NAME,
      render: (item: any) => item?.category ? item?.category?.categoryName : "-",
      width: 190,
      sortable: true,
    },
    {
      headercell: Msg.UNIT_HC,
      dataKey: Datakey.UNIT,
      sortable: true,
      width: 100,
      render: (item: any) => item?.unit ? item?.unit : "-",
    },
    {
      headercell: Msg.QUT_RANGE_HC,
      dataKey: Datakey.MIN_QUANTITY,
      sortable: true,
      width: 190,
      render: (item: any) => {
        return (
          <span>
            {item?.minOrderQuantity || item?.maxOrderQuantity
              ? (
                (item?.minOrderQuantity) !== "0" || (item?.maxOrderQuantity) !== "0"
                  ? (`${item?.minOrderQuantity === "0" ? 0 : item?.minOrderQuantity} - ${item?.maxOrderQuantity === "0" ? 0 : item?.maxOrderQuantity}`)
                  : ("-")) :
              ("-")}
          </span>
        )
      }
    },
    {
      headercell: Msg.DESCRIPTION_HC,
      dataKey: Datakey.DESCRIPTION,
      sortable: true,
      flexGrow: 1,
      render: (item: any) => item?.description ? item?.description : "-",
    },
    {
      headercell: Msg.PRICE_HC,
      dataKey: Datakey.PRICE,
      sortable: true,
      width: 120,
      render: (item: any) => `₹${Number(item?.price)?.toFixed(2)}`
    },
    {
      headercell: Msg.AVAILABLE_HC,
      dataKey: Datakey.ISPublished,
      sortable: true,
      align: "left",
      width: 140,
      render: (item: any) => {
        return (
          <>
            <img
              style={{
                marginTop: "-10px",
                marginBottom: "-10px",
              }}
              src={item.isPublished ? CheckIcon : CloseIcon}
              alt={Msg.NOT_FOUND} />
          </>
        );
      },
    },
    {
      dataKey: "",
      align: "center",
      width: 60,
      render: (item: any) => {
        return (
          <>
            <Whisper placement="leftStart" trigger="click" speaker={(props: any, ref: any) => PopOverMenu(props, ref, onSelect, item, handleItemMenu(item), productPermission, "product")}>
              <IconButton appearance="subtle" style={{ padding: 0 }} icon={<MoreVertIcon style={{ fontSize: "20px" }} />} />
            </Whisper>
          </>
        );
      },
    },
  ];
  return column;
};

export const ProductRejectColumns = () => {
  const column = [
    {
      headercell: Msg.SKU_HOC,
      dataKey: Datakey.SKU,
      width: 120,
      sortable: true,
    },
    {
      headercell: Msg.NAME_HC,
      dataKey: Datakey.PRODUCT_NAME,
      width: 150,
      sortable: true,
    },
    {
      headercell: Msg.CATEGORY_HC,
      dataKey: Datakey.NAME,
      width: 190,
      sortable: true,
    },
    {
      headercell: Msg.UNIT_HC,
      dataKey: Datakey.UNIT,
      sortable: true,
      width: 100,
      render: (item: any) => item?.unit ? item?.unit : "-",
    },
    {
      headercell: Msg.DESCRIPTION_HC,
      dataKey: Datakey.DESCRIPTION,
      sortable: true,
      flexGrow: 1,
      render: (item: any) => item?.description ? item?.description : "-",
    },
    {
      headercell: Msg.PRICE_HC,
      dataKey: Datakey.PRICE,
      sortable: true,
      width: 120,
      render: (item: any) => `₹${Number(item?.price)?.toFixed(2)}`
    },
    {
      headercell: Msg.AVAILABLE_HC,
      dataKey: Datakey.ISPublished,
      sortable: true,
      align: "left",
      width: 120,
      render: (item: any) => {
        return (
          <>
            <img style={{ marginTop: "-10px", marginBottom: "-10px" }} src={item.isPublished ? CheckIcon : CloseIcon} alt={Msg.NOT_FOUND} />
          </>
        );
      },
    },
    {
      headercell: Msg.REASON_HC,
      dataKey: "message",
      sortable: true,
      align: "left",
      width: 250,
    },
  ];
  return column;
};

export const BuyersColumns = (onSelect: Function, currentUser: any, buyerPermission: any) => {
  const handleItemMenu = (item: any) => {
    return {
      edit: !item?.createdByCompany?.isAccountCreated && item?.createdByCompany?.createdBy?.id === currentUser?.id,
      delete: !item?.createdByCompany?.isAccountCreated && item?.createdByCompany?.createdBy?.id === currentUser?.id,
      view: true,
      block: item?.isActive,
      accepted: !item?.isActive,
    }
  }
  const column = [
    {
      headercell: Msg.COMPANY_NAME_HC,
      dataKey: "createdByCompany.companyName",
      flexGrow: 2,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <div className="d-flex align-items-center" >
              <img
                src={item?.createdByCompany?.logo ? item?.createdByCompany?.logo : BuyerImg}
                alt={Msg.NOT_FOUND}
                style={{
                  width: "40px",
                  height: "40px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                  borderRadius: "50%",
                  cursor: "pointer"
                }}
                onClick={() => actions.modal.openImageShowModal({ image: item?.createdByCompany?.logo, defImg: BuyerImg })} />
              <p style={{ marginLeft: "1rem" }}>{item?.createdByCompany?.companyName}</p>
            </div>
          </>
        );
      },
    },
    {
      headercell: Msg.BUYER_NAME_HC,
      dataKey: "createdByCompany.name",
      flexGrow: 2,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <div style={{ marginLeft: "1rem" }}>
              {
                item?.createdByCompany?.isAccountCreated ? (
                  <>
                    <p style={{ fontWeight: "bold" }}>{item?.createdBy?.name}</p>
                    <p>{item?.createdBy?.email && item?.createdBy?.email}</p>
                  </>
                ) : (
                  <p style={{ fontWeight: "bold" }}>{item?.createdByCompany?.name}</p>
                )
              }
            </div>
          </>
        );
      },
    },
    {
      headercell: Msg.PHONE_NO_HC,
      dataKey: "createdByCompany.phone",
      flexGrow: 2,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <div style={{ marginLeft: "1rem" }}>
              {
                item?.createdByCompany?.isAccountCreated ? (
                  <p style={{ fontWeight: "bold" }}>{item?.createdBy?.phone}</p>
                ) : (
                  <p style={{ fontWeight: "bold" }}>{item?.createdByCompany?.phone}</p>
                )
              }
            </div>
          </>
        );
      },
    },
    {
      headercell: Msg.VERIFY_BUYER,
      dataKey: "createdByCompany.isAccountCreated",
      sortable: true,
      width: 200,
      render: (item: any) => {
        return <>{item?.createdByCompany?.isAccountCreated ? Msg.YES : Msg.NO} </>;
      },
    },
    {
      headercell: Msg.STATUS_HC,
      dataKey: "isActive",
      sortable: true,
      width: 200,
      render: (item: any) => {
        return (
          <div style={handleStatusesBadge(item?.isActive ? "active" : "inactive")} >
            {item?.isActive ? "Active" : "InActive"}
          </div >
        )
      },
    },
    {
      dataKey: "",
      align: "center",
      width: 150,
      render: (item: any) => {
        return (
          <>
            <Whisper placement="leftStart" trigger="click" speaker={(props: any, ref: any) => PopOverMenu(props, ref, onSelect, item, handleItemMenu(item), buyerPermission, "buyer")}>
              <IconButton appearance="subtle" style={{ padding: 0 }} icon={<MoreVertIcon style={{ fontSize: "20px" }} />} />
            </Whisper>
          </>
        );
      },
    },
  ];
  return column;
};

export const CompanyReqColumns = (onSelect: Function, buyerPermission: any) => {
  const column = [
    {
      headercell: Msg.COMPANY_NAME_HC,
      dataKey: "createdByCompany.companyName",
      flexGrow: 2,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <div className="d-flex align-items-center" >
              <img
                src={item?.createdByCompany?.logo ? item?.createdByCompany?.logo : BuyerImg}
                alt={Msg.NOT_FOUND}
                style={{
                  width: "40px",
                  height: "40px",
                  marginTop: "-10px",
                  marginBottom: "-10px",
                  borderRadius: "50%",
                  cursor: "pointer"
                }}
                onClick={() => actions.modal.openImageShowModal({ image: item?.createdByCompany?.logo, defImg: BuyerImg })} />
              <p style={{ marginLeft: "1rem" }}>{item?.createdByCompany?.companyName}</p>
            </div>
          </>
        );
      },
    },
    {
      headercell: Msg.BUYER_NAME_HC,
      dataKey: "ncreatedByCompany.name",
      flexGrow: 2,
      render: (item: any) => {
        return (
          <>
            <div style={{ marginLeft: "1rem" }}>
              {
                item?.createdByCompany?.isAccountCreated ? (
                  <>
                    <p style={{ fontWeight: "bold" }}>{item?.createdBy?.name}</p>
                    <p>{item?.createdBy?.email && item?.createdBy?.email}</p>
                  </>
                ) : (
                  <p style={{ fontWeight: "bold" }}>{item?.createdByCompany?.name}</p>
                )
              }
            </div>
          </>
        );
      },
    },
    {
      headercell: Msg.CONTACT_HC,
      dataKey: "createdByCompany.phone",
      sortable: true,
      width: 200,
      render: (item: any) => {
        return <>
          <div style={{ marginLeft: "1rem" }}>
            {
              item?.createdByCompany?.isAccountCreated ? (
                <p style={{ fontWeight: "bold" }}>{item?.createdBy?.phone}</p>
              ) : (
                <p style={{ fontWeight: "bold" }}>{item?.createdByCompany?.phone}</p>
              )
            }
          </div> </>
      },
    },
    {
      headercell: Msg.STATUS_HC,
      dataKey: buyerPermission?.isUpdate ? "" : "HIDE",
      align: "left",
      width: 300,
      render: (item: any) => {
        return (
          <>
            <div>
              <Button
                color="green"
                appearance="primary"
                style={{ padding: "8px 30px" }}
                onClick={() => onSelect(item, Datakey.ACCEPT)}>
                {Msg.ACCEPT}
              </Button>
              <Button
                color="red"
                appearance="primary"
                style={{ marginLeft: "10px", padding: "8px 30px" }}
                onClick={() => onSelect(item, Datakey.REJECT)}>
                {Msg.REJECT}
              </Button>
            </div>
          </>
        );
      },
    }

  ];
  return column;
};

export const OrdersColumns = (onSelect: Function, type: any, UpdateOrder?: any, orderStatusTable?: any, setOrderStatusTable?: any, UpdatedOrderStatus?: any, showOrderEdit?: any, setShowOrderEdit?: any, currentUser?: any, orderPermission?: any) => {

  const handleStatusesText = (status: any) => {
    switch (status) {
      case "pending":
        return "pending";
      case "inProcess":
        return "In Processing";
      case "delivered":
        return "delivered";
      case "partialDelivered":
        return "partial Delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  const column = [
    {
      header: (checked: any, indeterminate: any, handleCheckAll: Function) => {
        return (
          <Checkbox
            inline
            checked={checked}
            indeterminate={indeterminate}
            onChange={(value, checked) => handleCheckAll(value, checked)}
            style={{ marginTop: "-7px" }} />
        );
      },
      dataKey: type === Msg.ORDER_INFO ? Datakey.ID : "HIDE",
      width: 60,
      align: "center",
      render: (rowData: any, checkedKeys: any, handleCheck: Function) => {
        return (
          <>
            <Checkbox
              value={rowData["id"]}
              inline
              onChange={(value, checked) => handleCheck(value, checked)}
              checked={checkedKeys?.some(
                (item: any) => item === rowData["id"]
              )}
              style={{ marginTop: "-7px" }} />
          </>
        );
      },
    },
    {
      headercell: Msg.ORDER_NUMBER_HC,
      dataKey: "orderId",
      flexGrow: 1.3,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.orderId ? item?.orderId : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.COMPANY_NAME_HC,
      dataKey: "createdByCompany.companyName",
      flexGrow: 1.3,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdByCompany?.companyName}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.ORDER_DATE_HC,
      dataKey: "orderDate",
      flexGrow: 1.8,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdAt ? moment(item?.createdAt).format("ll hh:mm A") : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.SCHEDULRD_DATE_DATE,
      dataKey: "approxDeliveryDate",
      flexGrow: 1.3,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{moment(item?.approxDeliveryDate).format("ll")}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.DELIVERED_DATE_HC,
      dataKey: "deliveryAt",
      flexGrow: 1.8,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.deliveryAt ? moment(item?.deliveryAt).format("ll hh:mm") : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.ITEMS_HC,
      dataKey: Datakey.TOTAL_ITEM,
      sortable: true,
      render: (item: any) => `${item?.itemCount || "-"}`,
      flexGrow: 0.8,
    },
    {
      headercell: Msg.TOTAL_AMOUNT_HC,
      dataKey: Datakey.TOTAL_AMOUNT,
      sortable: true,
      render: (item: any) => `₹${item?.totalAmount?.toFixed(2)}`,
      flexGrow: 1.4,
    },
    {
      sortable: true,
      headercell: Msg.STATUS_HC,
      dataKey: "status",
      align: "left",
      flexGrow: 2.3,
      render: (item: any, checkedKeys: any, handleCheck: any, index: any) => {
        return (
          <>
            <div >
              {type === Msg.ORDER_INFO ?
                item?.status === "pending" || item?.status === "inProcess" || item?.status === "partialDelivered" ? (
                  <>
                    {showOrderEdit[item?.id] ? <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', gap: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        < Select
                          borderRadius={"10px"}
                          disableClearable={true}
                          options={Status}
                          Select_onchange={async (e: any, values: any) => {
                            let newRole = { ...orderStatusTable };
                            newRole[item?.id] = values?.value;
                            setOrderStatusTable(newRole);
                          }}
                          selectedValue={{ label: (orderStatusTable[item?.id] || item?.status), value: (orderStatusTable[item?.id] || item?.status) }}
                          customHeight="36px"
                          customWidth="139px" />
                      </div>

                      <div style={{ display: "flex", gap: "5px", marginLeft: "0.3rem" }}>
                        <div onClick={() => UpdatedOrderStatus(item, index)} >
                          <DoneIcon sx={{ fontSize: "20px", cursor: "pointer" }} />
                        </div>

                        <div onClick={() => {
                          let edit = { ...showOrderEdit };
                          edit[item?.id] = false;
                          setShowOrderEdit(edit);
                        }} >
                          <CloseIcons sx={{ fontSize: "20px", cursor: "pointer" }} />
                        </div>
                      </div>

                    </div> : <div style={{ display: "flex", alignItems: "center", gap: "2rem", justifyContent: "space-between" }} >

                      <div style={handleStatusesBadge(item.status)}>
                        {handleStatusesText(item?.status)}
                      </div>

                      {orderPermission?.isUpdate &&
                        <div onClick={() => {
                          //set deaflt status
                          let newRole = { ...orderStatusTable };
                          newRole[item?.id] = item?.status;
                          setOrderStatusTable(newRole);
                          let edit = { ...showOrderEdit };
                          edit[item?.id] = true;
                          setShowOrderEdit(edit);
                        }}>
                          <EditIcon style={{ fontSize: "15px", cursor: "pointer" }} />
                        </div>
                      }
                    </div>}
                  </>
                ) : (<div style={handleStatusesBadge(item.status)}>
                  {handleStatusesText(item?.status)}
                </div>)
                : (<div style={handleStatusesBadge(item.status)}>
                  {handleStatusesText(item?.status)}
                </div>)}
            </div >
          </>
        );
      },
    },
    type === Msg.ORDER_INFO
      ? {
        dataKey: "",
        align: "center",
        flexGrow: 1,
        render: (item: any) => {
          return (
            <>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", cursor: "pointer" }}>
                <div
                  onClick={() => onSelect(Msg.VIEW, item)}
                  style={{ fontSize: "1.1rem", marginRight: (item?.status !== "pending" || currentUser?.id !== item?.createdBy?.id) ? "25px" : "" }}>
                  <VisibleIcon />
                </div>
                {(item?.status === "pending") && currentUser?.id === item?.createdBy?.id ? (
                  orderPermission?.isUpdate && <div
                    onClick={() => onSelect(Msg.EDIT, item)}
                    style={{ fontSize: "1.1rem" }}>
                    <EditIcon />
                  </div>
                ) : (null)}
                {/* <div
                  onClick={() => onSelect(Msg..DELETE, item)}
                  style={{ color: "red", fontSize: "1.1rem" }}>
                  <TrashIcon />
                </div> */}
              </div>
            </>
          );
        },
      } : {
        headercell: "",
        dataKey: "id",
        render: (item: any) => {
          return (
            <Whisper placement="autoVerticalStart" trigger="click" speaker={(props: any, ref: any) => BuyersInfoMenu(props, ref, onSelect, item, orderPermission)}>
              <IconButton appearance="subtle" icon={<MoreVertIcon style={{ fontSize: "20px" }} />} />
            </Whisper>
          )
        }
      }
  ];

  return column;
};

export const OrderedProductColumns = () => {
  const column = [
    {
      headercell: Msg.CATEGORY_ORDERINFO_HC,
      dataKey: Datakey.CATEGORY,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.PPODUCT_NAME_HC,
      dataKey: Datakey.PRODUCT,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.QUANTITY_HC,
      dataKey: Datakey.QUANTITY,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.PRICE_HC,
      dataKey: Datakey.PRICE,
      flexGrow: 2,
      sortable: true,
      render: (item: any) => `₹${Number(item?.price)?.toFixed(2)}`
    },
    {
      headercell: Msg.TOTAL_PRICE_HC,
      dataKey: Datakey.TOTAL_PRICE,
      flexGrow: 2,
      sortable: true,
      render: (item: any) => `₹${Number(item?.total)?.toFixed(2)}`
    },
  ];
  return column;
};


export const OrderedDashboardColumns = () => {
  const handleStatusesText = (status: any) => {
    switch (status) {
      case "pending":
        return "pending";
      case "inProcess":
        return "In Processing";
      case "delivered":
        return "delivered";
      case "partialDelivered":
        return "partial Delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };
  const column = [
    {
      headercell: Msg.ORDER_NUMBER_HC,
      dataKey: "orderId",
      flexGrow: 1.5,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.orderId ? item?.orderId : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.COMPANY_NAME_HC,
      dataKey: "createdByCompany.companyName",
      sortable: true,
      flexGrow: 3,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdByCompany?.companyName}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.ORDER_DATE_HC,
      dataKey: "orderDate",
      sortable: true,
      flexGrow: 2.5,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdAt ? moment(item?.createdAt).format("ll hh:mm A") : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.SCHEDULRD_DATE_DATE,
      dataKey: "approxDeliveryDate",
      sortable: true,
      flexGrow: 2,
      render: (item: any) => {
        return (
          <>
            <p>{moment(item?.approxDeliveryDate).format("ll")}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.TOTAL_AMOUNT_HC,
      dataKey: Datakey.TOTAL_AMOUNT,
      sortable: true,
      flexGrow: 1.5,
      render: (item: any) => `₹${item?.totalAmount?.toFixed(2)}`,
    },
    {
      sortable: true,
      headercell: Msg.STATUS_HC,
      dataKey: "status",
      align: "left",
      flexGrow: 1,
      render: (item: any) => {
        return (
          <div style={handleStatusesBadge("pendingDashboard")}>
            {handleStatusesText(item?.status)}
          </div>
        );
      },
    },
  ];
  return column;
};

export const AddressColumns = (onSelect: any, addressPermission: any) => {
  const column = [
    {
      headercell: Msg.ADDRESS_NAME_HOC,
      dataKey: Datakey.ADDRESS_NAME,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.ADDRESS_LINE_HOC,
      dataKey: Datakey.ADDRESS_LINE,
      flexGrow: 3,
      sortable: true,
    },
    {
      headercell: Msg.STATE_HOC,
      dataKey: Datakey.STATE,
      flexGrow: 2,
      sortable: true,
    },
    {
      headercell: Msg.CITY_HOC,
      dataKey: Datakey.CITY,
      flexGrow: 1,
      sortable: true,
    },
    {
      headercell: Msg.PINCODE_HOC,
      dataKey: Datakey.PINCODE,
      flexGrow: 2,
      sortable: true,
    },
    {
      dataKey: addressPermission?.isDelete || addressPermission?.isUpdate ? "" : "HIDE",
      align: "center",
      render: (item: any) => {
        return (
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", cursor: "pointer" }}>
              {addressPermission?.isUpdate && <div
                onClick={() => onSelect(Msg.EDIT, item)}
                style={{ fontSize: "1.1rem", paddingTop: "0", paddingBottom: "0", marginRight: item?.isPriority && "25px" }}>
                <EditIcon />
              </div>}
              {
                (!item?.isPriority && addressPermission?.isDelete) && <div
                  onClick={() => onSelect(Msg.DELETE, item)}
                  style={{ color: "red", fontSize: "1.1rem" }}>
                  <TrashIcon />
                </div>
              }
            </div>
          </>
        );
      },
    }
  ];
  return column;
};

export const inviteUserColumns = (companyPermission: any) => {
  const column = [
    {
      sortable: true,
      headercell: Msg.DATE_TITLE,
      dataKey: "orderDate",
      flexGrow: 2.5,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdAt ? moment(item?.createdAt).format("ll hh:mm A") : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.INVITING_SUPER_ADMIN_TITLE,
      dataKey: "createdBy",
      flexGrow: 2,
      sortable: true,
      render: (item: any) => {
        return (
          <>
            <p>{item?.createdBy?.email}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.EMAIL_TITLE,
      dataKey: Datakey?.USER_EMAIL,
      flexGrow: 2,
      sortable: true,
    },
    {
      dataKey: companyPermission?.isUpdate || companyPermission?.isDelete ? "" : "HIDE",
      align: "center",
      render: (item: any) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
              {companyPermission?.isUpdate && <div
                onClick={() => actions.modal.openResendInviteUserModal(item)}
                style={{ paddingTop: "0", paddingBottom: "0", cursor: "pointer" }}>
                <SyncIcon style={{ fontSize: "21px" }} />
              </div>}
              {companyPermission?.isDelete && <div
                onClick={() => actions.modal.openRejectInviteUserModal(item)}
                style={{ paddingTop: "0", paddingBottom: "0", cursor: "pointer" }}>
                <NoAccountsOutlinedIcon style={{ fontSize: "21px" }} />
              </div>}
            </div>
          </>
        );
      },
    }
  ];
  return column;
};


export const CurrentUserColumns = (companyPermission: any, currentUsers: any) => {
  const column = [
    {
      sortable: true,
      headercell: Msg.DATE_TITLE,
      dataKey: "orderDate",
      flexGrow: 2.5,
      render: (item: any) => {
        return (
          <>
            <p>{item?.updatedAt ? moment(item?.updatedAt).format("ll hh:mm A") : "-"}</p>
          </>
        );
      },
    },
    {
      headercell: Msg.EMAIL_TITLE,
      dataKey: Datakey?.USER_EMAIL,
      flexGrow: 2,
      sortable: true,
    },
    {
      dataKey: companyPermission?.isDelete || companyPermission?.isUpdate ? "" : "HIDE",
      align: "center",
      render: (item: any) => {
        return (
          <>
            {Number(currentUsers?.id) !== Number(item?.user?.id) && <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", cursor: "pointer" }}>
              {companyPermission?.isUpdate &&
                <div onClick={() => actions.modal.openInvateUserModal(item)}  >
                  <EditIcon style={{ fontSize: "15px", cursor: "pointer" }} />
                </div>
              }
              {companyPermission?.isDelete &&
                <div
                  onClick={() => actions.modal.openRejectInviteUserModal(item)}
                  style={{ fontSize: "15px", paddingTop: "0", paddingBottom: "0", color: "red" }}>
                  <TrashIcon />
                </div>
              }
            </div>}
          </>
        );
      },
    }
  ];
  return column;
};