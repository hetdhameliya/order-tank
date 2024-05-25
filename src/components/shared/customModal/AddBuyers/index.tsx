import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import ButtonComp from "../../../common/Button";
import { Msg } from "../../../../util/massages";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import { Colors } from "../../../../redux/constants/Colors";
import { reduxModal } from "../../../../util/interface";

const AddBuyers = () => {
  const AddBuyersModal = useSelector((state: reduxModal) => state.modal.AddBuyers);
  const handleClose = () => {
    actions.modal.closeAddBuyers(null);
    navigate("/buyers");
  };
  const navigate = useNavigate();
  return (
    <>
      <Modal
        open={AddBuyersModal.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={BoxStyle}>
          <div
            style={divStyle}>
            <IconButton onClick={handleClose}>
              {/* <CloseIcon style={{ fontSize: "1.2rem" }} /> */}
            </IconButton>
          </div>
          <div
            className="modal_header"
            style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircleIcon
              style={checkCircleIconStyle} />
          </div>
          <div
            className="modal_body"
            style={modalBodyStyle}>
            <h3 style={{ textAlign: "center", color: Colors.dark.black }}>
              {Msg.BUYER_ADDED_SUCCESSFULLY}
            </h3>
          </div>
          <div
            className="modal_footer"
            style={modalFooterStyle}>
            <ButtonComp
              btnstyle={ButtonCompStyle}
              title={Msg.BUYER_ADD_MESSAGE}
              btnonclick={handleClose} />
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AddBuyers;

const BoxStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: "500px",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
};

const divStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "right",
  padding: "10px 10px 0px 0px",
};

const checkCircleIconStyle: React.CSSProperties = {
  marginTop: "-20px",
  fontSize: "4.5rem",
  color: "#23CF5F",
};

const modalBodyStyle: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  justifyContent: "center",
};

const modalFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "10px",
};

const ButtonCompStyle: React.CSSProperties = {
  color: Colors.light.white,
  border: "1px solid",
  backgroundColor: Colors.dark.orange,
  marginLeft: "10px",
  padding: "10px 40px",
  borderRadius: "12px",
};