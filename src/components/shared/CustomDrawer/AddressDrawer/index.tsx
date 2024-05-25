import { Box, Drawer } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Form } from 'rsuite';
import { actions } from '../../../../redux/store/store';
import { Msg } from '../../../../util/massages';
import ButtonComp from '../../../common/Button';
import InputField from '../../../common/TextField/InputField';
import * as Yup from "yup";
import { allowNumbersOnly } from '../../../../util/helpers';
import Select from '../../../common/Select_Picker';
import { STATE_LIST } from '../../../../redux/constants/state';
import { toast } from 'react-toastify';
import { useAddAddressMutation, useUpdateAddressMutation } from '../../../../api/company';
import { apiDataInterface, reduxAuth, reduxModal } from '../../../../util/interface';
import * as R from 'rambda';

interface AddressDrawerProps {
  refetch?: () => void;
}

interface AddressFormValues {
  addressName: string;
  addressLine: string;
  locality: string;
  pincode: string;
  city: string;
  state: string;
}

const AddressDrawer = ({ refetch }: AddressDrawerProps) => {
  const addressDrawer = useSelector((state: reduxModal) => state.modal.AddressDrawer);
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const data = addressDrawer?.id

  const [addAddress] = useAddAddressMutation()
  const [UpdateAddress] = useUpdateAddressMutation()

  const formik = useFormik({
    initialValues: {
      addressName: "",
      addressLine: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
    },

    validationSchema: Yup.object({
      addressName: Yup.string().required(Msg.COMPANY_ADDRESS_NAME).trim(),
      addressLine: Yup.string().required(Msg.COMPANY_ADDRESS_LINE).trim(),
      locality: Yup.string().required(Msg.LOCALITY_REQ).trim(),
      pincode: Yup.string()
        .required(Msg.PINCODE_REQ)
        .min(6, Msg.INVALID_PINCODE),
      city: Yup.string().required(Msg.CITY_REQ).trim(),
      state: Yup.string().required(Msg.STATE_REQ),
    }),

    onSubmit: async (values: AddressFormValues) => {
      const obj = {
        compId: currentUser?.company?.id,
        id: data?.id,
        ...values
      }
      actions.auth.setLoading(true);
      const response: apiDataInterface = data ? await UpdateAddress(obj) : await addAddress({ id: currentUser?.company?.id, data: values })
      if (response?.data?.statusCode === 200) {
        actions.modal.closeAddressDrawer(addressDrawer?.id);
        refetch && refetch()
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    },
  });

  useEffect(() => {
    if (addressDrawer?.open) {
      // TODO: please use rambda pathor method
      formik.resetForm()
      formik.setFieldValue("addressName", R.pathOr("", ['addressName'], data))
      formik.setFieldValue("addressLine", R.pathOr("", ['addressLine'], data))
      formik.setFieldValue("locality", R.pathOr("", ['locality'], data))
      formik.setFieldValue("pincode", R.pathOr("", ['pincode'], data))
      formik.setFieldValue("city", R.pathOr("", ['city'], data))
      formik.setFieldValue("state", R.pathOr("", ['state'], data))
    }
  }, [addressDrawer])
  return (
    <>
      <Drawer
        anchor="right"
        open={addressDrawer?.open}
        transitionDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            width: "600px",
          },
        }}>
        <Box className="prodtDrawer_contain">
          <div className="drawer_header_wrapper ">
            <p
              style={drawerHeaderPStyle}>
              {addressDrawer.id !== null
                ? Msg.UPDATE_ADDRESS
                : Msg.ADD_ADDRESS}
            </p>
          </div>
          <div
            className="product_form"
            style={productFormStyle}>
            <Form fluid>
              <div>
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

                <Select
                  title={Msg.STATE_LABEL}
                  options={STATE_LIST}
                  Select_onchange={(e: React.ChangeEvent<HTMLSelectElement>, values: string) => {
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
            </Form>
          </div>
          <div className="drawer_footer">
            <ButtonComp
              size="large"
              className="Product_Cancel_btn"
              title={Msg.CANCEL}
              btnonclick={() => {
                actions.modal.closeAddressDrawer(addressDrawer?.id);
              }} />
            <ButtonComp
              size="large"
              className="Product_Add_btn"
              type="submit"
              title={
                addressDrawer.id !== null
                  ? Msg.UPDATE_ADDRESS
                  : Msg.ADD_ADDRESS
              }
              btnonclick={() => {
                formik.handleSubmit();
              }} />
          </div>
        </Box>
      </Drawer>
    </>
  )
}

export default AddressDrawer

const drawerHeaderPStyle: React.CSSProperties = {
  marginLeft: "10px",
  color: "#212121",
  fontSize: "25px",
};

const productFormStyle: React.CSSProperties = {
  height: "100vh",
  overflow: "auto",
  padding: "90px 40px"
}