import React from "react";
import { useSelector } from "react-redux";
import { Modal } from "rsuite";
import { actions } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { Msg } from "../../../../util/massages";
import ButtonComp from "../../../common/Button";
import { objectInterface, reduxModal } from "../../../../util/interface";

const EmailVerificationDialog = (props: objectInterface) => {
  const navigate = useNavigate();
  const emailVerification = useSelector(
    (state: reduxModal) => state.modal.emailVerification
  );
  const handleClose = () => {
    actions.modal.closeEmailVerification(null);
    navigate("/login");
  };
  return (
    <>
      <Modal
        keyboard={false}
        open={emailVerification.open}>
        <Modal.Body
          style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
          <h5>{props.screen === "register" ? Msg.ACCOUNT_CREATED_MESSAGE : Msg.FORGOT_EMAIL_SENT_MSG}</h5>
          <p style={{ marginTop: "5px" }}>{props.screen === "register" && Msg.ACCOUNT_VERIFY_MESSAGE}</p>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <ButtonComp
            className="orange_common_btn"
            type="submit"
            title={Msg.OK}
            btnstyle={{ width: "20%" }}
            btnonclick={handleClose} />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmailVerificationDialog;
