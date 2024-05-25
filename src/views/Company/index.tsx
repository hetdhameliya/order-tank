/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, RadioGroup } from "rsuite";
import InputField from "../../components/common/TextField/InputField";
import PhoneInputField from "../../components/common/TextField/PhoneInputField"
import ButtonComp from "../../components/common/Button";
import Select from "../../components/common/Select_Picker";
import AuthOnboardingScreen from "../../components/common/AuthOnboardingScreen";
import { Msg } from "../../util/massages";
import { allowNumbersOnly } from "../../util/helpers";
import { STATE_LIST_OPTIONS } from "../../redux/constants/state";
import { app_logo } from "../../assets/Esvgs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../components/common/NewImagePicker";
import { useAddCompanyMutation } from "../../api/company";
import { actions } from "../../redux/store/store";
import { Radio } from 'rsuite';
import Regex from "../../util/regex";
import { useSelector } from "react-redux";
import imageCompression from 'browser-image-compression';
import { apiDataInterface, objectInterface, reduxAuth } from "../../util/interface";

const Company = (props: objectInterface) => {
  const navigate = useNavigate();
  const [AddCompany] = useAddCompanyMutation();
  const fileRef = useRef<any>(null);
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [isImageUpload, setIsImageUpload] = useState(false)

  const formik = useFormik({
    initialValues: {
      logoimg: "",
      logopreview: "",
      companyName: "",
      address: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
      name: "",
      phone: "",
      radio: "GST",
      gstNo: "",
      panNo: ""
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required(Msg.COMPANY_NAME_REQ).trim(),
      address: Yup.string().required(Msg.COMPANY_ADDRESS).trim(),
      locality: Yup.string().required(Msg.LOCALITY_REQ).trim(),
      pincode: Yup.string()
        .required(Msg.PINCODE_REQ)
        .min(6, Msg.INVALID_PINCODE),
      city: Yup.string().required(Msg.CITY_REQ).trim(),
      logopreview: Yup.string(),
      state: Yup.string().required(Msg.STATE_REQ),
      name: Yup.string().required(Msg.NAME).trim(),
      phone: Yup.string()
        .required(Msg.PHONE)
        .test(Msg.INVALID_PHONE, (value) => {
          const last10Digits = value.substr(2);
          if (last10Digits.match(/12345/) || !Regex.mobile_no.test(last10Digits)) return false
          else return true
        }),
      gstNo: Yup.string().when("radio", {
        is: (radio: any) => radio === Msg.GST ? true : false,
        then: (schema) =>
          schema.required(Msg.GST_REQ)
            .matches(Regex.gst, Msg.INVALID_GST),
      }).trim(),
      panNo: Yup.string().when("radio", {
        is: (radio: any) => radio === Msg.PAN ? true : false,
        then: (schema) =>
          schema.required(Msg.PAN_REQ)
            .matches(Regex.pan, Msg.INVALID_PAN),
      }).trim(),
    }),
    onSubmit: async (values: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { radio, ...value } = values
      actions.auth.setLoading(true);
      value.phone = value.phone.substr(2)
      const response: apiDataInterface = await AddCompany(value);
      if (response?.data?.statusCode === 201) {
        navigate("/category");
        props?.setStopUserQuery(false)
        props?.refetch && props?.refetch()
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    },
  });

  const radio = formik.values.radio

  useEffect(() => {
    if (currentUser) {
      formik.setFieldValue("name", currentUser?.name)
      formik.setFieldValue("phone", `91${currentUser?.phone}`)
    }
  }, [currentUser])

  const handleCompressImage = async (files: any) => {
    const compressedFile: any = await imageCompression(files, { maxSizeMB: 1, useWebWorker: true, });
    if (compressedFile?.size < 1 * 1024 * 1024) {
      formik.setFieldValue("logopreview", URL.createObjectURL(compressedFile));
      formik.setFieldValue("logoimg", compressedFile);
      setIsImageUpload(false)
    } else {
      handleCompressImage(compressedFile)
    }
  }

  return (
    <div className="page_wrapper">
      <div className="page_left_side">
        <div className="leftside_header">
          <div className="app_logo">
            <img
              style={{ marginBottom: "1rem" }}
              src={app_logo}
              alt={Msg.NOT_FOUND} />
          </div>
          <h2>{Msg.ADD_COMPANY}</h2>
        </div>
        <Form
          onSubmit={() => {
            formik.handleSubmit()
          }}
          fluid>
          <div className="data_Form">
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <ImagePicker
                  image={formik.values.logopreview}
                  Image_container="logo_container"
                  selectedImg_class="selected_logo"
                  img_notSelected_iconClass="logo_notSelected_img"
                  ImageUploadTitle={Msg.UPLOAD_LOGO}
                  ImageUpdateTitle={Msg.UPDATELOGO}
                  imageInputRef={fileRef}
                  imgonchange={async (e: any) => {
                    const files = e.target.files[0];
                    if (e.target.files.length !== 0) {
                      if (e.target.files[0]?.size < 5 * 1024 * 1024) {
                        setIsImageUpload(true)
                        await handleCompressImage(files)
                      } else {
                        toast.error(Msg.INVALID_IMAGE);
                      }
                    }
                  }}
                  isImageUpload={isImageUpload}
                  imageDeselectClick={() => {
                    formik.setFieldValue("logoimg", "");
                    formik.setFieldValue("logopreview", "");
                    fileRef.current.value = null;
                  }}
                  ImageErr={
                    formik.touched.logopreview &&
                    formik.errors.logopreview &&
                    formik.errors.logopreview
                  }
                  ImgErrClassname="logo_img_err" />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <RadioGroup inline name="radio-name" value={radio} onChange={(val: any) => {
                  formik.setFieldValue("radio", val)
                  formik.setFieldValue("gstNo", "")
                  formik.setFieldValue("panNo", "")
                }}>
                  <Radio value="GST">{Msg.GST}</Radio>
                  <Radio value="PAN">{Msg.PAN}</Radio>
                </RadioGroup>
              </div>

              <div className="data_Form_radio">
                {
                  radio === Msg.GST ?
                    <InputField
                      inputlabel={Msg.GST_NO_LABEL}
                      inputname="gstNo"
                      inputvalue={formik.values.gstNo}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("gstNo", value)
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.GST_NUMBER}
                      errmessage={
                        formik.touched.gstNo &&
                        formik.errors.gstNo &&
                        formik.errors.gstNo
                      }
                      height="45px"
                      inputwidth="50%" /> :
                    <InputField
                      inputlabel={Msg.PAN_NO_LABEL}
                      inputname="panNo"
                      inputvalue={formik.values.panNo}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("panNo", value)
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.PAN_NO}
                      errmessage={
                        formik.touched.panNo &&
                        formik.errors.panNo &&
                        formik.errors.panNo
                      }
                      height="45px"
                      inputwidth="50%" />}

                <InputField
                  inputlabel={Msg.COMPANY_NAME_LABEL}
                  inputname="companyName"
                  inputvalue={formik.values.companyName}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("companyName", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.COMPANY_NAME}
                  errmessage={
                    formik.touched.companyName &&
                    formik.errors.companyName &&
                    formik.errors.companyName
                  }
                  height="45px"
                  inputwidth="50%" />
              </div>

              <div
                className="data_Form_name">
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
                  height="45px"
                  inputwidth="50%" />

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
                  width="50%"
                  height="45px"
                />
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <InputField
                  inputlabel={Msg.ADDRESS_LABEL}
                  inputname="address"
                  inputvalue={formik.values.address}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("address", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.ADDRESS}
                  errmessage={
                    formik.touched.address &&
                    formik.errors.address &&
                    formik.errors.address
                  }
                  height="45px" />
              </div>

              <div
                className="data_Form_locality">
                <InputField
                  inputlabel={Msg.LOCALITY_LABEL}
                  inputname="locality"
                  inputvalue={formik.values.locality}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("locality", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.LOCALITY}
                  errmessage={
                    formik.touched.locality &&
                    formik.errors.locality &&
                    formik.errors.locality
                  }
                  height="45px"
                  inputwidth="50%" />

                <InputField
                  inputlabel={Msg.PINCODE_LABEL}
                  inputname="pincode"
                  inputvalue={formik.values.pincode}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("pincode", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.PINCODE}
                  errmessage={
                    formik.touched.pincode &&
                    formik.errors.pincode &&
                    formik.errors.pincode
                  }
                  inputwidth="50%"
                  height="45px"
                  maxchar={6}
                  onkeypress={(e: React.KeyboardEvent<HTMLInputElement>) => allowNumbersOnly(e)} />
              </div>

              <div className="data_Form_city">
                <InputField
                  inputlabel={Msg.CITY_LABEL}
                  inputname="city"
                  inputvalue={formik.values.city}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("city", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.CITY}
                  errmessage={
                    formik.touched.city &&
                    formik.errors.city &&
                    formik.errors.city
                  }
                  inputwidth="50%"
                  height="45px" />

                <div style={{ width: "50%" }}>
                  <Select
                    title={Msg.STATE_LABEL}
                    options={STATE_LIST_OPTIONS}
                    Select_onchange={(e: any, values: objectInterface) => {
                      formik.setFieldValue(
                        "state",
                        values?.value ? values.value : ""
                      );
                    }}
                    errmessage={
                      formik.touched.state &&
                      formik.errors.state &&
                      formik.errors.state
                    }
                    placeholder={Msg.STATE} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <ButtonComp
                className="Company_Add_btn"
                type="submit"
                title={Msg.ADD_COMPANY} />
            </div>
          </div>
        </Form>
      </div>
      <AuthOnboardingScreen imgheight="100%" />
    </div>
  );
}

export default Company;
