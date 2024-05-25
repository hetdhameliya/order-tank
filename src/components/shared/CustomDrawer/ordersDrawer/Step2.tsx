/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Grid } from "@mui/material";
import { Form } from "rsuite";
import { Msg } from "../../../../util/massages";
import "./style.scss";
import PlusIcon from "@rsuite/icons/Plus";
import MinusIcon from "@rsuite/icons/Minus";
import ButtonComp from "../../../common/Button";
import TrashIcon from "@rsuite/icons/Trash";
import { ReactSelectPicker } from "../../../common/Select_Picker/ReactSelectPicker";
import { Colors } from "../../../../redux/constants/Colors";
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      product: Yup.mixed().nullable().required(Msg.PRODUCT_REQ),
    })
  ),
});

interface MyFormValues {
  buyerCompany: null;
  products: Array<any>;
  notes: string;
  approxDeliveryDate: null;
  deliveryAddress: string;
  billingAddress: string;
}
const Step2 = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
  AllproductApiData,
  products,
  productsOptions,
  setProductsOptions,
  DrawerOpen,
  setProductsData
}: any) => {
  const [customError, setCustomError] = useState(false);
  const [customError2, setCustomError2] = useState(true);

  let removableOptions: any = [];

  const formik = useFormik<MyFormValues>({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      setFormData(values);
      nextStep();
    },
  });


  const handleAddProduct = async () => {

    const AllProductSelected = formik.values?.products.every((item: any) => {
      return item.product !== null;
    });

    if (AllProductSelected) {
      formik.setFieldValue("products", [
        ...formik.values.products,
        { product: null, quantity: 0, price: 0 },
      ]);
      setCustomError2(true);
      setCustomError(false);
    } else {
      formik.handleSubmit();
      setCustomError2(true);
      setCustomError(true);
    }
  };

  const handleProductChange: any = (values: any, i: any, action: any) => {

    if (values === null) {
      formik.setFieldValue(`products.${i}`, { product: null, quantity: 0, price: 0 });
    }
    formik.setFieldValue(`products.${i}.product`, values);
    formik.setFieldValue(`products.${i}.quantity`, Number(values?.minOrderQuantity) < 1 ? 1 : Number(values?.minOrderQuantity));
    if (values === null) {
      const findIndex = products.findIndex(
        (i: any) => i.id === action?.removedValues[0]?.id
      );
      const getProducts: any = productsOptions;
      const data = products.filter(
        (e: any) => e?.id === action?.removedValues[0]?.id
      );
      getProducts.splice(findIndex, 0, ...data);
    }
    setCustomError2(true);
    setCustomError(false);
  };

  useEffect(() => {
    if (DrawerOpen !== null && DrawerOpen?.type === Msg.ORDEREDIT) {
      const productData = DrawerOpen?.orderDetails?.map((obj1: any) => {
        const product = { label: obj1?.product?.productName, value: obj1?.product?.productName, id: obj1?.product?.id, price: obj1?.product?.price, minOrderQuantity: obj1?.product?.minOrderQuantity, maxOrderQuantity: obj1?.product?.maxOrderQuantity }
        return {
          product: product,
          quantity: obj1?.quantity,
          price: obj1?.price,
        };
      });
      if (formik.values.products[0]?.product === null) {
        formik.setFieldValue("products", productData);
      }
    }
  }, []);

  useEffect(() => {
    setProductsData(formik.values.products)
    formik.values.products?.map((ele) => {
      ele?.product !== null && removableOptions.push(ele?.product);
    });
    const filteredArr1 = products?.filter(
      (obj: any) => !removableOptions?.some((obj2: any) => obj2?.id === obj?.id)
    );
    setProductsOptions(filteredArr1);
  }, [formik.values.products]);
  return (
    <>
      <Form fluid>
        {formik.values?.products.map((item: any, i: any) => {
          return (
            <>
              <div className="d-flex mt-4" key={i}>
                <div style={{ width: "450px" }}>
                  <ReactSelectPicker
                    title={Msg.SELECT_PRODUCT_LABEL}
                    options={productsOptions}
                    value={item?.product}
                    defaultValue={item?.product}
                    isClearable={false}
                    onchange={(data: any, action: any) => {
                      AllproductApiData?.map((item: any) => {
                        if (data !== null && item?.id === data?.id) {
                          formik.setFieldValue(`products.${i}.price`, item.price);
                        }
                      })
                      handleProductChange(data, i, action)
                    }
                    }
                    placeholder={Msg.PRODUCT_PLACEHOLDER}
                    err={
                      (customError || !customError2) &&
                      formik?.touched?.products &&
                      formik?.errors?.products &&
                      formik?.errors?.products[i]
                    }
                    width="450px" />
                </div>

                <div className="counter d-flex align-items-center">
                  <button
                    disabled={Number(item?.product?.minOrderQuantity) >= Number(item?.quantity) || item?.product === null ? true : false}
                    style={{ backgroundColor: Colors.light.white }}
                    onClick={() => {
                      formik.values.products[i]?.quantity !== 1 &&
                        formik.setFieldValue(
                          `products.${i}.quantity`,
                          formik.values.products[i]?.quantity - 1
                        );
                    }}>
                    <MinusIcon
                      style={{ color: Colors.dark.orange, marginTop: "-4px" }} />
                  </button>

                  <input
                    type="text"
                    size={25}
                    value={Number(item?.quantity) <= 0 ? Number(item?.product?.minOrderQuantity) || 0 : item?.quantity}
                    className="count"
                    disabled />

                  <button
                    disabled={(Number(item?.product?.maxOrderQuantity) <= Number(item?.quantity) && Number(item?.product?.maxOrderQuantity) > 0) || item?.product === null || Number(item?.maxOrderQuantity) === 0 ? true : false}
                    style={{ backgroundColor: Colors.light.white }}
                    onClick={() => {
                      formik.setFieldValue(
                        `products.${i}.quantity`,
                        Number(formik.values.products[i]?.quantity <= 0 ? formik.values.products[i]?.product?.maxOrderQuantity || 0 : formik.values.products[i]?.quantity) + 1
                      );
                    }}>
                    <PlusIcon
                      style={{ color: Colors.dark.orange, marginTop: "-4px" }} />
                  </button>

                </div>
                <div style={{ marginLeft: i === 0 ? "10px" : "0px", }}>
                  <button
                    className="Remove_Selected_Product_btn"
                    style={{
                      display: i === 0 ? "none" : "block",
                    }}
                    onClick={() => {
                      const newData = [...formik.values.products];
                      newData.splice(i, 1);
                      formik.setFieldValue("products", newData);
                    }}>
                    <TrashIcon style={{ color: "red", fontSize: "20px" }} />
                  </button>
                </div>
              </div>
              <div className="product_price mt-3" style={{ display: item?.product === null ? "none" : "" }}>
                <Grid container spacing={2}>
                  <Grid item xs={2} sm={2} md={2} lg={2}></Grid>
                  <Grid item xs={3.33} sm={3.33} md={3.33} lg={3.33}>
                    <div className="d-flex align-items-center justify-content-around">
                      <h5>{Msg.PRICE_LABEL} : </h5>
                    </div>
                  </Grid>
                  <Grid item xs={3.33} sm={3.33} md={3.33} lg={3.33}>
                    <h5>{item.price} <CloseIcon style={{ fontSize: "18px" }} /> {Number(item?.quantity <= 0 ? item?.product?.minOrderQuantity || 0 : item?.quantity)} Qty.</h5>
                  </Grid>
                  <Grid item xs={3.33} sm={3.33} md={3.33} lg={3.33}>
                    <div className="d-flex align-items-center justify-content-around">
                      <h5>=</h5>
                      <h5>₹{(item.price * Number(item?.quantity <= 0 ? item?.product?.minOrderQuantity || 0 : item?.quantity))?.toFixed(2)}</h5></div>
                  </Grid>
                </Grid>
              </div >
            </>
          );
        })}
        <div className="mt-3 d-flex align-items-center">
          <div>
            <ButtonComp
              title="Add Product"
              className="orange_common_btn"
              type="submit"
              btnonclick={handleAddProduct} />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                DrawerOpen === null && setFormData(formik.values);
                prevStep(formik.values)
              }}>
              {Msg.BACK_BUTTON}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCustomError2(false);
                formik.handleSubmit();
              }}
              style={{ marginLeft: "10px" }}>
              {Msg.NEXT_BUTTON}
            </Button>
          </div>
        </div>
      </Form >
    </>
  );
}

export default Step2;