import React from 'react';
import { Box, Modal } from '@mui/material';
import { useSelector } from 'react-redux';
import { Colors } from '../../../../redux/constants/Colors';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { actions } from '../../../../redux/store/store';
import CancelIcon from '@mui/icons-material/Cancel';
import { reduxModal } from '../../../../util/interface';

const ImageShowModal = () => {
  const imageShow = useSelector((state: reduxModal) => state.modal.imageShow);

  const handleClose = () => {
    actions.modal.closeImageShowModal(null);
  }

  return (
    <>
      <Modal
        open={imageShow.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={modalContentStyles}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <CancelIcon style={cancelIconStyles} onClick={handleClose} />
          </div>
          <div className="modal_body d-flex justify-content-center align-items-center">
            <TransformWrapper>
              <TransformComponent>
                <img
                  src={imageShow?.id?.image || imageShow?.id?.defImg}
                  alt="img"
                  style={imgStyles} />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default ImageShowModal

const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: Colors.light.white,
  boxShadow: "24",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  maxWidth: "56.25rem",
  padding: "1rem",
};

const cancelIconStyles: React.CSSProperties = {
  position: "absolute",
  fontSize: "1.8rem",
  cursor: "pointer",
  right: "0px",
};

const imgStyles: React.CSSProperties = {
  objectFit: "contain",
  textAlign: "center",
  width: "100%",
  maxHeight: "600px",
};