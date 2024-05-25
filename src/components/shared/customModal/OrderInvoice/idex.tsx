import { Box, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { actions } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import ButtonComp from "../../../common/Button/index";
import { Msg } from "../../../../util/massages";
import { Colors } from "../../../../redux/constants/Colors";
import "./style.scss";
import { fetchInvoicePdfUrl, useOrderInvoiceMutation } from "../../../../api/order";
import { toast } from "react-toastify";
import { apiDataInterface, reduxAuth, reduxModal } from "../../../../util/interface";

const OrderInvoice = () => {
  const [orderId, setOrderId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isAccountCreated, setIsAccountCreated] = useState()
  const [OrderInvoice] = useOrderInvoiceMutation()
  const isLoading = useSelector((state: reduxAuth) => state.auth.isLoading);
  const openOrderInvoiceModal = useSelector(
    (state: reduxModal) => state.modal.OrderInvoice
  );

  useEffect(() => {
    if (openOrderInvoiceModal.open) {
      setOrderId(openOrderInvoiceModal?.id?.id);
      setCompanyId(openOrderInvoiceModal?.id?.companyId);
      fetchInvoicePdfUrl(openOrderInvoiceModal?.id?.id, setPdfUrl)
    }
  }, [openOrderInvoiceModal]);

  useEffect(() => {
    setIsAccountCreated(openOrderInvoiceModal?.id?.createdByCompany.isAccountCreated)
  }, [openOrderInvoiceModal])

  const handleDownload = async () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = "Order_Invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSend = async () => {
    const data = {
      orderId: orderId,
      companyId: companyId
    }
    actions.auth.setLoading(true);
    const response: apiDataInterface = await OrderInvoice(data)
    if (response?.data?.statusCode === 200) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.message);
    }
    actions.auth.setLoading(false);
  };

  const handleClose = () => {
    actions.modal.closeOrderInvoice(null);
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
            btnstyle={buttonCompCloseStyle}
            title={Msg.CANCEL}
            btnonclick={handleClose} />
          <ButtonComp
            btnstyle={buttonCompDownloadStyle}
            title={Msg.DOWNLOAD}
            btnonclick={handleDownload} />
          {isAccountCreated && <ButtonComp
            btnstyle={buttonCompSendStyle}
            title={Msg.SEND}
            btnonclick={handleSend} />}
        </div>
      </Box>
    </Modal>
  );
}

export default OrderInvoice;

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
};

const buttonCompCloseStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.dark.black,
  border: "1px solid #808080",
  backgroundColor: Colors.light.white,
  width: "100px"
};

const buttonCompDownloadStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.light.white,
  border: "1px solid",
  backgroundColor: "#fc8019",
  marginLeft: "10px",
  width: "100px"
};

const buttonCompSendStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.dark.orange,
  border: "1px solid #fc8019 ",
  backgroundColor: Colors.light.white,
  marginLeft: "10px",
  width: "100px"
};