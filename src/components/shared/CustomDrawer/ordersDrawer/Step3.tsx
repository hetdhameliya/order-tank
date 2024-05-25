/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import { Form } from "rsuite";
import InputField from "../../../common/TextField/InputField";
import { Msg } from "../../../../util/massages";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ErrorMessage } from "../../form";
import dayjs from "dayjs";
import Select from "../../../common/Select_Picker";
import ButtonComp from "../../../common/Button";
import { actions } from "../../../../redux/store/store";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useGetAddressQuery } from "../../../../api/company";
import { ReactSelectPicker } from "../../../common/Select_Picker/ReactSelectPicker";
import { useSelector } from "react-redux";
import { objectInterface, reduxAuth } from "../../../../util/interface";

const validationSchema = Yup.object().shape({
  deliveryAddress: Yup.object().nullable().required(Msg.DELIVERY_ADDRESS_REQ),
  status: Yup.mixed().nullable().required(Msg.STATUS_REQ),
  approxDeliveryDate: Yup.mixed()
    .nullable()
    .required(Msg.APPROX_DELIVERY_DATE_REQ),
});

const Step3 = ({ formData, setFormData, nextStep, prevStep, DrawerOpen, status }: any) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);

  const [addressData, setAddressData] = useState([])

  const { data: getAddress } = useGetAddressQuery({ id: currentUser?.company?.id }, {
    refetchOnMountOrArgChange: true,
  })

  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setFormData(values);
      nextStep();
    },
  });

  useEffect(() => {
    if (DrawerOpen !== null && DrawerOpen?.type === Msg.ORDEREDIT) {
      if (
        formik.values.approxDeliveryDate === null &&
        formik.values.notes === "" &&
        formik.values.deliveryAddress === null &&
        formik.values.billingAddress === null
      ) {
        const statusData = status?.find((elem: any) => elem?.value === DrawerOpen?.status)
        formik.setFieldValue("notes", DrawerOpen?.notes);
        formik.setFieldValue("deliveryAddress", DrawerOpen?.deliveryAddress);
        formik.setFieldValue("billingAddress", DrawerOpen?.billingAddress);
        formik.setFieldValue("status", statusData || null);
        formik.setFieldValue(
          "approxDeliveryDate",
          dayjs(DrawerOpen?.approxDeliveryDate)
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!getAddress?.result) return;
    const data = formData?.buyerCompany?.address ? formData?.buyerCompany?.address.concat(getAddress?.result) : getAddress?.result
    setAddressData(data || [])
  }, [getAddress, formData?.buyerCompany])

  return (
    <>
      <Form
        onSubmit={() => {
          formik.handleSubmit();
        }}
        fluid>
        <div className="mt-4">
          <InputField
            inputlabel={Msg.NOTES_LABEL}
            inputname="notes"
            inputvalue={formik.values.notes}
            inputonchange={(value: string) =>
              formik.setFieldValue("notes", value)
            }
            onblur={formik.handleBlur}
            inputplaceholder={Msg.NOTES}
            errmessage={
              formik.touched.notes && formik.errors.notes && formik.errors.notes
            }
            height="55px" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <label>
              <b>{Msg.SCHEDULRD_DATE_DATE}</b>
            </label>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                disablePast
                value={formik.values.approxDeliveryDate}
                onChange={(newValue) => {
                  formik.setFieldValue("approxDeliveryDate", newValue);
                }}
                format="DD-MM-YYYY"
                defaultValue={null}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                  },
                  "& .MuiInputAdornment-root": {
                    paddingRight: ".50rem",
                  },
                }} />
            </DemoContainer>
            {formik.touched.approxDeliveryDate &&
              formik.errors.approxDeliveryDate && (
                <ErrorMessage error={formik.errors.approxDeliveryDate} />
              )}
          </LocalizationProvider>
          <div className="order-address mt-4 mb-4">
            <div style={{ width: "100%" }}>
              <Select
                title={Msg.DELIVERY_ADDRESS}
                options={addressData || []}
                Select_onchange={(e: any, values: any) => {
                  formik.setFieldValue("deliveryAddress", values);
                }}
                selectedValue={formik.values.deliveryAddress || null}
                getOptionLabel={(option: any) => option?.addressName}
                errmessage={
                  formik.touched.deliveryAddress &&
                  formik.errors.deliveryAddress &&
                  formik.errors.deliveryAddress
                }
                placeholder={Msg.DELIVERY_ADDRESS}
                customHeight="55px"
                renderOption={(props: any, option: any) => (
                  <li {...props}>
                    <div className="d-flex flex-column" >
                      <span>{option?.addressName} </span>
                      <span style={{ fontSize: "12px" }}> {option?.addressLine}</span>
                    </div>
                  </li>
                )} />
            </div>
            <ButtonComp
              size="large"
              className="add-category-btn"
              btnIcon={<AddCircleOutlineIcon style={{ fontSize: "26px" }} />}
              btnonclick={() => actions.modal.openAddressDrawer(null)} />
          </div>

          <div className="order-address mt-4 mb-4">
            <div style={{ width: "100%" }}>
              <Select
                title={Msg.BILLING_ADDRESS}
                options={addressData || []}
                Select_onchange={(e: any, values: any) => {
                  formik.setFieldValue("billingAddress", values);
                }}
                selectedValue={formik.values.billingAddress || null}
                getOptionLabel={(option: any) => option?.addressName}
                errmessage={
                  formik.touched.billingAddress &&
                  formik.errors.billingAddress &&
                  formik.errors.billingAddress
                }
                placeholder={Msg.BILLING_ADDRESS}
                customHeight="55px"
                renderOption={(props: any, option: any) => (
                  <li {...props}>
                    <div className="d-flex flex-column" >
                      <span>{option?.addressName} </span>
                      <span style={{ fontSize: "12px" }}> {option?.addressLine}</span>
                    </div>
                  </li>
                )} />
            </div>
            <ButtonComp
              size="large"
              className="add-category-btn"
              btnIcon={<AddCircleOutlineIcon style={{ fontSize: "26px" }} />}
              btnonclick={() => actions.modal.openAddressDrawer(null)} />
          </div>

          <ReactSelectPicker
            title={Msg.ORDER_STATUS}
            options={status}
            value={formik.values.status}
            defaultValue={formik.values.status}
            isClearable={false}
            onchange={(data: objectInterface) => {
              formik.setFieldValue("status", data);
            }}
            placeholder={Msg.ORDER_STATUS}
            err={
              formik.touched.status &&
              formik.errors.status &&
              formik.errors.status
            } />

          <div className="d-flex align-items-center">
            <div style={{ marginLeft: "auto", marginTop: "1.5rem" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => prevStep(formik.values)}>
                {Msg.BACK_BUTTON}
              </Button>
              <Button
                className="ms-2"
                variant="contained"
                color="primary"
                type="submit">
                {Msg.NEXT_BUTTON}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default Step3;
