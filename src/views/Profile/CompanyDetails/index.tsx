/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Msg } from "../../../util/massages";
import * as Yup from "yup";
import { Card, CardContent, Grid } from "@mui/material";
import { Form } from "rsuite";
import "./style.scss";
import ImagePicker from "../../../components/common/NewImagePicker";
import InputField from "../../../components/common/TextField/InputField";
import ButtonComp from "../../../components/common/Button";
import { useUpdateCompanyMutation } from "../../../api/company";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { actions } from "../../../redux/store/store";
import { CompanyLogoImg } from "../../../assets/Esvgs"
import Regex from "../../../util/regex";
import PhoneInputField from "../../../components/common/TextField/PhoneInputField";
import Select from "../../../components/common/Select_Picker";
import { STATE_LIST_OPTIONS } from "../../../redux/constants/state";
import { allowNumbersOnly } from "../../../util/helpers";
import ImageShowModal from "../../../components/shared/customModal/ImageShow";
import imageCompression from 'browser-image-compression';
import { apiDataInterface, reduxAuth } from "../../../util/interface";
interface MyFormValues {
  companypreview: string;
  companyimg: any;
  companyName: string;
  companyCode: string;
  addressName: string;
  addressLine: string;
  locality: any;
  pincode: any;
  city: any;
  state: any;
  name: string;
  phone: any;
}

const CompanyDetails = ({ refetch }: any) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const fileRef = useRef<any>(null);
  const [UpdateCompany] = useUpdateCompanyMutation();
  const [isImageUpload, setIsImageUpload] = useState(false)
  const addressArr = currentUser?.company?.addresses?.find((item: any) => item?.isPriority)

  const formik = useFormik<MyFormValues>({
    initialValues: {
      companypreview: "",
      companyimg: "",
      companyName: "",
      companyCode: "",
      addressName: "",
      addressLine: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
      name: "",
      phone: ""
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required(Msg.COMPANY_NAME_REQ),
      addressName: Yup.string().required(Msg.COMPANY_ADDRESS_NAME).trim(),
      addressLine: Yup.string().required(Msg.COMPANY_ADDRESS_LINE).trim(),
      locality: Yup.string().required(Msg.LOCALITY_REQ).trim(),
      pincode: Yup.string()
        .required(Msg.PINCODE_REQ)
        .min(6, Msg.INVALID_PINCODE),
      city: Yup.string().required(Msg.CITY_REQ).trim(),
      state: Yup.string().required(Msg.STATE_REQ),
      name: Yup.string().required(Msg.NAME).trim(),
      phone: Yup.string()
        .required(Msg.PHONE)
        .test(Msg.INVALID_PHONE, (value) => {
          const last10Digits = value.substr(2);
          if (last10Digits.match(/12345/) || !Regex.mobile_no.test(last10Digits)) return false
          else return true
        }),
    }),
    onSubmit: async (values: any) => {
      const { companyName, companyimg, name, phone, addressLine, ...value } = values
      const dataObj = {
        companyName: companyName,
        logoimg: companyimg,
        name: name,
        phone: phone.substr(2),
        id: currentUser?.company?.id,
        address: addressLine,
        ...value
      };
      actions.auth.setLoading(true);
      const response: apiDataInterface = await UpdateCompany(dataObj);
      if (response?.data?.statusCode === 200) {
        refetch();
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue("companyName", currentUser?.company?.companyName || "");
    formik.setFieldValue("companyCode", currentUser?.company?.companyCode || "");
    formik.setFieldValue("companyimg", currentUser?.company?.logo || "");
    formik.setFieldValue("name", currentUser?.company?.name || "");
    formik.setFieldValue("phone", `91${currentUser?.company?.phone}` || "");
    formik.setFieldValue("companypreview", currentUser?.company?.logo || CompanyLogoImg);
    formik.setFieldValue("addressName", addressArr?.addressName || "");
    formik.setFieldValue("addressLine", addressArr?.addressLine || "");
    formik.setFieldValue("locality", addressArr?.locality || "");
    formik.setFieldValue("pincode", addressArr?.pincode || "");
    formik.setFieldValue("city", addressArr?.city || "");
    formik.setFieldValue("state", addressArr?.state || "");

  }, [currentUser, addressArr]);

  const handleCompressImage = async (files: any) => {
    const compressedFile: any = await imageCompression(files, { maxSizeMB: 1, useWebWorker: true, });
    if (compressedFile?.size < 1 * 1024 * 1024) {
      formik.setFieldValue("companypreview", URL.createObjectURL(compressedFile));
      formik.setFieldValue("companyimg", compressedFile);
      setIsImageUpload(false)
    } else {
      handleCompressImage(compressedFile)
    }
  }

  return (
    <>
      <div className="CompanyInfo_container">
        <Card elevation={5}>
          <CardContent>
            <div className="mt-4" style={{ height: "600px", overflowY: "auto" }}>
              <Form
                fluid
                className="mt-3 _form">
                <div className="mb-4">
                  <ImagePicker
                    image={formik.values.companypreview}
                    Image_container="companyImg"
                    selectedImg_class="selected_companyImg"
                    img_notSelected_iconClass="companyImg_notSelected_icon"
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
                    onImageClick={() => actions.modal.openImageShowModal({ image: formik.values.companypreview, defImg: CompanyLogoImg })}
                    imageDeselectClick={() => {
                      formik.setFieldValue("companyimg", "");
                      formik.setFieldValue("companypreview", "");
                      fileRef.current.value = null;
                    }}
                    ImgErrClassname="company_img_err" />
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    {
                      currentUser?.company?.gstNo ?
                        <InputField
                          inputlabel={Msg.GST_NO_LABEL}
                          inputname="gstNo"
                          inputvalue={currentUser?.company?.gstNo}
                          inputplaceholder={Msg.GST_NUMBER}
                          height="45px"
                          disabled={true} /> :
                        <InputField
                          inputlabel={Msg.PAN_NO_LABEL}
                          inputname="panNo"
                          inputvalue={currentUser?.company?.panNo}
                          inputplaceholder={Msg.PAN_NO}
                          height="45px"
                          disabled={true} />
                    }
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputField
                      inputlabel={Msg.COMPANY_CODE_LABEL}
                      inputname="companyCode"
                      inputvalue={formik.values.companyCode}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("companyCode", value)
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.COMPANY_CODE_LABEL}
                      errmessage={
                        formik.touched.companyCode &&
                        formik.errors.companyCode &&
                        formik.errors.companyCode
                      }
                      height="45px"
                      disabled />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputField
                      inputlabel={Msg.COMPANY_NAME_LABEL}
                      inputname="companyName"
                      inputvalue={formik.values.companyName}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("companyName", value.trimStart())
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.COMPANY_NAME}
                      errmessage={
                        formik.touched.companyName &&
                        formik.errors.companyName &&
                        formik.errors.companyName
                      }
                      height="45px" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
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
                      height="45px" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputField
                      inputlabel={Msg.ADDRESS_NAME_LABEL}
                      inputname="addressName"
                      inputvalue={formik.values.addressName}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("addressName", value)
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.ADDRESS_NAME}
                      errmessage={
                        formik.touched.addressName &&
                        formik.errors.addressName &&
                        formik.errors.addressName
                      }
                      height="45px" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
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
                  </Grid>
                  <Grid item lg={12}>
                    <InputField
                      inputlabel={Msg.ADDRESS_LINE_LABEL}
                      inputname="addressLine"
                      inputvalue={formik.values.addressLine}
                      inputonchange={(value: string) =>
                        formik.setFieldValue("addressLine", value)
                      }
                      onblur={formik.handleBlur}
                      inputplaceholder={Msg.ADDRESS_LINE}
                      errmessage={
                        formik.touched.addressLine &&
                        formik.errors.addressLine &&
                        formik.errors.addressLine
                      }
                      height="45px" />
                  </Grid>
                  <Grid item lg={6}>
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
                      height="45px" />
                  </Grid>
                  <Grid item lg={6}>
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
                      onkeypress={(e: any) => allowNumbersOnly(e)}
                      height="45px" />
                  </Grid>
                  <Grid item lg={6}>
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
                      height="45px" />
                  </Grid>
                  <Grid item lg={6}>
                    <Select
                      title={Msg.STATE_LABEL}
                      options={STATE_LIST_OPTIONS}
                      Select_onchange={(e: any, values: any) => {
                        formik.setFieldValue(
                          "state",
                          values?.value ? values.value : ""
                        );
                      }}
                      selectedValue={formik.values.state}
                      errmessage={
                        formik.touched.state &&
                        formik.errors.state &&
                        formik.errors.state
                      }
                      placeholder={Msg.STATE} />
                  </Grid>
                </Grid>
              </Form>
            </div>
            {Number(currentUser?.company?.createdBy?.id) === currentUser?.id && <div
              className="profile_com_btn_div">
              <ButtonComp
                className="orange_common_btn"
                title="Update Company Info"
                size="large"
                btnonclick={() => {
                  formik.handleSubmit();
                }} />
            </div>}
          </CardContent>
        </Card>
      </div>
      <ImageShowModal />
    </>
  );
}

export default CompanyDetails;
