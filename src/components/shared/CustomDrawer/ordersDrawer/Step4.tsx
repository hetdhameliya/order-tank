import moment from "moment";
import React from "react";
import "./style.scss";
import { Msg } from "../../../../util/massages";
import { TotalAmount } from ".";
import CloseIcon from '@mui/icons-material/Close';
import { objectInterface } from "../../../../util/interface";

const Step4 = ({ formData, productsData }: objectInterface) => {

  return (
    <>
      <div className="mt-4">z
        <h3>{Msg.ORDER_CONFIRMATION}</h3>
        <div
          className="d-flex align-items-center"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.BUYER_COMPANY_NAME} :</h5>
          <p className="order_confirmation_data ms-1">
            {formData?.buyerCompany?.label}
          </p>
        </div>
        <div style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          {formData?.products?.map((item: objectInterface, index: number) => {
            return (
              <>
                <div className="d-flex">
                  <div style={{ width: "8%" }} >
                    <h5>{`${index + 1}. `}</h5>
                  </div>
                  <div>
                    <div >
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {Msg.SELECT_PRODUCT_LABEL} :{" "}
                      </span>
                      <span style={{ fontSize: "18px" }}>
                        {item?.product?.label}
                      </span>
                    </div>
                    <div className="d-flex align-items-center" style={{ width: "450px" }}>
                      <div style={{ width: "25%" }}><h5>{Msg.PRICE_LABEL} : </h5></div>
                      <div style={{ width: "40%" }}><h5>{item.price} <CloseIcon style={{ fontSize: "18px" }} /> {item.quantity} {Msg.QTY}.</h5></div>
                      <div className="d-flex align-items-center justify-content-between" style={{ width: "35%" }}><h5>=</h5>
                        <h5>₹{(item.price * item.quantity)?.toFixed(2)}</h5></div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div
          className="d-flex"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.NOTES_LABEL}: </h5>
          <p
            className="order_confirmation_data ms-1"
            style={{ marginTop: "2px" }}>
            {formData.notes}
          </p>
        </div>
        <div
          className="d-flex align-items-center"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.SCHEDULRD_DATE_DATE} : </h5>
          <p
            className="order_confirmation_data ms-1"
            style={{ marginTop: "2px" }}>
            {moment(formData?.approxDeliveryDate?.$d).format("DD/MM/YYYY")}
          </p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.DELIVERY_ADDRESS}: </h5>
          <p
            className="order_confirmation_data ms-1 d-flex flex-column "
            style={{ marginTop: "2px" }}>
            <span>{formData?.deliveryAddress?.addressName}</span>
            <span>
              {formData?.deliveryAddress?.addressLine}, {formData?.deliveryAddress?.city}, {formData?.deliveryAddress?.state}, {formData?.deliveryAddress?.pincode}
            </span>
          </p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.BILLING_ADDRESS}: </h5>
          <p
            className="order_confirmation_data ms-1 d-flex flex-column "
            style={{ marginTop: "2px" }}>
            <span>{formData?.billingAddress?.addressName}</span>
            <span>
              {formData?.billingAddress?.addressLine}, {formData?.billingAddress?.city}, {formData?.billingAddress?.state}, {formData?.billingAddress?.pincode}
            </span>
          </p>
        </div>

        <div
          className="d-flex"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.SHIPPING_CHARGE}: </h5>
          <p
            className="order_confirmation_data ms-1"
            style={{ marginTop: "2px" }}>
            {Msg.SHIPPING_CHARGE_VALUE}
          </p>
        </div>

        <div
          className="d-flex"
          style={{ borderBottom: "1px dashed", padding: "15px 0px" }}>
          <h5>{Msg.ORDER_STATUS}: </h5>
          <p
            className="order_confirmation_data ms-1"
            style={{ marginTop: "2px" }}>
            {formData?.status?.label}
          </p>
        </div>
        <div className="total_amount mt-2">
          <TotalAmount products={productsData} />
        </div>
      </div>
    </>
  );
}

export default Step4;
