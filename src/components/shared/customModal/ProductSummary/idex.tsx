import { Box, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { actions } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import ButtonComp from "../../../common/Button/index";
import { Msg } from "../../../../util/massages";
import { Colors } from "../../../../redux/constants/Colors";
import "./style.scss";
import { fetchProductSummaryPdfUrl } from "../../../../api/order";
import { reduxAuth, reduxModal } from "../../../../util/interface";

interface ProductSummaryProps {
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number[]>>;
}

const ProductSummary = ({setSelectedOrderId}:ProductSummaryProps) => {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isLoading = useSelector((state: reduxAuth) => state.auth.isLoading);

  const openOrderInvoiceModal = useSelector(
    (state: reduxModal) => state.modal.productSummary
  );

  useEffect(() => {
    if (openOrderInvoiceModal.open) {
      fetchProductSummaryPdfUrl(openOrderInvoiceModal?.id, setPdfUrl)
    }
  }, [openOrderInvoiceModal.open]);

  const handleClose = () => {
    actions.modal.closeProductSummaryModal(null);
    setSelectedOrderId([])
  };

  return (
    <Modal
      open={openOrderInvoiceModal.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        sx={boxStyle}>
        {
          pdfUrl ? (
            <iframe
              src={pdfUrl || ""}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ paddingBottom: "4rem" }} />
          ) : (
            !isLoading && <div className="invoice_not_found">{Msg.NOT_FOUND}</div>
          )
        }
        <div className="modal_footer" style={modalFooterStyle}>
          <ButtonComp
            btnstyle={buttonCloseStyle}
            title={Msg.CANCEL}
            btnonclick={handleClose} />
        </div>
      </Box>
    </Modal>
  );
}

export default ProductSummary;

const boxStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: "45%",
  height: "90%",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
}

const modalFooterStyle: React.CSSProperties = {
  width: "100%",
  position: "absolute",
  bottom: "0px",
  display: "flex",
  justifyContent: "center",
  borderTop: "1px solid #b6b6b6",
  padding: "10px",
  marginTop: "0.8rem",
  background: "#fff"
}

const buttonCloseStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.dark.black,
  border: "1px solid #808080",
  backgroundColor: Colors.light.white,
  width: "100px"
}