import { Card, CardContent } from "@mui/material";
import React, { useState } from "react";
import { Form } from "rsuite";
import ButtonComp from "../../../components/common/Button";
import { Msg } from "../../../util/massages";
import IconInputField from "../../../components/common/TextField/IconInputField";
import { useFormik } from "formik";
import * as Yup from "yup";
import VisibleIcon from "@rsuite/icons/Visible";
import UnvisibleIcon from "@rsuite/icons/Unvisible";
import "./style.scss";
import { useChangePasswordMutation } from "../../../api/auth";
import { toast } from "react-toastify";
import { actions } from "../../../redux/store/store";
import { apiDataInterface } from "../../../util/interface";
interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmnewPassword: string;
}

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmnewPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required(Msg.OLD_PASSWORD_REQ).trim(),
      newPassword: Yup.string()
        .required(Msg.NEW_PASSWORD_REQ)
        .min(6, Msg.PASSWORD_MIN_LENGTH)
        .notOneOf([Yup.ref('oldPassword')], Msg.NEW_PASSWORD_ERR),
      confirmnewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), ""], Msg.CONFIRM_PASSWORD_NOT_MATCH)
        .required(Msg.CONFIRM_PASSWORD_REQ)
    }),
    onSubmit: async (values: FormValues) => {
      const dataObj = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };
      actions.auth.setLoading(true);
      const response: apiDataInterface = await changePassword(dataObj);
      if (response?.data?.statusCode === 200) {
        formik.resetForm();
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    },
  });

  return (
    <>
      <div className="reset_password_container">
        <Card elevation={5}>
          <CardContent>
            <h3>{Msg.CHANGE_PASSWORD}</h3>
            <div className="mt-4">
              <Form
                onSubmit={() => {
                  formik.handleSubmit();
                }}
                fluid
                className="mt-3 _form">
                <IconInputField
                  inputlabel={Msg.OLD_PASSWORD_LABEL}
                  inputtype={showOldPassword ? "text" : "password"}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("oldPassword", value)
                  }
                  inputplaceholder={Msg.OLD_PASSWORD}
                  inputvalue={formik.values.oldPassword}
                  onblur={formik.handleBlur}
                  imgonclick={() => setShowOldPassword(!showOldPassword)}
                  imgsrc={showOldPassword ? <VisibleIcon /> : <UnvisibleIcon />}
                  errmessage={
                    formik.touched.oldPassword &&
                    formik.errors.oldPassword &&
                    formik.errors.oldPassword
                  }
                  iconInputField_wrapper="icon_InputField_wrapper"
                  inputField_icon_class="password_field_icon"
                  height="55px" />
                <IconInputField
                  inputlabel={Msg.NEW_PASSWORD_LABEL}
                  inputtype={showNewPassword ? "text" : "password"}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("newPassword", value)
                  }
                  inputplaceholder={Msg.NEW_PASSWORD}
                  inputvalue={formik.values.newPassword}
                  onblur={formik.handleBlur}
                  imgonclick={() => setShowNewPassword(!showNewPassword)}
                  imgsrc={showNewPassword ? <VisibleIcon /> : <UnvisibleIcon />}
                  errmessage={
                    formik.touched.newPassword &&
                    formik.errors.newPassword &&
                    formik.errors.newPassword
                  }
                  iconInputField_wrapper="icon_InputField_wrapper"
                  inputField_icon_class="password_field_icon"
                  height="55px" />
                <IconInputField
                  inputlabel={Msg.CONFIRM_NEW_PASSWORD_LABEL}
                  inputtype={showConfirmNewPassword ? "text" : "password"}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("confirmnewPassword", value)
                  }
                  inputplaceholder={Msg.CONFIRM_NEW_PASSWORD}
                  inputvalue={formik.values.confirmnewPassword}
                  onblur={formik.handleBlur}
                  imgonclick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  errmessage={
                    formik.touched.confirmnewPassword &&
                    formik.errors.confirmnewPassword &&
                    formik.errors.confirmnewPassword
                  }
                  iconInputField_wrapper="icon_InputField_wrapper"
                  inputField_icon_class="password_field_icon"
                  height="55px" />
              </Form>
            </div>
            <div className="mt-5 d-flex justify-content-center">
              <ButtonComp
                className="orange_common_btn"
                title={Msg.CHANGE_PASSWORD}
                size="large"
                btnonclick={() => formik.handleSubmit()} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ChangePassword;
