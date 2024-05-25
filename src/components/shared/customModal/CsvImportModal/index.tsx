import React from 'react'
import { Box, Modal } from '@mui/material'
import { Colors } from '../../../../redux/constants/Colors'
import { Msg } from '../../../../util/massages'
import ButtonComp from '../../../common/Button'
import "./style.scss"
import CircularProgress from '@mui/material/CircularProgress';
import InputIcon from '@mui/icons-material/Input';
import CloseIcon from '@rsuite/icons/Close';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { objectInterface } from '../../../../util/interface'

const CsvImportModal = (props: objectInterface) => {
  const {
    csvRef,
    open,
    handleCsvChange,
    isImport,
    handleCancelCsv,
    downloadFile,
    title,
    Icon,
    downloadTxt
  } = props;
  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          className="modal-contain"
          sx={{ backgroundColor: Colors.light.white, boxShadow: "24" }}>
          <div className="modal_header">
            <CloseIcon style={{ fontSize: "16px", cursor: "pointer" }} onClick={handleCancelCsv} />
          </div>

          <div className="modal_body">
            <div>
              <div >
                <Icon className="icon" />
              </div>
              <div>
                <h4>{title}</h4>
              </div>
            </div>

            <input
              hidden
              ref={csvRef}
              type="file"
              accept=".csv"
              onChange={handleCsvChange} />

            <ButtonComp
              className="orange_common_btn"
              title={Msg.SELECT_CSV_FILE}
              size="large"
              btnonclick={() => csvRef.current.click()}
              btnIcon={isImport ? <CircularProgress style={{ color: "white", width: "20px", height: "20px" }} /> : <InputIcon style={{ width: "20px" }} />} />
          </div>
          <div className="modal_footer">
            <div className="download" onClick={downloadFile}>
              <DownloadingIcon /> {downloadTxt}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default CsvImportModal
