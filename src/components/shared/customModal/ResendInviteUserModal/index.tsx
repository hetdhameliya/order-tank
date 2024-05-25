import React from 'react';
import { Box, Modal } from '@mui/material'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Colors } from '../../../../redux/constants/Colors'
import { actions } from '../../../../redux/store/store'
import { Msg } from '../../../../util/massages'
import ButtonComp from '../../../common/Button'
import { useResendInvitationMutation } from '../../../../api/companyUser'
import { apiDataInterface, objectInterface, reduxModal } from '../../../../util/interface';

const ResendInviteUserModal = () => {
    const ResendInviteUserModal = useSelector((state: reduxModal) => state.modal.ResendInvite);
    const [Resend] = useResendInvitationMutation();
    const handleClose = () => {
        actions.modal.closeResendInviteUserModal(null);
    }

    const handleResend = async () => {
        actions.auth.setLoading(true);

        const body = {
            email: ResendInviteUserModal && ResendInviteUserModal?.id?.email,
            role: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                permissions: ResendInviteUserModal && ResendInviteUserModal?.id?.role?.permissions.map(({ id, ...permission }: objectInterface) => permission)
            }
        }
        const result: apiDataInterface = await Resend(body);
        const error = result?.error?.data?.message
        actions.auth.setLoading(true);
        if (result?.data?.statusCode === 200) {
            handleClose();
            toast.success(result?.data?.message);
        } else {
            toast.error(result?.data?.message || error);
        }
        actions.auth.setLoading(false);
    }

    return (
        <>
            <Modal
                open={ResendInviteUserModal?.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description" >
                <Box
                    sx={boxStyle}>
                    <div
                        className="modal_body"
                        style={modalBodyStyle}>
                        <h5 style={{ fontSize: "20px", fontWeight: '600px' }}>
                            {Msg.RESEND_TITLE}
                        </h5>
                    </div>
                    <div
                        className="modal_footer"
                        style={modalFooterStyle}>
                        <ButtonComp
                            btnstyle={buttonCloseStyle}
                            title={Msg.CANCEL}
                            btnonclick={handleClose} />

                        <ButtonComp
                            btnstyle={buttonResendStyle}
                            btnonclick={handleResend}
                            title={Msg.YES_BUTTON} />
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default ResendInviteUserModal

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

const modalBodyStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "0.8em",
    fontSize: "20px"
}

const modalFooterStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    padding: "15px",
    marginTop: '0.5rem',
}

const buttonCloseStyle: React.CSSProperties = {
    color: Colors.dark.black,
    border: "1px solid #808080",
    backgroundColor: Colors.light.white,
    width: "130px",
    textTransform: "capitalize",
}

const buttonResendStyle: React.CSSProperties = {
    color: Colors.light.white,
    border: "1px solid",
    backgroundColor: "#fc8019",
    marginLeft: "10px",
    width: "130px",
    textTransform: "capitalize"
}