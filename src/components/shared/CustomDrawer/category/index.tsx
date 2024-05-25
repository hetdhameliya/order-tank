import React from 'react';
import { Drawer } from "@mui/material";
import InputField from "../../../common/TextField/InputField";
import { Form } from "rsuite";
import ButtonComp from "../../../common/Button";
import "./style.scss";
import { useAddCategoryMutation, useUpdateCategoryMutation, } from "../../../../api/category";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Msg } from "../../../../util/massages";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store/store";
import { useEffect } from "react";
import { apiDataInterface, reduxModal } from '../../../../util/interface';
import * as R from 'rambda';

const CategoryDrawer = () => {
  const DrawerOpen = useSelector((state: reduxModal) => state.modal.categoryDrawer);
  const [categoryAdd] = useAddCategoryMutation();
  const [categoryUpdate] = useUpdateCategoryMutation();

  interface CategoryFormValues {
    categoryName: string;
    categoryCode: string;
  }

  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      categoryName: DrawerOpen?.id?.name || "",
      categoryCode: DrawerOpen?.id?.categoryCode || "",
    },

    validationSchema: Yup.object({
      categoryName: Yup.string().required(Msg.CATEGORY_NAME).trim(),
      categoryCode: Yup.string().required(Msg.CATEGORY_CODE).trim(),
    }),

    onSubmit: async (values: CategoryFormValues) => {
      if (DrawerOpen.id !== null) {
        const dataObj = {
          categoryName: values.categoryName,
          categoryCode: values.categoryCode,
          id: DrawerOpen.id?.id,
        };
        actions.auth.setLoading(true);
        const response: apiDataInterface = await categoryUpdate(dataObj);
        if (response?.data?.statusCode === 200) {
          actions.modal.closeCategoryDrawer(DrawerOpen.id);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      } else {
        actions.auth.setLoading(true);
        const response: apiDataInterface = await categoryAdd({
          categoryName: values.categoryName,
          categoryCode: values.categoryCode,
        });
        if (response?.data?.statusCode === 200) {
          actions.modal.closeCategoryDrawer(null);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      }
    },
  });

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])

  useEffect(() => {
    if (DrawerOpen.open) {
      // TODO: please use rambda pathor method
      formik.resetForm();
      formik.setFieldValue("categoryName", R.pathOr("", ['id', 'categoryName'], DrawerOpen));
      formik.setFieldValue("categoryCode", R.pathOr("", ['id', 'categoryCode'], DrawerOpen));
    }
  }, [DrawerOpen]);

  return (
    <>
      <Drawer
        anchor="right"
        open={DrawerOpen.open}
        transitionDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            width: "500px",
          }
        }}>
        <div className="categoryDrawer_contain">
          <div className="drawer_header_wrapper ">
            <p
              style={drawerHeaderPStyle}>
              {DrawerOpen.id !== null
                ? Msg.UPDATE_CATEGORY_LABEL
                : Msg.ADD_CATEGORY_LABEL}
            </p>
          </div>
          <div
            className="category_form"
            style={categoryFormStyle}>
            <Form
              onSubmit={() => {
                formik.handleSubmit();
              }}
              fluid>
              <div>
                <InputField
                  inputlabel={Msg.CATEGORY_CODE_LABEL}
                  inputname="categoryCode"
                  inputvalue={formik.values.categoryCode}
                  inputonchange={(value: string) => {
                    formik.setFieldValue("categoryCode", value);
                  }}
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.ENTER_CATEGORY_CODE}
                  errmessage={
                    formik.touched.categoryCode &&
                    formik.errors.categoryCode &&
                    formik.errors.categoryCode
                  } />

                <InputField
                  inputlabel={Msg.CATEGORY_NAME_LABEL}
                  inputname="categoryName"
                  inputvalue={formik.values.categoryName}
                  inputonchange={(value: string) => {
                    formik.setFieldValue("categoryName", value);
                  }}
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.CATEGORY}
                  errmessage={
                    formik.touched.categoryName &&
                    formik.errors.categoryName &&
                    formik.errors.categoryName
                  } />
              </div>
            </Form>
          </div>
          <div className="drawer_footer">
            <ButtonComp
              size="large"
              className="Category_Cancel_btn"
              title={Msg.CANCEL}
              btnonclick={() => {
                actions.modal.closeCategoryDrawer(DrawerOpen.id);
              }} />
            <ButtonComp
              size="large"
              className="Category_Add_btn"
              title={
                DrawerOpen.id !== null ? Msg.UPDATE_CATEGORY : Msg.ADD_CATEGORY
              }
              type="submit"
              btnonclick={() => {
                formik.handleSubmit();
              }} />
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default CategoryDrawer;


const drawerHeaderPStyle: React.CSSProperties = {
  marginLeft: "10px",
  color: "#212121",
  fontSize: "25px",
};

const categoryFormStyle: React.CSSProperties = {
  height: "100vh",
  overflow: "auto",
  padding: "90px 40px"
}