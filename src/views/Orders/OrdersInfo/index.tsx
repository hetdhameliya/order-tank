import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import { ArrowBackIcon } from "../../../assets/Esvgs";
import { Msg } from "../../../util/massages";
import ButtonComp from "../../../components/common/Button";
import { Grid } from "@mui/material";
import { OrderDetailData, OrderOfBuyerData } from "../../../constants/arrays";
import TableInfo from "../../../components/Table";
import { OrderedProductColumns } from "../../../constants/columns";
import { Item } from "../../../util/helpers";
import { Colors } from "../../../redux/constants/Colors";
import "../style.scss"
import { actions } from "../../../redux/store/store";
import OrderInvoice from "../../../components/shared/customModal/OrderInvoice/idex";
import useWindowDimensions from "../../../components/common/WindowDimensions";
import { viewOrderTableHeight } from "../../../constants/extras/calculatTableHeight";
import { objectInterface } from "../../../util/interface";
import { map } from 'rambda';

const OrdersInfo = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const OrderedBuyerData = OrderOfBuyerData(state);
  const OrdersData = OrderDetailData(state);
  const [orderedProduct, setOrderedProduct] = useState<objectInterface[]>([]);
  const [page, setPage] = useState<number>(1);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const data = state?.orderDetails?.map((item: objectInterface) => {
      return {
        category: item?.product?.category?.categoryName,
        product: item?.product?.productName,
        quantity: item?.quantity,
        price: item?.price,
        total: item?.totalAmt,
      };
    });
    setOrderedProduct(data);
  }, []);

  return (
    <>
      <div className="buyerInfo_container">
        <div className="d-flex align-items-center justify-content-between " style={{ marginTop: "-0.8rem", paddingBottom: "0.8rem" }}>
          <div className="d-flex align-items-center">
            <img
              src={ArrowBackIcon}
              style={{ marginRight: "15px", height: "1.4rem", cursor: "pointer" }}
              alt={Msg.NOT_FOUND}
              onClick={() => navigate("/orders")} />
            <h5 style={{ marginRight: "7px" }}>{Msg.ORDER}</h5>
            <h5 style={{ color: Colors.dark.black }}> / {state?.orderId}</h5>
          </div>
          <div>
            <ButtonComp
              className="invoice_btn"
              title={Msg.INVOICE}
              btnIcon={<LaunchIcon style={{ fontSize: "20px" }} />}
              size="large"
              btnonclick={() => actions.modal.openOrderInvoice(state)} />
          </div>
        </div>
        <div className="_content">
          <div className="detail gap-2">
            <div
              className="order_details"
              style={{
                padding: "14px",
                paddingTop: "8px",
                backgroundColor: Colors.light.white,
                borderRadius: "10px",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                width: "100%"
              }}>
              <h5 style={{ marginBottom: "0.5rem" }}>{Msg.CUSTOMER_DETAILS}</h5>
              <Grid container spacing={2}>
                {map(ele => (
                  <Grid item xs={12} sm={3} lg={3} md={3} key={ele.title}>
                    <Item style={{ backgroundColor: "#fafafa", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", padding: "5px 10px" }} >
                      <div style={{ padding: "1px" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            overflowWrap: "break-word",
                          }}>
                          <p style={{ color: "#272D2F80" }}>{ele?.title}</p>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <p style={{ color: Colors.dark.black, marginTop: "0px", fontSize: "13px" }}>
                              {ele?.data}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Item>
                  </Grid>
                ), OrderedBuyerData)}

                {map(ele => (
                  <Grid item xs={12} sm={3} lg={3} md={3} key={ele.title}>
                    <Item style={{ backgroundColor: "#fafafa", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", height: "100%", padding: "5px 10px" }}>
                      <div style={{ padding: "2px" }}>
                        <div
                          style={{ fontSize: "14px", fontWeight: "bold", overflowWrap: "break-word" }}>
                          <p style={{ color: "#272D2F80" }}>{ele?.title}</p>
                          {
                            ele?.title === Msg.DELIVERY_ADDRESS || ele?.title === Msg.BILLING_ADDRESS ? (
                              <p className="d-flex flex-column" style={{ color: Colors.dark.black, gap: "1px", marginTop: "0px" }}>
                                <span style={{ fontSize: "13px" }}>{ele?.data?.addressName}</span>
                                <span style={{ marginTop: "0px", fontSize: "13px" }}>
                                  {ele?.data?.addressLine}, {ele?.data?.city}, {ele?.data?.state}, {ele?.data?.pincode}
                                </span>
                              </p>
                            ) : (
                              <>
                                <p style={{ color: Colors.dark.black, marginTop: "1px", fontSize: "13px" }}>
                                  {ele?.data}
                                </p>

                                {ele?.data2 &&
                                  <p style={{ color: Colors.dark.black, marginTop: "2px", fontSize: "13px" }}>
                                    {ele?.data2 || "-"}
                                  </p>}
                              </>
                            )
                          }
                        </div>
                      </div>
                    </Item>
                  </Grid>
                ), OrdersData)}
              </Grid>
            </div>
          </div>

          <div className="orders_Table mt-4">
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "0.5rem" }}>
              <h5 className="mb-1">{Msg.ORDERED_ITEMSLIST}</h5>
              <div className="total_amount">
                <span style={{ fontSize: "15px", fontWeight: "600" }}>{Msg.TOTAL_AMOUNT} : </span>
                <span style={{ margin: "0px", fontSize: "15px", fontWeight: "600" }}>{` ₹ ${state?.totalAmount?.toFixed(2)}`}</span>
              </div>
            </div>
            <TableInfo
              tableData={orderedProduct}
              viewOrderTableHeight
              column={OrderedProductColumns()}
              page={page}
              setPage={setPage}
              height={viewOrderTableHeight(width)}
              notShownPagination={true}
              shortTypes={"ascCategory"} />
          </div>
        </div>
      </div>
      <OrderInvoice />
    </>
  );
}

export default OrdersInfo;
