import React from 'react';
import { Box, Modal } from '@mui/material'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Colors } from '../../../../redux/constants/Colors'
import { actions } from '../../../../redux/store/store'
import ButtonComp from '../../../common/Button'
import { useLogoutMutation } from '../../../../api/auth'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import { Datakey, Msg } from '../../../../util/massages'
import { apiDataInterface, reduxModal } from '../../../../util/interface';
import Cookies from "js-cookie";

const LogoutModal = () => {
    const LogoutModal = useSelector((state: reduxModal) => state.modal.Logout);
    const navigate = useNavigate();
    const [Logout] = useLogoutMutation();

    const handleClose = () => {
        actions.modal.closeLogoutModal(null);
    }

    const logout = async () => {
        actions.auth.setLoading(true);
        const response: apiDataInterface = await Logout({});
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { message, statusCode } = response?.data
        const error = response?.error?.data?.message;
        if (statusCode === 200) {
            Cookies.remove(Datakey.COOKIE_NAME);
            handleClose()
            navigate("/login");
            actions.auth.setCurrentUser(null);
        } else {
            toast.error(message || error);
        }
        actions.auth.setLoading(false);
    }

    return (
        <>
            <Modal
                open={LogoutModal?.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box sx={boxStyle}>
                    <div style={modalBodyStyle}>
                        <LogoutIcon style={{ fontSize: "3.5rem", color: "red" }} />
                        <h5 style={{ fontSize: "20px", fontWeight: '600px' }}>
                            {Msg.LOGOUT_TITLE}
                        </h5>
                    </div>
                    <div style={modalFooterStyle}>
                        <ButtonComp
                            btnstyle={buttonCompCancelStyle}
                            title={Msg.CANCEL_BUTTON}
                            btnonclick={handleClose} />
                        <ButtonComp
                            btnstyle={buttonCompYesStyle}
                            btnonclick={logout}
                            title={Msg.YES_BUTTON} />
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default LogoutModal

const boxStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: Colors.light.white,
    boxShadow: "24",
    borderRadius: "14px",
    padding: "1rem 2rem"
}

const modalBodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "0.5em",
    textTransform: "capitalize",
    fontSize: "20px"
}

const modalFooterStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
    marginTop: '0.8rem',
};

const buttonCompCancelStyle: React.CSSProperties = {
    color: Colors.dark.black,
    border: "1px solid #808080",
    backgroundColor: Colors.light.white,
    width: "140px",
    textTransform: "capitalize",
};

const buttonCompYesStyle: React.CSSProperties = {
    color: Colors.light.white,
    border: "1px solid",
    backgroundColor: "red",
    marginLeft: "10px",
    width: "140px",
    textTransform: "capitalize"
};