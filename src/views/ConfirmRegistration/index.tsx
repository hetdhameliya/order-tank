import React, { useEffect } from 'react'
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import { Colors } from "../../redux/constants/Colors";
import CircularProgress from '@mui/material/CircularProgress';
import "./style.scss"
import { useNavigate, useParams } from 'react-router-dom';
import { web_logo } from "../../assets/Esvgs";
import { useConfirmRegistrationQuery } from '../../api/auth';
import ButtonComp from '../../components/common/Button';
import { Msg } from '../../util/massages';
import { actions } from '../../redux/store/store';
export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isFetching } = useConfirmRegistrationQuery({ token: id });

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])
  const Login = () => {
    navigate("/login");
  }
  return (
    <>
      <div className='border_top'>
        <img className='border_img' src={web_logo}></img>
      </div>

      <div className='main' >
        {!isFetching ? (
          <>
            <CheckOutlineIcon
              color={Colors.dark.orange}
              style={{ fontSize: "5rem" }} />
            <div className='tile' >
              <h3>{data?.message || data?.error?.message}</h3>
            </div>
            <ButtonComp
              className="login_btn"
              type="submit"
              title={Msg.REGISTRATION_CINFIEM_LABEL}
              btnstyle={{ width: "16rem" }}
              btnonclick={Login} />
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    </>
  )
}
