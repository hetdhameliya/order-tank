import React from 'react'
import { Msg } from '../../../util/massages';
import ButtonComp from '../Button'
import CircularProgress from '@mui/material/CircularProgress';
import InputIcon from '@mui/icons-material/Input';
import { objectInterface } from '../../../util/interface';

const CsvImport = (props: objectInterface) => {
  const {
    csvRef,
    handleCsvChange,
    isImport
  } = props;

  const circularProgressStyle: React.CSSProperties = {
    color: "white",
    width: "20px",
    height: "20px"
  };

  const InputIconStyle: React.CSSProperties = {
    width: "20px"
  };

  return (
    <>
      <input
        hidden
        ref={csvRef}
        type="file"
        accept=".csv"
        onChange={handleCsvChange} />
      <ButtonComp
        className="orange_common_btn"
        title={Msg.IMPORT}
        size="large"
        btnonclick={() => csvRef.current.click()}
        btnIcon={isImport ? <CircularProgress style={circularProgressStyle} /> : <InputIcon style={InputIconStyle} />} />
    </>
  )
}

export default CsvImport
