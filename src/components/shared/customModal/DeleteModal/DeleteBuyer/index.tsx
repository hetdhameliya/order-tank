import React from "react";
import { useSelector } from "react-redux";
import { actions } from "../../../../../redux/store/store";
import { Box, Modal } from "@mui/material";
import TrashIcon from "@rsuite/icons/Trash";
import { Msg } from "../../../../../util/massages";
import ButtonComp from "../../../../common/Button";
import { toast } from "react-toastify";
import { Colors } from "../../../../../redux/constants/Colors";
import { useDeleteBuyerMutation } from "../../../../../api/relations";
import { apiDataInterface, reduxModal } from "../../../../../util/interface";

const DeleteBuyer = () => {
  const [deleteBuyerApi] = useDeleteBuyerMutation();
  const DeleteBuyerModal = useSelector((state: reduxModal) => state.modal.deleteBuyer);
  const handleDeleteBuyer = async () => {
    actions.auth.setLoading(true);
    const response: apiDataInterface = await deleteBuyerApi(
      DeleteBuyerModal?.id?.createdByCompany?.id
    );
    if (response?.data?.statusCode === 200) {
      actions.modal.closeDeleteBuyer(null);
    } else {
      toast.error(response?.error?.data?.message);
    }
    actions.auth.setLoading(false);
  };

  const handleClose = () => {
    actions.modal.closeDeleteBuyer(null);
  };
  return (
    <>
      <Modal
        open={DeleteBuyerModal.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >
        <Box
          sx={boxStyle}>
          <div
            className="modal_header"
            style={modalHeaderStyle}>
            <TrashIcon style={{ fontSize: "2.8rem", color: "red" }} />
          </div>
          <div
            className="modal_body"
            style={modalBodyStyle}>
            <h5 style={{ fontSize: "20px", fontWeight: '600px' }}>{Msg.BUYER_DELETE_LABEL}</h5>
          </div>
          <div
            className="modal_footer"
            style={modalFooterStyle}>
            <ButtonComp
              btnstyle={buttonCompCancelStyle}
              title={Msg.CANCEL}
              btnonclick={handleClose} />
            <ButtonComp
              btnstyle={buttonCompDeleteStyle}
              btnonclick={handleDeleteBuyer}
              title={Msg.DELETE}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default DeleteBuyer;

const boxStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
  padding: "1.5rem 2rem"
}

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem"
}

const modalBodyStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  marginTop: "0.8em",
  textTransform: "capitalize",
  fontSize: "20px"
}

const modalFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "15px",
  marginTop: '0.5rem',
};

const buttonCompCancelStyle: React.CSSProperties = {
  color: Colors.dark.black,
  border: "1px solid #808080",
  backgroundColor: Colors.light.white,
  width: "130px",
  textTransform: "capitalize",
};

const buttonCompDeleteStyle: React.CSSProperties = {
  color: Colors.light.white,
  border: "1px solid",
  backgroundColor: "red",
  marginLeft: "10px",
  width: "130px",
  textTransform: "capitalize"
};
