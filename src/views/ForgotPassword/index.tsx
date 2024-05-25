import React from "react";
import { Form } from "rsuite";
import { Msg } from "../../util/massages";
import InputField from "../../components/common/TextField/InputField";
import ButtonComp from "../../components/common/Button";
import AuthOnboardingScreen from "../../components/common/AuthOnboardingScreen";
import { app_logo } from "../../assets/Esvgs";
import Regex from "../../util/regex";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useForgotPasswordMutation } from "../../api/auth";
import { toast } from "react-toastify";
import { Colors } from "../../redux/constants/Colors";
import { actions } from "../../redux/store/store";
import EmailVerificationDialog from "../../components/shared/customModal/EmailVerification";
import { apiDataInterface } from "../../util/interface";

interface FormValues {
  email: string;
}

function ForgotPassword() {
  const [ForgotPassword] = useForgotPasswordMutation();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(Msg.EMAIL)
        .matches(Regex.VALID_MAIL, Msg.INVALID_EMAIL).trim(),
    }),
    onSubmit: async (values: FormValues) => {
      actions.auth.setLoading(true);
      const response: apiDataInterface = await ForgotPassword({
        email: values.email,
      });
      if (response?.data?.statusCode === 200) {
        // toast.success(response?.data?.message);
        actions.modal.openEmailVerification(null);
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
              <h1 style={{ color: Colors.dark.black }}>{Msg.FORGOT_PASSWORD}</h1>
              <p
                className="mt-2"
                style={{ color: "#b5b7b8", fontSize: "16px" }}>
                {Msg.FORGOT_PASSWORD_MSG_1}
              </p>
              <p style={{ margin: "0px", color: "#b5b7b8", fontSize: "16px" }}>
                {Msg.FORGOT_PASSWORD_MSG_2}
              </p>
            </div>
          </div>
          <Form
            onSubmit={() => {
              formik.handleSubmit();
            }}
            fluid>
            <div className="Register_Form">
              <div style={{ marginTop: "7rem" }}>
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
              </div>
              <div>
                <ButtonComp
                  className="Register_btn"
                  type="submit"
                  title={Msg.SEND_LINK} />
              </div>
            </div>
          </Form>
        </div>
        <AuthOnboardingScreen />
        <EmailVerificationDialog screen="forgotPassword" />
      </div>
    </>
  );
}

export default ForgotPassword;
