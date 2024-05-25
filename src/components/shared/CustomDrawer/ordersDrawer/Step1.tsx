/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import { Form } from "rsuite";
import Select from "../../../common/Select_Picker";
import { Msg } from "../../../../util/massages";
import { objectInterface } from "../../../../util/interface";

const validationSchema = Yup.object().shape({
  buyerCompany: Yup.mixed().nullable().required(Msg.BUYER_COMPANY_REQ),
});

const Step1 = ({ formData, setFormData, nextStep, buyers, DrawerOpen }: objectInterface) => {

  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setFormData(values);
      nextStep();
    },
  });

  useEffect(() => {
    if (DrawerOpen !== null) {
      // TODO: please remove conditional you getting same value in both cases
      const SelectedBuyerId: number | string =
        DrawerOpen?.type === Msg.ORDEREDIT && DrawerOpen?.createdByCompany?.id
      let selectedBuyer: any = [];
      selectedBuyer =
        buyers.length &&
        buyers.filter((item: any) => {
          return item.id === SelectedBuyerId;
        });
      if (formik.values.buyerCompany === null) {
        formik.setFieldValue("buyerCompany", selectedBuyer[0]);
      }
    }
  }, []);


  return (
    <>
      <div className="mt-3">
        <Form
          onSubmit={() => {
            formik.handleSubmit();
          }}
          fluid>
          <Select
            title={Msg.BUYERS_COMPANY}
            options={buyers}
            Select_onchange={(e: any, values: objectInterface) => {
              formik.setFieldValue("buyerCompany", values);
            }}
            selectedValue={formik.values.buyerCompany}
            errmessage={
              formik.touched.buyerCompany &&
              formik.errors.buyerCompany &&
              formik.errors.buyerCompany
            }
            disabled={DrawerOpen !== null && true}
            placeholder={Msg.BUYERS_COMPANY_PLACEHOLDER} />
          <div className="mt-3 d-flex">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginLeft: "auto" }}>
              {Msg.NEXT_BUTTON}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Step1;
