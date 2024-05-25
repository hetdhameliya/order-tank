import React, { useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../api/auth";
import { actions } from "../../redux/store/store";
import { toast } from "react-toastify";
import { Form } from "rsuite";
import { Msg } from "../../util/massages";
import Regex from "../../util/regex";
import IconInputField from "../../components/common/TextField/IconInputField";
import InputField from "../../components/common/TextField/InputField";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import ButtonComp from "../../components/common/Button";
import { app_logo } from "../../assets/Esvgs";
import ResendEmailDialog from "../../components/shared/customModal/ResendEmail";
import AuthOnboardingScreen from "../../components/common/AuthOnboardingScreen";
import AccessDeniedModal from "../../components/shared/customModal/AccessDeniedModal";
import { FormikActionInterface, apiDataInterface, objectInterface } from "../../util/interface";

interface formValue {
  email: string,
  password: string,
}

const Login = (props: objectInterface) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(Msg.EMAIL)
        .matches(Regex.VALID_MAIL, Msg.INVALID_EMAIL).trim(),
      password: Yup.string().required(Msg.PASSWORD).min(6, Msg.PASSWORD_CHAR).trim(),
    }),
    onSubmit: async (values: formValue, action: FormikActionInterface) => {
      actions.auth.setLoading(true);
      props.setStopUserQuery(true)
      const data: apiDataInterface = await login({
        email: values.email,
        password: values.password,
      });
      if (data?.data?.statusCode === 200) {
        actions.auth.setLoading(false)
        actions.auth.setCurrentUser(data?.data?.result);
        actions.auth.setToken(data?.data?.result?.token);
        action.resetForm();
        if (data?.data?.result?.company) {
          props.setStopUserQuery(false)
          navigate("/dashboard");
        } else {
          navigate("/company");
          window.location.reload()
        }
      } else {
        if (data?.error?.data?.statusCode === 400 || data?.error?.data?.statusCode === 500) {
          if (data?.error?.data?.message === Msg.PLEASE_USE_MOBILE_APP) {
            actions.modal.openAccessDenied(Msg.ACCESS_DENIED_MSG);
          } else if (data?.error?.data?.message === Msg.PLEASE_VERIFY) {
            actions.modal.openResendEmail(values.email);
          } else {
            toast.error(`${data?.error?.data?.message}`);
          }
        } else {
          toast.error(data?.error?.data?.message || Msg.ERR);
        }
      }
      actions.auth.setLoading(false);
    },
  });

  return (
    <>
      <div className="page_wrapper">
        <div className="login_left_side">
          <div className="leftside_header">
            <div className="app_logo">
              <img
                style={{ marginBottom: "1rem" }}
                src={app_logo}
                alt={Msg.NOT_FOUND} />
            </div>
            <h1>{Msg.LOGIN}</h1>
            <p style={{ color: "#170c0080" }}>{Msg.COMPANY_TITLE}</p>
          </div>
          <Form
            onSubmit={() => {
              formik.handleSubmit();
            }}
            fluid>
            <div className="data_Form">
              <div style={{ marginTop: "3rem" }}>
                <InputField
                  inputlabel={Msg.EMAIL_LABEL}
                  inputname="email"
                  inputvalue={formik.values.email}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("email", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.EMAIL_ADDRESS}
                  errmessage={
                    formik.touched.email &&
                    formik.errors.email &&
                    formik.errors.email
                  }
                  height="55px" />
                <IconInputField
                  inputlabel={Msg.PASSWORD_LABEL}
                  inputtype={showPassword ? "text" : "password"}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("password", value)
                  }
                  inputplaceholder={Msg._PASSWORD}
                  inputvalue={formik.values.password}
                  onblur={formik.handleBlur}
                  imgonclick={() => setShowPassword(!showPassword)}
                  imgsrc={showPassword ? <VisibleIcon /> : <UnvisibleIcon />}
                  errmessage={
                    formik.touched.password &&
                    formik.errors.password &&
                    formik.errors.password
                  }
                  iconInputField_wrapper="icon_InputField_wrapper"
                  inputField_icon_class="password_field_icon"
                  height="55px" />
                <div className="forgot-password-link">
                  <Link to="/forgetPassword" >
                    {Msg.FORGOT_PASSWORD}
                  </Link>
                </div>
              </div>
              <div>
                <ButtonComp
                  className="Login_btn"
                  type="submit"
                  title={Msg.LOGIN} />
                <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                  <span className="Create_acc">{Msg.ACCOUNT_CREATE}</span>
                  <Link
                    to="/register"
                    className="create_account-link Create_acc" >
                    {Msg.ACCOUNT_CREATE_LINK}
                  </Link>
                </p>
              </div>
            </div>
          </Form>
        </div>
        <AuthOnboardingScreen imgheight="100%" />
      </div>
      <ResendEmailDialog />
      <AccessDeniedModal />
    </>
  );
}

export default Login;
