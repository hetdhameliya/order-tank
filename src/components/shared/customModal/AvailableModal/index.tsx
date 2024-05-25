import React from 'react'
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ButtonComp from '../../../common/Button';
import { Msg } from '../../../../util/massages';
import { Colors } from '../../../../redux/constants/Colors';
import { Box, Modal } from "@mui/material";
import { useSelector } from 'react-redux';
import { actions } from '../../../../redux/store/store';
import { useProductAvailabilityMutation } from '../../../../api/product';
import { toast } from 'react-toastify';
import { apiDataInterface, objectInterface, reduxModal } from '../../../../util/interface';

const AvailableModal = (props: objectInterface) => {
  const { setSelectedProductId } = props;
  const available = useSelector((state: reduxModal) => state.modal.Available);
  const [productAvailability, { isLoading }] = useProductAvailabilityMutation()

  const handleClose = () => {
    actions.modal.closeAvailable(null)
  }

  const handleAvailable = async () => {
    // eslint-disable-next-line no-unsafe-optional-chaining, @typescript-eslint/no-unused-vars
    const { message, ...data } = available?.id
    actions.auth.setLoading(true);
    const response: apiDataInterface = await productAvailability(data);

    if (response?.data?.statusCode === 200) {
      actions.modal.closeAvailable(null);
      setSelectedProductId([]);
    } else {
      toast.error(response?.error?.data.message);
    }
    actions.auth.setLoading(false);
  }
  return (
    <>
      <Modal
        open={available.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={boxStyle}>
          <div
            className="modal_header"
            style={modalHeaderStyle}>
            {available?.id?.message === "Available?" ?
              <EventAvailableIcon style={{ fontSize: "4rem", color: "green" }} />
              : <EventBusyIcon style={{ fontSize: "4rem", color: "red" }} />}
          </div>
          <div
            className="modal_body"
            style={modalBodyStyle}>
            <h5 style={{ fontSize: "20px", fontWeight: '600px' }} >
              {Msg.AVAILABLE_MSG} {available?.id?.message}
            </h5>
          </div>
          <div
            className="modal_footer"
            style={modalFooterStyle}>
            <ButtonComp
              btnstyle={ButtonCompNoStyle}
              title={Msg.NO}
              btnonclick={handleClose} />
            <ButtonComp
              btnstyle={ButtonCompYesStyle}
              title={Msg.YES}
              btnonclick={handleAvailable}
              isDisabled={isLoading} />
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default AvailableModal

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

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem"
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

const ButtonCompNoStyle: React.CSSProperties = {
  color: Colors.dark.black,
  border: "1px solid #808080",
  backgroundColor: Colors.light.white,
  width: "130px",
  textTransform: "capitalize",
};

const ButtonCompYesStyle: React.CSSProperties = {
  color: Colors.light.white,
  border: "1px solid",
  backgroundColor: "red",
  marginLeft: "10px",
  width: "130px",
  textTransform: "capitalize"
};
