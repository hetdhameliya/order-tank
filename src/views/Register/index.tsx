import React, { useEffect, useState } from "react";
import "./style.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../api/auth";
import { Form } from "rsuite";
import { Msg } from "../../util/massages";
import Regex from "../../util/regex";
import InputField from "../../components/common/TextField/InputField";
import IconInputField from "../../components/common/TextField/IconInputField";
import { actions } from "../../redux/store/store";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import ButtonComp from "../../components/common/Button";
import { app_logo } from "../../assets/Esvgs";
import AuthOnboardingScreen from "../../components/common/AuthOnboardingScreen";
import EmailVerificationDialog from "../../components/shared/customModal/EmailVerification";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'react-phone-input-2/lib/style.css'
import PhoneInputField from "../../components/common/TextField/PhoneInputField";
import { useAcceptInvitationMutation } from "../../api/companyUser";
import * as CryptoJS from 'crypto-js';
import { FormikActionInterface, apiDataInterface } from "../../util/interface";
interface register {
  email: string,
  password: string,
  name: string,
  phone: string,
}

interface cryptoObjInterface {
  email: string
  hash: string
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [register] = useRegisterMutation();
  const [acceptInvitation] = useAcceptInvitationMutation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cryptoObj, setCryptoObj] = useState<cryptoObjInterface>();

  useEffect(() => {
    if (id) {
      try {
        const decryptedId = CryptoJS.AES.decrypt(decodeURIComponent(String(id)), process.env.REACT_APP_PRIVATE_KEY || "").toString(CryptoJS.enc.Utf8);
        const parsedCryptoObj = JSON.parse(decryptedId);
        setCryptoObj(parsedCryptoObj);
        formik.setFieldValue("email", parsedCryptoObj?.email)
      } catch (error) {
        console.error("Error decrypting id:", error);
      }
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(Msg.EMAIL)
        .matches(Regex.VALID_MAIL, Msg.INVALID_EMAIL).trim(),
      password: Yup.string().trim()
        .required(Msg.PASSWORD)
        .min(6, Msg.PASSWORD_MIN_LENGTH),
      name: Yup.string().required(Msg.NAME).trim(),
      phone: Yup.string()
        .required(Msg.PHONE)
        .test(Msg.INVALID_PHONE, (value) => {
          const last10Digits = value.substr(2);
          if (last10Digits.match(/12345/) || !Regex.mobile_no.test(last10Digits)) return false
          else return true
        })
    }),
    onSubmit: async (values: register, action: FormikActionInterface) => {
      if (cryptoObj?.hash) {
        actions.auth.setLoading(true);
        const bodyData = {
          id: cryptoObj?.hash,
          body: {
            password: values.password,
            name: values.name,
            phone: values.phone.substr(2)
          }
        }
        const data: apiDataInterface = await acceptInvitation(bodyData);
        if (data?.data?.statusCode === 200) {
          action.resetForm();
          toast.success(data?.data?.message);
          navigate("/login")
          formik.setFieldValue("phone", "91")
        } else {
          if (data?.data?.statusCode === 400 || data?.data?.statusCode === 500) {
            toast.error(`${data?.error?.data?.message}`);
          } else {
            toast.error(data?.error?.data?.message || Msg.ERR);
          }
        }
        actions.auth.setLoading(false);
      } else {
        actions.auth.setLoading(true);
        const data: apiDataInterface = await register({
          email: values.email,
          password: values.password,
          name: values.name,
          phone: values.phone.substr(2),
        });
        if (data?.data?.statusCode === 200) {
          action.resetForm();
          actions.modal.openEmailVerification(null);
          formik.setFieldValue("phone", "91")
        } else {
          if (data?.data?.statusCode === 400 || data?.data?.statusCode === 500) {
            toast.error(`${data?.error?.data?.message}`);
          } else {
            toast.error(data?.error?.data?.message || Msg.ERR);
          }
        }
        actions.auth.setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="register-page">
        <div className="register-page-left">
          <div className="register-page-left_header">
            <div className="app_logo">
              <img
                style={{ marginBottom: "1rem" }}
                src={app_logo}
                alt={Msg.NOT_FOUND} />
            </div>
            <h1>{Msg.REGISTER}</h1>
            <p style={{ color: "#170c0080" }}>{Msg.COMPANY_TITLE}</p>
          </div>
          <Form
            onSubmit={() => {
              formik.handleSubmit();
            }}
            fluid >
            <div className="Register_Form">
              <div style={{ marginTop: "1rem" }}>
                <InputField
                  inputlabel={Msg.NAME_lABEL}
                  inputname="name"
                  inputvalue={formik.values.name}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("name", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.USERNAME}
                  errmessage={
                    formik.touched.name &&
                    formik.errors.name &&
                    formik.errors.name
                  }
                  height="55px" />

                <div style={{ marginBottom: "24px" }}>
                  <PhoneInputField
                    label={Msg.PHONE_LABEL}
                    name="phone"
                    value={formik.values.phone}
                    errmessage={
                      formik.touched.phone &&
                      formik.errors.phone &&
                      formik.errors.phone
                    }
                    onblur={formik.handleBlur}
                    onchange={(value: string) =>
                      formik.setFieldValue("phone", value)
                    }
                    height="45px" />
                </div>

                <InputField
                  disabled={cryptoObj?.hash && true}
                  inputlabel={Msg.EMAIL_LABEL}
                  inputname="email"
                  inputvalue={formik.values.email}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("email", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.EMAIL_ADDRESS}
                  errmessage={!cryptoObj?.hash &&
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
              </div>
              <div>
                <ButtonComp
                  className="Register_btn"
                  type="submit"
                  title={Msg.REGISTER} />
              </div>
              <p style={{ textAlign: "center" }}>
                <span className="Create_acc">{Msg.LOGIN_ACCOUNT}</span>
                <Link
                  to="/login"
                  className="create_account-link Create_acc login_link">
                  {Msg.LOGIN_ACCOUNT_LINK}
                </Link>
              </p>
            </div>
          </Form>
        </div>
        <AuthOnboardingScreen />
      </div>
      <EmailVerificationDialog screen="register" />
    </>
  );
}

export default Register;
