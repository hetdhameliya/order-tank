import React from 'react'
import { Modal } from 'rsuite'
import { Msg } from '../../../../util/massages';
import ButtonComp from '../../../common/Button';
import { useSelector } from 'react-redux';
import { actions } from '../../../../redux/store/store';
import { reduxModal } from '../../../../util/interface';

const AccessDeniedModal = () => {

  const access = useSelector((state: reduxModal) => state.modal.AccessDenied);

  const handleClose = () => {
    actions.modal.closeAccessDenied(null);
  }
  return (
    <>
      <Modal
        keyboard={false}
        open={access.open}
        onClose={handleClose}>
        <Modal.Body style={{ textAlign: "center" }}>
          <h4>{access?.id}</h4>
        </Modal.Body>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "center" }}>
          <ButtonComp
            className="orange_common_btn"
            type="submit"
            title={Msg.OK}
            btnstyle={{ width: "20%" }}
            btnonclick={handleClose} />
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AccessDeniedModal
