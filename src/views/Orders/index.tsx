/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import HeaderTextLayout from "../../components/shared/HeaderTextLayout";
import { Msg } from "../../util/massages";
import { Dropdown, Form } from "rsuite";
import IconInputField from "../../components/common/TextField/IconInputField";
import TableInfo from "../../components/Table";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@rsuite/icons/Close";
import SearchIcon from "@rsuite/icons/Search";
import { useGetAllOrderQuery, useUpdateOrderStatusMutation } from "../../api/order";
import OrdersDrawer from "../../components/shared/CustomDrawer/ordersDrawer";
import { actions } from "../../redux/store/store";
import { OrdersColumns } from "../../constants/columns";
import { OrderCountDetails } from "../../constants/arrays";
import "./style.scss";
import DeleteOrder from "../../components/shared/customModal/DeleteModal/DeleteOrder";
import { useNavigate } from "react-router-dom";
import ReactDateRangePicker from "../../components/common/DateRangePicker";
import { DefaultStatus, Status } from "../../redux/constants/arrays";
import { handleOrderBadge } from "../../constants/extras/customBadge";
import { useSelector } from "react-redux";
import { Option } from "../../components/common/options/MessageOption";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReactSelectPicker } from "../../components/common/ReactSelectPicker";
import ProductSummary from "../../components/shared/customModal/ProductSummary/idex";
import useWindowDimensions from "../../components/common/WindowDimensions";
import { orderTableHeight } from "../../constants/extras/calculatTableHeight";
import { objectInterface, permissionsInterface, reduxAuth } from "../../util/interface";
import { pathOr } from 'rambda';
import * as R from 'rambda';

const Orders = () => {

  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [orderPermission, setOrderPermission] = useState<permissionsInterface>();
  const navigate = useNavigate();
  const [UpdateOrder] = useUpdateOrderStatusMutation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  const [page, setPage] = useState<number>(1);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [OrderStatus, setOrderStatus] = useState<any>(DefaultStatus);
  const [filterOrderStatus, setFilterOrderStatus] = useState<string[]>(["pending", "inProcess"]);
  // const [OrderCountfromDate, setOrderCountfromDate] = useState("");
  // const [OrderCounttoDate, setOrderCounttoDate] = useState("");
  const [orderStatusTable, setOrderStatusTable] = useState<any>({})
  const [showOrderEdit, setShowOrderEdit] = useState<any>({})
  const [onClickStatusFilter, setOnClickStatusFilter] = useState<string[]>(["pending", "inProcess"])
  const { width } = useWindowDimensions();
  // useEffect(() => {
  //   const thirtyDaysAgo = moment().subtract(30, "days").startOf("day").format("YYYY-MM-DD");
  //   const today = moment().endOf("day").format("YYYY-MM-DD");
  //   setOrderCountfromDate(thirtyDaysAgo);
  //   setOrderCounttoDate(today);
  // }, []);

  const [OrderCountDetailsArr, setorderCountDetailsArr] = useState<any>([])
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [prevDate, setPrevDate] = useState(state);
  const [toDate, setToDate] = useState("");
  const wrapperRef = useRef(null);

  const wrapperScheduledRef = useRef(null);
  const [stateScheduled, setStateScheduled] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [prevDateScheduled, setPrevDateScheduled] = useState(stateScheduled);
  const [scheduledFromDate, setScheduledFromDate] = useState("");
  const [scheduledToDate, setScheduledToDate] = useState("");
  const [showScheduledDateRangePicker, setShowScheduledDateRangePicker] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<any>([]);
  const [showOrderFilter, setShowOrderFilter] = useState<boolean>(true);

  const { data: Allorders, isFetching, refetch } = useGetAllOrderQuery(
    { fromDate: fromDate, toDate: toDate, fromApproxDate: scheduledFromDate, toApproxDate: scheduledToDate, search: searchValue, status: onClickStatusFilter },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const orderPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "order");
    setOrderPermission(orderPermission)
  }, [currentUser])

  useEffect(() => {
    if (OrderStatus?.length === 0) {
      setOnClickStatusFilter([])
      refetch();
    }
  }, [OrderStatus, refetch]);


  useEffect(() => {
    if (!Allorders?.result) {
      setFilteredOrders([]);
      setorderCountDetailsArr([])
    } else {
      const ordersData = pathOr([], ['result', 'data'], Allorders);
      const countsData = pathOr({}, ['result', 'counts'], Allorders);
      setFilteredOrders(ordersData);
      setorderCountDetailsArr(OrderCountDetails(countsData));
    }
  }, [Allorders, isFetching]);

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])

  useEffect(() => {
    if (selectedOrderId.length === 0) {
      setShowOrderFilter(true)
    } else {
      setShowOrderFilter(false)
    }
  }, [selectedOrderId])

  const onSelect = async (e: string, item: objectInterface) => {
    const performAction =
      R.ifElse(R.equals(Msg.EDIT),
        () => {
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

  const UpdatedOrderStatus = async (item: objectInterface) => {
    if ((item.status !== orderStatusTable[item?.id])) {
      actions.auth.setLoading(true);
      await UpdateOrder({
        id: item?.id,
        status: orderStatusTable[item?.id]
      })
      // eslint-disable-next-line prefer-const
      let edit = { ...showOrderEdit };
      edit[item?.id] = false;
      setShowOrderEdit(edit);
      actions.auth.setLoading(false);
    }
  }
  const handleSearch = () => {
    setPage(1);
    setSearchValue(searchQuery)
  }

  const handleClearSearch = () => {
    setPage(1);
    setSearchQuery("");
    setSearchValue("");
  };

  const [screenRow, setscreenRow] = useState<number>();

  const showPagerow = (rows: number) => {
    setscreenRow(rows)
  }

  const handleSelectChange = (selectedOptions: any[]) => {
    const selectedOrder = selectedOptions?.map((status) => {
      return status?.value
    })
    setOrderStatus(selectedOptions);
    setFilterOrderStatus(selectedOrder)
  };

  const filterByOrder = () => {
    setOnClickStatusFilter(filterOrderStatus)
    setPage(1)
  }

  const handleActionSelect = (val: string) => {
    if (val == "productSmmary") {
      actions.modal.openProductSummaryModal(
        { fromDate: fromDate, toDate: toDate, search: searchValue, status: onClickStatusFilter, ids: selectedOrderId })
    }
  }
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--flex-direction",
      showOrderFilter ? 'column' : 'row',
    );
  }, [showOrderFilter]);

  return (
    <>
      <div className="orders_wrapper">
        <div className="orders_header">
          <HeaderTextLayout
            title={Msg.ORDERS_LIST_HEADER}
            data={
              filteredOrders && filteredOrders.length > 0
                ? `${screenRow} ${Msg.TOTAL_ORDERS_FOUND} (${filteredOrders.length > 0 && filteredOrders.length < 10 ? "0".concat(filteredOrders.length) : filteredOrders.length} ${Msg.FOUND})`
                : ""}
            dataLength={
              Array.isArray(filteredOrders) ? filteredOrders.length : "0"}>
          </HeaderTextLayout>

          <Form className="order_header_info">

            {showOrderFilter && <div className="d-flex me-3 order_header_info_div"  >
              {!isFetching && OrderCountDetailsArr.map((item: objectInterface, index: number) => {
                if (item?.data && item?.data > 0) {
                  return (
                    <span key={index} style={handleOrderBadge(item?.title)}>{`${item?.title} : ${item?.title === Msg.TODAYS_MONEY ? "₹" : ""}${item?.data}`}</span>
                  );
                } else {
                  return null;
                }
              })}
            </div>}

            {showOrderFilter &&
              <div style={{ display: "flex" }}>
                <div>
                  <IconInputField
                    imgsrc={
                      <div className="search_div">
                        {searchQuery !== "" && (
                          <CloseIcon className="close_search" onClick={handleClearSearch} />
                        )}
                      </div>}
                    inputtype="text"
                    inputvalue={searchQuery}
                    inputonchange={(e: any) => {
                      if (e === "") {
                        setPage(1);
                        setSearchQuery("");
                        setSearchValue("")
                      }
                      setSearchQuery(e);
                    }}
                    inputplaceholder={Msg.SEARCH}
                    iconInputField_wrapper="searchWrapper"
                    height="45px" />
                </div>

                <div className="search_div">
                  <button
                    className="search_buttons"
                    onClick={handleSearch}>
                    <SearchIcon className="search_icon" />
                  </button>
                </div>
              </div>
            }

            {showOrderFilter &&
              <div className="order_header_status_div">
                <div style={{ width: "221px" }}>
                  <div>
                    <span className="status_label">{Msg.ORDER_STATUS}</span>
                  </div>

                  <div className="d-flex justify-content-end status_filter">
                    <ReactSelectPicker
                      value={OrderStatus}
                      options={Status}
                      isMulti
                      hideSelectedOptions={false}
                      placeholder={Msg.ORDER_STATUS}
                      closeMenuOnSelect={false}
                      onChange={(value: any) => handleSelectChange(value)}
                      SearchWithBtn={true}
                      components={{ Option, IndicatorSeparator: () => null }}
                      height="48px"
                      width="185px" />
                    <button onClick={filterByOrder} className="status_Search_btn" >
                      <CheckCircleOutlineIcon style={{ fontSize: "23px", display: "flex", textAlign: "center" }} />
                    </button>
                  </div>
                </div>
              </div>
            }

            {showOrderFilter &&
              <div style={{ marginRight: "8px" }}>
                <ReactDateRangePicker
                  wrapperRef={wrapperScheduledRef}
                  state={stateScheduled}
                  setState={setStateScheduled}
                  prevDate={prevDateScheduled}
                  setPrevDate={setPrevDateScheduled}
                  fromDate={scheduledFromDate}
                  setFromDate={setScheduledFromDate}
                  toDate={scheduledToDate}
                  setToDate={setScheduledToDate}
                  showDateRangePicker={showScheduledDateRangePicker}
                  setShowDateRangePicker={setShowScheduledDateRangePicker}
                  showPlaceholder={true}
                  Placeholder={Msg.SCHEDULED_DATE}
                  setPage={setPage}
                  width={"205px"}
                  fontSize={"13px"}
                />
              </div>
            }

            {showOrderFilter && <ReactDateRangePicker
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
            />}

            <div style={{ marginRight: showOrderFilter ? "0.5rem" : "2.5rem", marginLeft: "0.5rem" }}>
              <Dropdown title="Export" size="lg" onSelect={(val: any) => handleActionSelect(val)}>
                <Dropdown.Item eventKey="productSmmary" >{Msg.PRODUCT_SUMMARY}</Dropdown.Item>
              </Dropdown>
            </div>

            {(orderPermission?.isAdd && showOrderFilter) &&
              <button onClick={() => actions.modal.openOrdersDrawer(null)} className="add_order_btn" >
                <AddCircleOutlineIcon style={{ fontSize: "28px" }} />
              </button>}
          </Form>
        </div>
        <div className="orders_content">
          <TableInfo
            showPagerow={showPagerow}
            height={orderTableHeight(width)}
            orderTableHeight
            tableData={filteredOrders}
            column={OrdersColumns(onSelect, Msg.ORDER_INFO, UpdateOrder, orderStatusTable, setOrderStatusTable, UpdatedOrderStatus, showOrderEdit, setShowOrderEdit, currentUser, orderPermission)}
            checkedKeys={selectedOrderId}
            setCheckedKeys={setSelectedOrderId}
            page={page}
            setPage={setPage}
            rowHeight={80}
            Loader={isFetching}
            checkboxPosition={"unset"}
          />
        </div>
      </div>
      <OrdersDrawer setFromDate={setFromDate} setToDate={setToDate} setSearchValue={setSearchValue} setOrderStatus={setOrderStatus} />
      <DeleteOrder />
      <ProductSummary setSelectedOrderId={setSelectedOrderId} />
    </>
  );
}

export default Orders;



