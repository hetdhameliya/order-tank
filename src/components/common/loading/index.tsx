// TODO: please change file extension right now it is javascript
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CircularProgress } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { authReduxModal, loadingReduxModal } from '../../../util/interface'


export const Loader = () => {
  const loading = useSelector((state: loadingReduxModal) => {
    return state?.loadingReducer?.loading
  })

  const isLoading = useSelector((state: authReduxModal) => state.auth.isLoading)

  const clipLoaderDivStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#817e8152',
    top: 0
  };

  if (loading || isLoading) {
    return (
      <div style={clipLoaderDivStyle} >
        {(loading || isLoading) && (
          <div>
            <ClipLoader
              color={'#1a76d2'}
              loading={loading || isLoading} />
          </div>
        )}
      </div>
    )
  } else {
    return null
  }
}

const fallBackStyle = {
  height: '100vh'
}

export const MuiLoader = () => (
  <div
    className="d-flex justify-content-center align-items-center w-100"
    style={fallBackStyle}>
    <CircularProgress />
  </div>
)
