import React from 'react';
import { Box, Modal } from '@mui/material'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useChangeCompanyRelationsMutation } from '../../../../api/relations'
import { Colors } from '../../../../redux/constants/Colors'
import { actions } from '../../../../redux/store/store'
import { Msg } from '../../../../util/massages'
import ButtonComp from '../../../common/Button'
import { apiDataInterface, reduxModal } from '../../../../util/interface';

const BlockBuyer = () => {
  const BlockBuyerModal = useSelector((state: reduxModal) => state.modal.blockBuyer);
  const [companyRelation] = useChangeCompanyRelationsMutation()

  const handleClose = () => {
    actions.modal.closeBlockBuyer(null);
  }

  const handleBlockBuyer = async () => {
    if (BlockBuyerModal.id.type === Msg.INACTIVE) {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await companyRelation({ id: BlockBuyerModal?.id?.id, params: { isActive: false } })
      if (response?.data?.statusCode === 200) actions.modal.closeBlockBuyer(null);
      else toast.error(response?.error?.data.message);
      actions.auth.setLoading(false);

    } else if (BlockBuyerModal.id.type === Msg.ACTIVE) {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await companyRelation({ id: BlockBuyerModal?.id?.id, params: { isActive: true } })
      if (response?.data?.statusCode === 200) actions.modal.closeBlockBuyer(null);
      else toast.error(response?.error?.data.message);
      actions.auth.setLoading(false);

    } else if (BlockBuyerModal.id.type === Msg.ACCEPT) {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await companyRelation({ id: BlockBuyerModal?.id?.id, params: { isAccepted: true } })
      if (response?.data?.statusCode === 200) actions.modal.closeBlockBuyer(null);
      else toast.error(response?.error?.data.message);
      actions.auth.setLoading(false);

    } else if (BlockBuyerModal.id.type === Msg.REJECT) {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await companyRelation({ id: BlockBuyerModal?.id?.id, params: { isRejected: true } })
      if (response?.data?.statusCode === 200) actions.modal.closeBlockBuyer(null);
      else toast.error(response?.error?.data?.message);
      actions.auth.setLoading(false);
    }
  }
  const ShowMsg = (type: string) => {
    if (type === Msg.INACTIVE) return Msg.INACTIVE_BUYER_MSG
    else if (type === Msg.ACTIVE) return Msg.ACTIVE_BUYER_MSG
    else if (type === Msg.ACCEPT) return Msg.ACCEPET_BUYER_MSG
    else if (type === Msg.REJECT) return Msg.REJECT_BUYER_MSG
  }

  const BtnTitle = (type: string) => {
    if (type === Msg.INACTIVE) return Msg.INACTIVE
    else if (type === Msg.ACTIVE) return Msg.ACTIVE
    else if (type === Msg.ACCEPT) return Msg.ACCEPT
    else if (type === Msg.REJECT) return Msg.REJECT
  }

  const buttonCompBlockStyle: React.CSSProperties = {
    color: Colors.light.white,
    border: "1px solid",
    backgroundColor: BtnTitle(BlockBuyerModal?.id?.type) === "Accept" ? "green" : "red",
    marginLeft: "10px",
    width: "130px",
    textTransform: "capitalize"
  };

  return (
    <>
      <Modal
        open={BlockBuyerModal?.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >
        <Box
          sx={boxStyle}>
          <div
            className="modal_body"
            style={modalBodyStyle}>
            <h5 style={{ fontSize: "20px", fontWeight: '600px' }}>
              {ShowMsg(BlockBuyerModal?.id?.type)}
            </h5>
          </div>
          <div
            className="modal_footer"
            style={modalFooterStyle}>
            <ButtonComp
              btnstyle={buttonCompCancelStyle}
              title={Msg.CANCEL}
              btnonclick={handleClose} />

            <ButtonComp
              btnstyle={buttonCompBlockStyle}
              btnonclick={handleBlockBuyer}
              title={BtnTitle(BlockBuyerModal?.id?.type)} />
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default BlockBuyer

const boxStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
  padding: "1.5rem 2rem"
};

const modalBodyStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  marginTop: "0.8em",
  textTransform: "capitalize",
  fontSize: "20px"
};

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

