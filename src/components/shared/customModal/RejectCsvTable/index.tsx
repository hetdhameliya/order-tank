import { Box, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CategoryRejectCsvColumns, ProductRejectColumns } from '../../../../constants/columns'
import { Colors } from '../../../../redux/constants/Colors'
import { actions } from '../../../../redux/store/store'
import { Msg } from '../../../../util/massages'
import ButtonComp from '../../../common/Button'
import TableInfo from '../../../Table'
import "./style.scss"
import { Loader } from 'rsuite'
import { objectInterface, reduxModal } from '../../../../util/interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RejectCsvTable = (props: any) => {
  const rejectTableData = useSelector((state: reduxModal) => state.modal.rejectCsvTable);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const res = rejectTableData?.id?.data?.map((elem: objectInterface) => {
      return {
        ...elem?.body,
        "message": elem?.message
      }
    })
    setData(res)

  }, [rejectTableData?.open])

  const handleClose = () => {
    actions.modal.closeRejectCsvTableModal(null);
  }

  const boxStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: rejectTableData?.id?.type === "product" ? "80vw" : "50vw",
    backgroundColor: Colors.light.white,
    boxShadow: "24",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <>
      <Modal
        open={rejectTableData?.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={boxStyle}>
          <div className='modal_header'>
            {rejectTableData?.id?.type === "product" ? Msg.REJECTED_PRODUCT : Msg.REJECTED_CATEGORY}
          </div>

          <div>
            <TableInfo
              height={50}
              rowHeight={50}
              tableData={data || []}
              column={rejectTableData?.id?.type === "product" ? ProductRejectColumns() : CategoryRejectCsvColumns()}
              page={page}
              setPage={setPage} />
          </div>

          <div className="modal_footer">
            <ButtonComp
              btnstyle={buttonCloseStyle}
              title={Msg.CANCEL}
              btnonclick={handleClose} />
            <ButtonComp
              btnstyle={buttonDownloadStyle}
              isDisabled={loading}
              btnIcon={loading && <Loader size="sm" />}
              title={Msg.DOWNLOAD}
              btnonclick={() => {
                props?.onClick && setLoading(true)
                props?.onClick && props?.onClick(data)
                setLoading(false)
              }} />
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default RejectCsvTable

const buttonCloseStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.dark.black,
  border: "1px solid #808080",
  backgroundColor: Colors.light.white,
  width: "100px"
}

const buttonDownloadStyle: React.CSSProperties = {
  textTransform: "capitalize",
  color: Colors.light.white,
  border: "1px solid",
  backgroundColor: "#fc8019",
  marginLeft: "10px",
  width: "max-content"
}