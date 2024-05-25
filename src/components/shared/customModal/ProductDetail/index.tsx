import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import Close from "@rsuite/icons/Close";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store/store";
import { Msg } from "../../../../util/massages";
import { CheckIcon, CloseIcon } from "../../../../assets/Esvgs";
import { Colors } from "../../../../redux/constants/Colors";
import { DefaultProductImg } from "../../../../assets/Esvgs"
import { reduxModal } from "../../../../util/interface";

const ProductDetailDialog = () => {
  const Product_Detail = useSelector((state: reduxModal) => state.modal.productDetail);
  const handleClose = () => {
    actions.modal.closeProductDetail(null);
  };

  return (
    <>
      <Modal
        open={Product_Detail.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={boxStyle}>
          <div
            className="modal_header"
            style={{ display: "flex", justifyContent: "right", padding: "10px 10px 0px 0px" }}>
            <IconButton onClick={handleClose}>
              <Close style={{ fontSize: "1.2rem" }} />
            </IconButton>
          </div>
          <div
            className="modal_content d-flex"
            style={{ padding: "0px 20px 20px 20px", alignItems: "center" }}>
            <div className="leftSide_img" style={{ width: "40%" }}>
              <div style={{ width: "100%" }}>
                <img
                  style={{ height: "250px", width: "100%", borderRadius: "16px", }}
                  src={Product_Detail?.id?.image ? Product_Detail?.id?.image : DefaultProductImg}
                  alt={Msg.NOT_FOUND} />
              </div>
            </div>
            <div className="RightSide_content" style={{ paddingLeft: "10px", width: "60%" }}>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.PRODUCT_NAME_LABEL} : </b>
                {Product_Detail?.id?.productName}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>
                  {Msg.PRODUCT_CATEGORY_LABEL} :
                </b>
                {Product_Detail?.id?.category?.categoryName}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.PRODUCT_UNIT_LABEL} : </b>
                {Product_Detail?.id?.unit}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.MIN_QUT_LABEL} : </b>
                {Product_Detail?.id?.minOrderQuantity || "-"}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.MAX_QUT_LABEL} : </b>
                {Product_Detail?.id?.maxOrderQuantity || "-"}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.PRODUCT_DESC_LABEL} : </b>
                {Product_Detail?.id?.description}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.PRICE_LABEL} : </b>{" "}
                ₹{Number(Product_Detail?.id?.price)?.toFixed(2)}
              </p>
              <p>
                <b style={{ fontSize: "16px" }}>{Msg.PRODUCT_AVAILABLE} : </b>
                <img
                  src={Product_Detail?.id?.isPublished ? CheckIcon : CloseIcon}
                  alt={Msg.NOT_FOUND}
                  style={{ marginTop: "-3px" }} />
              </p>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default ProductDetailDialog;

const boxStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: "800px",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
  padding: "0px 10px 20px 10px",
}
