import React, { useState } from "react";
import ButtonComp from "../../../components/common/Button";
import { Msg } from "../../../util/massages";
import AuthOnboardingScreen from "../../../components/common/AuthOnboardingScreen";
import { app_logo } from "../../../assets/Esvgs";
import { Form } from "rsuite";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IconInputField from "../../../components/common/TextField/IconInputField";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import { useResetPasswordMutation } from "../../../api/auth";
import { Colors } from "../../../redux/constants/Colors";
import { actions } from "../../../redux/store/store";
import { apiDataInterface } from "../../../util/interface";

const ResetPassword = () => {
  const [ResetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { id } = useParams();

  interface formValue {
    password: string,
    confirmpassword: string,
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(Msg.PASSWORD)
        .min(6, Msg.PASSWORD_MIN_LENGTH),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref('password'), ""], Msg.PASSWORD_NOT_MATCH)
        .required(Msg.CONFIRM_PASSWORD_REQ)
    }),
    onSubmit: async (values: formValue) => {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await ResetPassword({
        newPassword: values.password,
        token: id
      });
      if (response?.data?.statusCode === 200) {
        navigate("/login");
        formik.resetForm();
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
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
            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: Colors.dark.black }}>{Msg.RESET_PASSWORD}</h1>
              <p
                className="mt-2"
                style={{ color: "#b5b7b8", fontSize: "16px" }}>
                {Msg.UPDATE_PASSWORD_LABEL}
              </p>
            </div>
          </div>
          <Form
            onSubmit={() => {
              formik.handleSubmit();
            }}
            fluid>
            <div className="Register_Form">
              <div style={{ marginTop: "6rem" }}>
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
                <IconInputField
                  inputlabel={Msg.CONFIRM_PASSWORD}
                  inputtype={showConfirmPassword ? "text" : "password"}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("confirmpassword", value)
                  }
                  inputplaceholder={Msg._CONFIRM_PASSWORD}
                  inputvalue={formik.values.confirmpassword}
                  onblur={formik.handleBlur}
                  imgonclick={() => setShowConfirmPassword(!showConfirmPassword)}
                  imgsrc={showConfirmPassword ? <VisibleIcon /> : <UnvisibleIcon />}
                  errmessage={
                    formik.touched.confirmpassword &&
                    formik.errors.confirmpassword &&
                    formik.errors.confirmpassword
                  }
                  iconInputField_wrapper="icon_InputField_wrapper"
                  inputField_icon_class="password_field_icon"
                  height="55px" />
              </div>
              <div>
                <ButtonComp
                  className="Register_btn"
                  type="submit"
                  title={Msg.UPDATE_PASSWORD} />
              </div>
            </div>
          </Form>
        </div>
        <AuthOnboardingScreen />
      </div>
    </>
  );
}

export default ResetPassword;
