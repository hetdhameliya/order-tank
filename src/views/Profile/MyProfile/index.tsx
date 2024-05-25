import { Card, CardContent } from "@mui/material";
import React, { useEffect } from "react";
import { Form } from "rsuite";
import InputField from "../../../components/common/TextField/InputField";
import ButtonComp from "../../../components/common/Button";
import { useUpdateProfileMutation } from "../../../api/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Msg } from "../../../util/massages";
import { toast } from "react-toastify";
import "./style.scss";
import moment from "moment";
import { useSelector } from "react-redux";
import { allowNumbersOnly } from "../../../util/helpers";
import Regex from "../../../util/regex";
import { actions } from "../../../redux/store/store";
import { apiDataInterface, reduxAuth, refetchInterface } from "../../../util/interface";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  date: string;
  companyCode: string;
}

const MyProfile = ({ refetch }: refetchInterface) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [updateProfile] = useUpdateProfileMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      companyCode: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(Msg.USERNAME_REQ).trim(),
      phone: Yup.string()
        .required(Msg.PHONE)
        .matches(Regex.VALID_PHONE, Msg.INVALID_PHONE),
    }),
    onSubmit: async (values: FormValues) => {
      const dataObj = {
        name: values?.name,
        phone: values?.phone,
      };
      actions.auth.setLoading(true);
      const response: apiDataInterface = await updateProfile(dataObj);
      if (response?.data?.statusCode === 200) {
        refetch();
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    },
  });
  useEffect(() => {
    if (!currentUser) return;
    const joinedDate = currentUser?.createdAt?.split("T") || "";
    formik.setFieldValue("name", currentUser?.name);
    formik.setFieldValue("email", currentUser?.email);
    formik.setFieldValue("phone", currentUser?.phone);
    formik.setFieldValue("date", moment(joinedDate[0]).format("DD/MM/YYYY"));
    formik.setFieldValue("companyCode", currentUser?.companyCode);
  }, [currentUser]);

  return (
    <>
      <div className="profile_container">
        <Card elevation={5}>
          <CardContent>
            <div className="mt-4">
              <Form
                onSubmit={() => {
                  formik.handleSubmit();
                }}
                fluid
                className="mt-3 _form">
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
                  height="55px"
                  disabled />
                <InputField
                  inputlabel={Msg.PHONE_LABEL}
                  inputname="phone"
                  inputvalue={formik.values.phone}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("phone", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.PHONE_NO}
                  errmessage={
                    formik.touched.phone &&
                    formik.errors.phone &&
                    formik.errors.phone
                  }
                  maxchar={10}
                  onkeypress={(e: React.ChangeEvent<HTMLInputElement>) => allowNumbersOnly(e)}
                  height="55px" />
                <InputField
                  inputlabel={Msg.JOINED_DATE_LABEL}
                  inputname="date"
                  inputvalue={formik.values.date}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("date", value)
                  }
                  onblur={formik.handleBlur}
                  errmessage={
                    formik.touched.date &&
                    formik.errors.date &&
                    formik.errors.date}
                  height="55px"
                  disabled />
              </Form>
            </div>
            <div className="mt-3 d-flex justify-content-center">
              <ButtonComp
                className="orange_common_btn"
                title={Msg.UPDATE_PROFILE}
                size="large"
                btnonclick={() => formik.handleSubmit()} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default MyProfile;
