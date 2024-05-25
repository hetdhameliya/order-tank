import React from "react";
import { useSelector } from "react-redux";
import { Modal } from "rsuite";
import { actions } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import ButtonComp from "../../../common/Button";
import { Msg } from "../../../../util/massages";
import { email_unveified } from "../../../../assets/Esvgs";
import { useResendemailMutation } from "../../../../api/resendemail";
import { toast } from "react-toastify";
import { apiDataInterface, reduxModal } from "../../../../util/interface";

const ResendEmailDialog = () => {
  const navigate = useNavigate();
  const Email_data = useSelector((state: reduxModal) => state.modal.resendEmail);
  const [ResendEmail] =
    useResendemailMutation();
  const handleSendMail = async () => {
    actions.auth.setLoading(true);
    const data: apiDataInterface = await ResendEmail({
      email: Email_data.id,
    });
    if (data?.data?.statusCode === 200) {
      actions.modal.closeResendEmail(null);
      navigate("/login");
    } else {
      toast.error(`${data?.error?.data?.message}`);
    }
    actions.auth.setLoading(false);
  };

  const handleClose = () => {
    actions.modal.closeResendEmail(null);
    navigate("/login");
  };
  return (
    <>
      <Modal
        keyboard={false}
        open={Email_data.open}
        size="xs"
        onClose={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ display: "flex", justifyContent: "center" }}>
            <img style={{ height: "50px", marginLeft: "22px" }} src={email_unveified} alt={Msg.NOT_FOUND} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
          <h4>{Msg.EMAIL_NOT_VARIFIED}</h4>
          <p style={{ marginTop: "5px", textAlign: "center" }}>
            {Msg.RESEND_EMAIL}
          </p>
        </Modal.Body>
        <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
          <ButtonComp
            className="orange_common_btn"
            size="large"
            btnonclick={handleSendMail}
            title={Msg.RESEND} />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResendEmailDialog;
