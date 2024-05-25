/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-self-assign */
import { Box, Drawer } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ButtonComp from "../../../common/Button";
import { useGetAllCategoriesQuery } from "../../../../api/category";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Msg } from "../../../../util/massages";
import { toast } from "react-toastify";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../../../api/product";
import { Checkbox, Form, Input } from "rsuite";
import InputField from "../../../common/TextField/InputField";
import Select from "../../../common/Select_Picker";
import { allowNumbersWithOneDots } from "../../../../util/helpers";
import ImagePicker from "../../../common/NewImagePicker";
import { actions } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import "./style.scss";
import { Colors } from "../../../../redux/constants/Colors";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryDrawer from "../category";
import { DefaultProductImg } from "../../../../assets/Esvgs"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import imageCompression from 'browser-image-compression';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { apiDataInterface, reduxModal } from "../../../../util/interface";

const Textarea = React.forwardRef((props: any, ref: any) => (
  <Input {...props} as="textarea" ref={ref} />
));

Textarea.displayName = "Textarea";

const ProductDrawer = () => {
  const fileRef = useRef<any>(null);
  const DrawerOpen = useSelector((state: reduxModal) => state.modal.productDrawer);
  const { data: categories, isFetching: CategotyFetch } =
    useGetAllCategoriesQuery(null);
  const [AddProduct] = useAddProductMutation();
  const [UpdateProduct] = useUpdateProductMutation();
  const [allCategory, setAllCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [isImageUpload, setIsImageUpload] = useState(false)

  const formik = useFormik({
    initialValues: {
      productName: "",
      category: "",
      unit: "",
      minOrderQuantity: 0,
      maxOrderQuantity: 0,
      description: "",
      price: "",
      sku: "",
      productavailable: true,
      productimg: "",
      productpreview: "",
    },

    validationSchema: Yup.object({
      productName: Yup.string().required(Msg.PRODUCT_NAME_REQ).trim(),
      category: Yup.string().required(Msg.CATEGORY_REQ).trim(),
      // price: Yup.string().required(Msg.PRICE_REQ).trim(),
      sku: Yup.string().required(Msg.SKU_REQ).trim(),
    }),

    onSubmit: async (values: any) => {
      if (DrawerOpen.id) {
        const dataObj = {
          id: DrawerOpen.id?.id,
          image: values?.productimg,
          productName: values?.productName,
          categoryId: values?.category,
          unit: values.unit.trim(),
          minOrderQuantity: values.minOrderQuantity,
          maxOrderQuantity: values.maxOrderQuantity,
          description: values.description.trim(),
          ...(values.price !== "" && { price: values.price }),
          isAvailable: values.productavailable,
          sku: values?.sku,
        };
        actions.auth.setLoading(true);
        const response: apiDataInterface = await UpdateProduct(dataObj);
        if (response?.data?.statusCode === 200) {
          actions.modal.closeProductDrawer(DrawerOpen.id);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      } else {

        values.unit = values.unit.trim()
        values.minOrderQuantity = values.minOrderQuantity
        values.maxOrderQuantity = values.maxOrderQuantity
        values.description = values.description.trim()
        values.price === "" && delete values.price;
        actions.auth.setLoading(true);
        const response: apiDataInterface = await AddProduct(values);
        if (response?.data?.statusCode === 200) {
          actions.modal.closeProductDrawer(null);
        } else {
          toast.error(response?.error?.data?.message);
        }
        actions.auth.setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!categories?.result) return;
    const categoryOptions = categories?.result?.map((item: any) => {
      return { label: item?.categoryName, value: item?.categoryName, id: item?.id };
    });
    setAllCategory(categoryOptions);
  }, [categories, CategotyFetch]);

  useEffect(() => {
    if (
      allCategory?.length !== 0 &&
      DrawerOpen.id !== null &&
      DrawerOpen.open
    ) {
      const selected = allCategory.filter((item: any) => {
        return item.id === DrawerOpen.id?.category?.id;
      });
      setSelectedCategory(selected[0]);
    } else if (DrawerOpen.id === null) {
      setSelectedCategory([]);
    }
  }, [DrawerOpen, allCategory]);

  useEffect(() => {
    if (DrawerOpen.open) {
      formik.resetForm();
      formik.setFieldValue("productName", DrawerOpen?.id?.productName || "");
      formik.setFieldValue("category", DrawerOpen?.id?.category?.id || "");
      formik.setFieldValue("unit", DrawerOpen?.id?.unit || "");
      formik.setFieldValue("minOrderQuantity", DrawerOpen?.id?.minOrderQuantity || 0);
      formik.setFieldValue("maxOrderQuantity", DrawerOpen?.id?.maxOrderQuantity || 0);
      formik.setFieldValue("description", DrawerOpen?.id?.description || "");
      formik.setFieldValue("price", DrawerOpen?.id?.price || "");
      formik.setFieldValue("sku", DrawerOpen?.id?.sku || "");
      formik.setFieldValue("productavailable", DrawerOpen?.id ? DrawerOpen?.id?.isPublished : true);
      formik.setFieldValue("productimg", DrawerOpen?.id?.image || "");
      formik.setFieldValue("productpreview", DrawerOpen?.id?.image || (DrawerOpen?.id && DefaultProductImg));
    }
  }, [DrawerOpen]);

  const handleCompressImage = async (files: any) => {
    const compressedFile: any = await imageCompression(files, { maxSizeMB: 1, useWebWorker: true, });
    if (compressedFile?.size < 1 * 1024 * 1024) {
      formik.setFieldValue("productpreview", URL.createObjectURL(compressedFile));
      formik.setFieldValue("productimg", compressedFile);
      setIsImageUpload(false)
    } else {
      handleCompressImage(compressedFile)
    }
  }

  const discriminantMinQuality = () => {
    const currentValue = Number(formik.values.minOrderQuantity);
    if (currentValue >= 1) {
      formik.setFieldValue(
        "minOrderQuantity",
        currentValue - 1
      );
    }
  }

  const incrementMinQuality = () => {
    formik.setFieldValue(
      "minOrderQuantity",
      Number(formik.values.minOrderQuantity) + 1
    );
  }

  const discriminantMaxQuality = () => {
    const currentValue = Number(formik.values.maxOrderQuantity);
    if (currentValue >= 1) {
      formik.setFieldValue(
        "maxOrderQuantity",
        currentValue - 1
      );
    }
  }

  const incrementMaxQuality = () => {
    formik.setFieldValue(
      "maxOrderQuantity",
      Number(formik.values.maxOrderQuantity) + 1
    );
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={DrawerOpen.open}
        transitionDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            width: "600px",
          },
        }}>
        <Box className="prodtDrawer_contain">
          <div className="drawer_header_wrapper ">
            <p style={drawerHeaderPStyle}>
              {DrawerOpen.id !== null
                ? Msg.UPDATE_PRODUCT_LABEL
                : Msg.ADD_PRODUCT_LABEL}
            </p>
          </div>
          <div
            className="product_form"
            style={productFormStyle}>
            <Form fluid>
              <div>
                <ImagePicker
                  image={formik.values.productpreview}
                  Image_container="productImg_container"
                  selectedImg_class="selected_ProductImg"
                  img_notSelected_iconClass="productimg_notSelected_icon"
                  ImageUploadTitle={Msg.UPLOAD_IMAGE}
                  ImageUpdateTitle={Msg.UPDATE_IMAGE}
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
                    formik.setFieldValue("productimg", null);
                    formik.setFieldValue("productpreview", "");
                    fileRef.current.value = null;
                  }}
                  ImgErrClassname="product_img_err" />
                <InputField
                  inputlabel={Msg.SKU_LABEL}
                  inputname="sku"
                  inputvalue={formik.values.sku}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("sku", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.SKU}
                  errmessage={
                    formik.touched.sku && formik.errors.sku && formik.errors.sku
                  }
                  height="55px" />
                <InputField
                  inputlabel={Msg.NAME_lABEL}
                  inputname="productName"
                  inputvalue={formik.values.productName}
                  inputonchange={(value: string) =>
                    formik.setFieldValue("productName", value)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.PRODUCT_NAME}
                  errmessage={
                    formik.touched.productName &&
                    formik.errors.productName &&
                    formik.errors.productName
                  }
                  height="55px" />
                <div className="add-category">
                  <div style={{ width: "100%" }}>
                    <Select
                      options={allCategory}
                      title={Msg.SELECT_CATEGORY_LABEL}
                      Select_onchange={(e: any, values: any) => {
                        formik.setFieldValue(
                          "category",
                          values?.id ? values.id : ""
                        );
                        setSelectedCategory(values);
                      }}
                      selectedValue={selectedCategory}
                      errmessage={
                        formik.touched.category &&
                        formik.errors.category &&
                        formik.errors.category
                      }
                      placeholder={Msg.SELECT_CATEGORY_LABEL}
                      customHeight="50px" />
                  </div>
                  <ButtonComp
                    size="large"
                    className="add-category-btn"
                    btnIcon={<AddCircleOutlineIcon />}
                    btnonclick={() => actions.modal.openCategoryDrawer(null)} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <InputField
                    Input_Form_Group="Unit_input_wrapper"
                    inputlabel={Msg.UNIT_LABEL}
                    inputname="unit"
                    inputvalue={formik.values.unit}
                    inputonchange={(value: string) =>
                      formik.setFieldValue("unit", value)
                    }
                    onblur={formik.handleBlur}
                    inputplaceholder={Msg.UNIT}
                    height="47px" />

                  <InputField
                    Input_Form_Group="Unit_input_wrapper"
                    inputlabel={Msg.MIN_QUT_LABEL}
                    inputname="minOrderQuantity"
                    inputvalue={formik.values.minOrderQuantity}
                    inputonchange={(value: string) =>
                      formik.setFieldValue("minOrderQuantity", value)
                    }
                    onblur={formik.handleBlur}
                    height="47px"
                    type={"number"}
                    onClickStartIcon={discriminantMinQuality}
                    onClickEndIcon={incrementMinQuality}
                    icon={<RemoveIcon />}
                    endIcon={<AddIcon />} />

                  <InputField
                    Input_Form_Group="Unit_input_wrapper"
                    inputlabel={Msg.MAX_QUT_LABEL}
                    inputname="maxOrderQuantity"
                    inputvalue={formik.values.maxOrderQuantity}
                    inputonchange={(value: string) =>
                      formik.setFieldValue("maxOrderQuantity", value)
                    }
                    onblur={formik.handleBlur}
                    onClickStartIcon={discriminantMaxQuality}
                    onClickEndIcon={incrementMaxQuality}
                    height="47px"
                    type={"number"}
                    icon={<RemoveIcon />}
                    endIcon={<AddIcon />} />
                </div>

                <Form.Group controlId="textarea-1">
                  <Form.ControlLabel
                    style={{ color: Colors.dark.black, fontWeight: "bold", userSelect: "none" }}>
                    {Msg.DESCRIPTION_LABEL}
                  </Form.ControlLabel>
                  <Form.Control
                    rows={5}
                    value={formik.values.description}
                    onChange={(value: number) =>
                      formik.setFieldValue("description", value || 0)
                    }
                    name="textarea"
                    accepter={Textarea} />
                </Form.Group>
                <InputField
                  inputlabel={Msg.PRICE_LABEL}
                  inputname="price"
                  inputvalue={formik.values.price}
                  inputonchange={(value: number) =>
                    formik.setFieldValue("price", value || 0)
                  }
                  onblur={formik.handleBlur}
                  inputplaceholder={Msg.PRICE}
                  errmessage={
                    formik.touched.price &&
                    formik.errors.price &&
                    formik.errors.price
                  }
                  onkeypress={(e: React.KeyboardEvent<HTMLInputElement>) => allowNumbersWithOneDots(e)}
                  height="55px"
                  icon={<CurrencyRupeeIcon />} />
                <Form.Group controlId="textarea-1">
                  <Form.ControlLabel>
                    <b style={{ color: "black" }}>{Msg.IS_AVAILABLE_LABEL}</b>
                  </Form.ControlLabel>
                  <Checkbox
                    style={{ marginLeft: "-10px", marginBottom: "-10px" }}
                    checked={formik.values.productavailable}
                    onChange={(value: any, checked: boolean) => {
                      formik.setFieldValue("productavailable", checked);
                    }} />
                </Form.Group>
              </div>
            </Form>
          </div>
          <div className="drawer_footer">
            <ButtonComp
              size="large"
              className="Product_Cancel_btn"
              title={Msg.CANCEL}
              btnonclick={() => {
                actions.modal.closeProductDrawer(DrawerOpen.id);
              }} />
            <ButtonComp
              size="large"
              className="Product_Add_btn"
              type="submit"
              title={
                DrawerOpen.id !== null
                  ? Msg.UPDATE_PRODUCT_LABEL
                  : Msg.ADD_PRODUCT_LABEL
              }
              btnonclick={() => {
                formik.handleSubmit();
              }} />
          </div>
        </Box>
      </Drawer>
      <CategoryDrawer />
    </>
  );
}

export default ProductDrawer;

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