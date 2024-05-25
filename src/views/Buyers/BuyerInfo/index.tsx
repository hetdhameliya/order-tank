/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Msg } from "../../../util/massages";
import "./style.scss";
import { Grid } from "@mui/material";
import { ArrowBackIcon } from "../../../assets/Esvgs";
import { BuyerDetailsArr, BuyerOrderCounts } from "../../../constants/arrays";
import TableInfo from "../../../components/Table";
import { useGetAllOrderQuery } from "../../../api/order";
import { OrdersColumns } from "../../../constants/columns";
import ReactDateRangePicker from "../../../components/common/DateRangePicker";
import Select from "../../../components/common/Select_Picker";
import { Status } from "../../../redux/constants/arrays";
import { actions } from "../../../redux/store/store";
import OrdersDrawer from "../../../components/shared/CustomDrawer/ordersDrawer";
import { Item } from "../../../util/helpers";
import { Dropdown, Popover } from "rsuite";
import DeleteOrder from "../../../components/shared/customModal/DeleteModal/DeleteOrder";
import { Colors } from "../../../redux/constants/Colors";
import { handleOrderBadge } from "../../../constants/extras/customBadge";
import { useSelector } from "react-redux";
import { objectInterface, permissionsInterface, reduxAuth } from "../../../util/interface";
import { map } from 'rambda';
import * as R from 'rambda';

const BuyersInfo = () => {

  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [orderPermission, setOrderPermission] = useState<permissionsInterface>();
  const { state: data } = useLocation();
  const buyersData = BuyerDetailsArr(data);
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [prevDate, setPrevDate] = useState(state);
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const wrapperRef = useRef(null);
  const [BuyerOrderCountArr, setBuyerOrderCountArr] = useState<any>([])
  const { data: Allorders, isFetching } = useGetAllOrderQuery(
    { fromDate: fromDate, toDate: toDate, status: status, isBuyerOrderWithMe: data?.createdByCompany?.id },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const roleAndPermission = R.pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const orderPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "order");
    setOrderPermission(orderPermission)
  }, [currentUser])

  useEffect(() => {
    if (!Allorders?.result) {
      setFilteredOrders([]);
      setBuyerOrderCountArr([])
    } else {
      const allordersResult = R.pathOr([], ['result', 'data'], Allorders);
      const orderCounts = R.pathOr([], ['result', 'counts'], Allorders);
      setFilteredOrders(allordersResult);
      setBuyerOrderCountArr(BuyerOrderCounts(orderCounts))
    }
  }, [Allorders, isFetching]);

  const onSelect = async (e: string, item: objectInterface) => {
    const performAction =
      R.ifElse(R.equals(Msg.EDIT), () => {
        const dataObj = {
          ...item,
          type: Msg.ORDEREDIT,
        };
        actions.modal.openOrdersDrawer(dataObj);
      },
        R.ifElse(R.equals(Msg.DELETE), () => actions.modal.openDeleteOrder(item?._id),
          R.ifElse(R.equals(Msg.VIEW), () => navigate("/ordersInfo", { state: item }),
            () => { }
          )
        )
      );
    performAction(e);
  };

  return (
    <>
      <div className="buyerInfo_container">
        <div className="d-flex align-items-center justify-content-between _header">
          <div className="d-flex align-items-center" style={{ marginTop: "-10px" }}>
            <img
              className="img"
              src={ArrowBackIcon}
              alt={Msg.NOT_FOUND}
              onClick={() => navigate("/buyers")} />
            <h5 style={{ marginRight: "7px" }}>{Msg.BUYER_TITLE}</h5>
            <h5 style={{ color: Colors.dark.black }}> / {data?.createdByCompany?.companyName}</h5>
          </div>
        </div>
        <div className="_content">
          <div className="buyer_details">
            <h4 style={{ marginBottom: "0.7rem" }}>
              {Msg.BUYER_DETAILS_HEADING}
            </h4>
            <Grid container spacing={2}>
              {map(ele => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={ele.title}>
                  <Item className="items">
                    <div>
                      <div className="items_div">
                        <p style={{ color: "#272D2F80" }}>{ele.title}</p>
                        <p style={{ color: Colors.dark.black, marginTop: "3px" }}>
                          {ele.data}
                        </p>
                      </div>
                    </div>
                  </Item>
                </Grid>
              ), buyersData)}
            </Grid>
          </div>
            <div className="order_listing mt-4">
              <div
                className="d-flex align-items-center justify-content-between mb-2"
                style={{ height: "50%" }}>
                <h5>{Msg.ORDERS}</h5>
                <div
                  className="d-flex align-items-center"
                  style={{ flexWrap: "wrap", justifyContent: "end" }}>
                  <div className="order_listing_div">
                    {!isFetching && BuyerOrderCountArr?.map((item: objectInterface, index: number) => {
                      if (item?.data && item?.data > 0) {
                        return (
                          <span key={index} style={handleOrderBadge(item?.title)}>{`${item?.title} : ${item?.data}`}</span>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                  <div
                    style={{ width: "200px" }}
                    className="me-4">
                    <Select
                      customHeight="47px"
                      customWidth="12.7rem"
                      borderRadius={"10px"}
                      options={Status}
                      Select_onchange={(e: any, values: any) => {
                        setStatus(values);
                      }}
                      selectedValue={status}
                      placeholder={Msg.STATUS} />
                  </div>
                  <ReactDateRangePicker
                    wrapperRef={wrapperRef}
                    state={state}
                    setState={setState}
                    prevDate={prevDate}
                    setPrevDate={setPrevDate}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                    showDateRangePicker={showDateRangePicker}
                    setShowDateRangePicker={setShowDateRangePicker}
                    showPlaceholder={true}
                    Placeholder={Msg.ORDER_DATE}
                    setPage={setPage} 
                    width={"205px"}
                    fontSize={"13px"}
                    />
                </div>
              </div>
              <TableInfo
                height={60}
                tableData={filteredOrders}
                column={OrdersColumns(onSelect, Msg.BUYERS_INFO, null, null, null, null, null, null, null, orderPermission)}
                page={page}
                setPage={setPage}
                rowHeight={80}
                Loader={isFetching}/>
            </div>
        </div>
      </div>
      <OrdersDrawer />
      <DeleteOrder />
    </>
  );
}

export default BuyersInfo;

// eslint-disable-next-line @typescript-eslint/ban-types
export const BuyersInfoMenu = (props: any, ref: any, onSelect: Function, item: any, permission: any) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const { onClose, left, top, className } = props;
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={(e: any) => {
        onSelect(e, item);
        onClose();
      }}>
        {permission?.isUpdate &&
          <Dropdown.Item eventKey={Msg.EDIT}
            style={{
              display: currentUser?.id === item?.createdBy?.id && item?.status === "pending" ? "" : "none",
            }}>{Msg.EDIT_UPPERCASE} </Dropdown.Item>}
        <Dropdown.Item eventKey={Msg.VIEW}>{Msg.VIEW_UPPERCASE}</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};
