/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { ArrowBackIcon } from "../../../assets/Esvgs";
import { Msg } from "../../../util/massages";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Radio, RadioGroup } from "rsuite";
import InputField from "../../../components/common/TextField/InputField";
import Select from "../../../components/common/Select_Picker";
import ButtonComp from "../../../components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { allowNumbersOnly } from "../../../util/helpers";
import "./style.scss";
import ImagePicker from "../../../components/common/NewImagePicker";
import { STATE_LIST } from "../../../redux/constants/state";
import { actions } from "../../../redux/store/store";
import AddBuyers from "../../../components/shared/customModal/AddBuyers";
import { Colors } from "../../../redux/constants/Colors";
import PhoneInputField from "../../../components/common/TextField/PhoneInputField";
import Regex from "../../../util/regex";
import { BuyerImg } from "../../../assets/Esvgs"
import { useCreateBuyerMutation, useUpdateBuyerMutation } from "../../../api/relations";
import imageCompression from 'browser-image-compression';
import { apiDataInterface } from "../../../util/interface";

const BuyersAdd = () => {
  const [AddBuyer] = useCreateBuyerMutation();
  const [EditBuyer] = useUpdateBuyerMutation();
  const { state } = useLocation();
  const addressData = state?.createdByCompany?.addresses?.find((elem: any) => elem?.isPriority)
  const [isImageUpload, setIsImageUpload] = useState(false)

  const navigate = useNavigate();
  const fileRef = useRef<any>(null);
  const formik = useFormik({
    initialValues: {
      logoimg: state?.createdByCompany?.logo || "",
      logopreview: state?.createdByCompany ? (state?.createdByCompany?.logo || BuyerImg) : "",
      companyname: state?.createdByCompany?.companyName || "",
      address: addressData?.addressName || "",
      addressLine: addressData?.addressLine || "",
      locality: addressData?.locality || "",
      pincode: addressData?.pincode || "",
      city: addressData?.city || "",
      state: addressData?.state || "",
      name: state?.createdByCompany?.name || "",
      phone: state?.createdByCompany?.phone ? `91${state?.createdByCompany?.phone}` : "",
      radio: state?.createdByCompany?.panNo ? "PAN" : "GST",
      gstNo: state?.createdByCompany?.gstNo || "",
      panNo: state?.createdByCompany?.panNo || ""
    },

    validationSchema: Yup.object({
      companyname: Yup.string().required(Msg.COMPANY_NAME_REQ).trim(),
      address: Yup.string().required(Msg.COMPANY_ADDRESS_NAME).trim(),
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
      values.isGst = radio === Msg.GST
      values.isPan = radio === Msg.PAN

      if (state !== null) {
        const dataObj = {
          ...values,
          phone: values.phone.substr(2),
          id: state?.createdByCompany?.id,
        };
        actions.auth.setLoading(true);
        const response: apiDataInterface = await EditBuyer(dataObj);
        if (response?.data?.statusCode === 200) {
          navigate("/buyers");
          // toast.success(response?.data?.message);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      } else {
        actions.auth.setLoading(true);
        const obj = {
          ...values,
          phone: values.phone.substr(2),
        }
        const response: apiDataInterface = await AddBuyer(obj);
        if (response?.data?.statusCode === 201) {
          actions.modal.openAddBuyers(null);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      }
    },
  });

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

  const radio = formik.values.radio

  return (
    <>
      <div className="Buyer_Crud_Page">
        <div className="Buyer_Crud_Header">
          <h3 style={{ color: Colors.dark.black }}>
            <img
              src={ArrowBackIcon}
              className="img"
              alt={Msg.NOT_FOUND}
              onClick={() => navigate("/buyers")} />
            {state !== null ? Msg.BUYER_EDIT_LABEL : Msg.BUYER_ADD_LABEL}
          </h3>
        </div>
        <div className="Buyer_Crud_form">
          <p style={{ paddingBottom: "1rem", fontSize: "20px", color: Colors.dark.black }}>
            {Msg.BUYER_ADD_HEADER}
          </p>

          <Form
            onSubmit={() => {
              formik.handleSubmit();
            }}
            fluid>
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
                if (e.target.files[0]?.size < 5 * 1024 * 1024) {
                  setIsImageUpload(true)
                  await handleCompressImage(files)
                } else {
                  toast.error(Msg.INVALID_IMAGE);
                }
              }}
              isImageUpload={isImageUpload}
              imageDeselectClick={() => {
                formik.setFieldValue("logoimg", null);
                formik.setFieldValue("logopreview", "");
                fileRef.current.value = null;
              }} />
            {
              !state?.companyId && <div style={{ marginBottom: "10px" }}>
                <RadioGroup inline name="radio-name" value={radio} onChange={(val: any) => {
                  formik.setFieldValue("radio", val)
                  formik.setFieldValue("gstNo", state?.createdByCompany?.gstNo || "")
                  formik.setFieldValue("panNo", state?.createdByCompany?.panNo || "")
                }}>
                  <Radio value="GST">{Msg.GST}</Radio>
                  <Radio value="PAN">{Msg.PAN}</Radio>
                </RadioGroup>
              </div>
            }
            <div className="d-flex" style={{ marginBottom: "1.2rem", marginTop: state?.requestId && "1.2rem" }}>
              <div style={{ width: "50%", marginRight: "33px" }}>
                {
                  radio === "GST" || state?.isGst ?
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
                      disabled={state?.requestId} /> :
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
                      disabled={state?.requestId} />}
              </div>
              <div style={{ width: "50%" }}>
                <InputField
                  inputlabel={Msg.BUYER_ADD_COMPANY_NAME}
                  inputname="companyname"
                  inputvalue={formik.values.companyname}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("companyname", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.COMPANY_NAME}
                  errmessage={
                    formik.touched.companyname &&
                    formik.errors.companyname &&
                    formik.errors.companyname
                  }
                  height="45px" />
              </div>
            </div>

            <div className="d-flex" style={{ marginBottom: "1.2rem" }}>
              <div style={{ width: "50%", marginRight: "33px" }}>
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
              </div>
              <div style={{ width: "50%" }}>
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
            </div>

            <div className="d-flex" style={{ marginBottom: "1.2rem" }}>
              <div style={{ width: "50%", marginRight: "33px" }}>
                <InputField
                  inputlabel={Msg.ADDRESS_NAME_LABEL}
                  inputname="address"
                  inputvalue={formik.values.address}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("address", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.ADDRESS_NAME}
                  errmessage={
                    formik.touched.address &&
                    formik.errors.address &&
                    formik.errors.address
                  }
                  height="45px" />
              </div>
              <div style={{ width: "50%" }}>
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
              </div>
            </div>

            <div className="d-flex" style={{ marginBottom: "1.2rem" }}>
              <div style={{ width: "50%", marginRight: "33px" }}>
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
              </div>
              <div style={{ width: "50%" }}>
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
                  height="45px"
                  maxchar={6}
                  onkeypress={(e: React.KeyboardEvent<HTMLInputElement>) => allowNumbersOnly(e)} />
              </div>
            </div>

            <div className="d-flex" style={{ marginBottom: "1.2rem" }}>
              <div style={{ width: "50%", marginRight: "33px" }}>
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
              </div>
              <div style={{ width: "50%" }}>
                <Select
                  title={Msg.STATE_LABEL}
                  options={STATE_LIST}
                  Select_onchange={(e: any, values: string) => {
                    formik.setFieldValue("state", values);
                  }}
                  selectedValue={formik.values?.state}
                  errmessage={
                    formik.touched.state &&
                    formik.errors.state &&
                    formik.errors.state
                  }
                  placeholder={Msg.STATE} />
              </div>
            </div>
            <div className="Buyer_crud_buttons">
              <ButtonComp
                size="large"
                className="Buyer_Cancel_btn"
                block={true}
                title={Msg.CANCEL}
                btnonclick={() => navigate("/buyers")} />
              <ButtonComp
                size="large"
                className="Buyer_Add_btn"
                btnstyle={{ marginLeft: "16px" }}
                block={true}
                title={
                  state !== null ? Msg.BUYER_EDIT_LABEL : Msg.BUYER_ADD_LABEL
                }
                btnonclick={() => {
                  formik.handleSubmit();
                }} />
            </div>
          </Form>
        </div>
      </div>
      <AddBuyers />
    </>
  );
}

export default BuyersAdd;
