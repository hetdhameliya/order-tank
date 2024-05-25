/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Drawer, Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Msg } from "../../../../util/massages";
import ButtonComp from "../../../common/Button";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store/store";
import "./style.scss";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import moment from "moment";
import { useAddOrderMutation, useUpdateOrderMutation } from "../../../../api/order";
import { toast } from "react-toastify";
import { useGetAllProductQuery } from "../../../../api/product";
import { orderStepsArr } from "../../../../constants/arrays";
import { Status } from "../../../../redux/constants/arrays";
import AddressDrawer from "../AddressDrawer";
import { useGetRelationsQuery } from "../../../../api/relations";
import { apiDataInterface, objectInterface, reduxAuth, reduxModal } from "../../../../util/interface";
import * as R from 'rambda';

const OrdersDrawer = ({ setFromDate, setToDate, setSearchValue, setOrderStatus }: objectInterface) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const DrawerOpen = useSelector((state: reduxModal) => state.modal.ordersDrawer);
  const [AddOrder] = useAddOrderMutation();
  const [UpdateOrder] = useUpdateOrderMutation();
  const { data: Allproduct, isFetching: ProductFetch } = useGetAllProductQuery(
    { isAvailable: true },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: AllBuyers } = useGetRelationsQuery({ isAccepted: true, isActive: true, isVerify: false }, {
    refetchOnMountOrArgChange: true,
  })

  const [buyers, setBuyers] = useState<any>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [products, setProducts] = useState<any>([]);
  const [productsOptions, setProductsOptions] = useState<any>([]);
  const [formData, setFormData] = useState<objectInterface>({
    buyerCompany: null,
    products: [{ product: null, quantity: 0, price: 0 }],
    notes: "",
    approxDeliveryDate: null,
    deliveryAddress: null,
    billingAddress: null,
    status: { label: "Pending", value: "pending" },
  });
  const [productsData, setProductsData] = useState<any>([])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (values: objectInterface) => {
    if (DrawerOpen.id === null) {
      // TODO: don't use if else put condition in products
      setFormData({
        buyerCompany: values?.buyerCompany,
        products: activeStep === 1 ? [{ product: null, quantity: 0, price: 0 }] : (activeStep === 2 ? values?.products : []),
        notes: "",
        approxDeliveryDate: null,
        deliveryAddress: null,
        billingAddress: null,
        status: { label: "Pending", value: "pending" },
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormSubmit = async () => {
    if (DrawerOpen?.id !== null && DrawerOpen?.id?.type === Msg.ORDEREDIT) {
      const dataObj = {
        id: DrawerOpen?.id?.id,
        orderDetails: formData?.products.map((item: objectInterface) => {
          return { product: item?.product?.id, quantity: item.quantity };
        }),
        notes: formData.notes,
        approxDeliveryDate: moment(new Date(formData?.approxDeliveryDate)).format().split("T")[0] + "T23:59:59+00:00",
        deliveryAddress: formData?.deliveryAddress?.id,
        billingAddress: formData?.billingAddress?.id,
        company: currentUser?.company?.id,
        createdByCompany: formData?.buyerCompany?.id,
        status: formData?.status?.value,
      };
      actions.auth.setLoading(true);
      const response: apiDataInterface = await UpdateOrder(dataObj);
      if (response?.data?.statusCode === 200) {
        actions.modal.closeOrdersDrawer(DrawerOpen.id);
        setFormData({
          buyerCompany: null,
          products: [{ product: null, quantity: 0 }],
          notes: "",
          approxDeliveryDate: null,
          deliveryAddress: null,
          billingAddress: null,
          status: { label: "Pending", value: "pending" },
        })
        setFromDate && setFromDate("")
        setFromDate && setToDate("")
        setSearchValue && setSearchValue("")
        setOrderStatus && setOrderStatus()
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    } else {
      const dataObj = {
        orderDetails:
          formData?.products &&
          formData?.products.length &&
          formData?.products?.map((item: objectInterface) => {
            return { product: item?.product?.id, quantity: item?.quantity };
          }),
        notes: formData.notes,
        approxDeliveryDate: moment(new Date(formData?.approxDeliveryDate)).format().split("T")[0] + "T23:59:59+00:00",
        deliveryAddress: formData?.deliveryAddress?.id,
        billingAddress: formData?.billingAddress?.id,
        company: currentUser?.company?.id,
        createdByCompany: formData?.buyerCompany?.id,
        status: formData?.status?.value,
      };
      actions.auth.setLoading(true);
      const response: apiDataInterface = await AddOrder(dataObj);
      if (response?.data?.statusCode === 201) {
        actions.modal.closeOrdersDrawer(DrawerOpen.id);
        setFormData({
          buyerCompany: null,
          products: [{ product: null, quantity: 0 }],
          notes: "",
          approxDeliveryDate: null,
          deliveryAddress: null,
          billingAddress: null,
          status: { label: "Pending", value: "pending" },
        })
        setFromDate("")
        setToDate("")
        setSearchValue("")
        setOrderStatus()
      } else {
        toast.error(response?.error?.data?.message);
      }
      actions.auth.setLoading(false);
    }
  };
  useEffect(() => {
    if (!AllBuyers?.result) return;
    const manualBuyer = AllBuyers?.result?.data
    // ?.filter((item: any) => {
    //   return item?.isAccountCreated === false;
    // });
    setBuyers(
      manualBuyer?.map((item: objectInterface) => {
        // TODO: use rambda pathor method
        return {
          label: R.pathOr('', ['createdByCompany', 'companyName'], item),
          value: R.pathOr('', ['createdByCompany', 'companyName'], item),
          address: R.pathOr([], ['createdByCompany', 'addresses'], item),
          id: R.pathOr('', ['createdByCompany', 'id'], item),
        };
      })
    );
  }, [AllBuyers]);
  useEffect(() => {
    if (!Allproduct?.result) return;
    const options = Allproduct?.result?.filter((elem: objectInterface) => elem?.isPublished)?.map((item: objectInterface) => {
      // TODO: same use rambda pathor method
      return {
        label: R.pathOr('', ['productName'], item),
        value: R.pathOr('', ['productName'], item),
        maxOrderQuantity: R.pathOr(0, ['maxOrderQuantity'], item),
        minOrderQuantity: R.pathOr(0, ['minOrderQuantity'], item),
        id: R.pathOr('', ['id'], item),
        price: +R.pathOr(0, ['price'], item)
      };
    });
    setProducts(options || []);
    setProductsOptions(options || []);
  }, [Allproduct, ProductFetch]);
  useEffect(() => {
    setActiveStep(0);
    if (DrawerOpen.id === null && DrawerOpen?.open) {
      setFormData({
        buyerCompany: null,
        products: [{ product: null, quantity: 0, price: 0 }],
        notes: "",
        approxDeliveryDate: null,
        deliveryAddress: null,
        billingAddress: null,
        status: { label: "Pending", value: "pending" },
      });
    }
  }, [DrawerOpen]);

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            nextStep={handleNext}
            buyers={buyers}
            DrawerOpen={DrawerOpen.id} />
        );
      case 1:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            nextStep={handleNext}
            prevStep={handleBack}
            products={products}
            AllproductApiData={Allproduct?.result}
            productsOptions={productsOptions}
            setProductsOptions={setProductsOptions}
            DrawerOpen={DrawerOpen?.id}
            setProductsData={setProductsData} />
        );
      case 2:
        return (
          <Step3
            status={Status}
            formData={formData}
            setFormData={setFormData}
            nextStep={handleNext}
            prevStep={handleBack}
            DrawerOpen={DrawerOpen?.id} />
        );
      case 3:
        return <Step4 formData={formData} productsData={productsData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={DrawerOpen.open}
        transitionDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            width: "700px",
          },
        }} >
        <Box className="ordersDrawer_contain">
          <div className="drawer_header_wrapper ">
            <p
              style={drawerHeaderPStyle}>
              {DrawerOpen.id !== null && DrawerOpen.id?.type === Msg.ORDEREDIT
                ? Msg.UPDATE_ORDER_LABEL
                : Msg.ADD_ORDER_LABEL}
            </p>
          </div>
          <div
            className="product_form"
            style={productFormStyle}>
            <div>
              <Stepper activeStep={activeStep}>
                {orderStepsArr.map((label, i: any) => (
                  <Step key={label}>
                    <StepLabel key={i}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>{renderStepContent(activeStep)}</div>
            </div>
          </div>
          <div className="drawer_footer d-flex align-items-center">
            <div>
              {activeStep === 3 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}>
                  {Msg.BACK_BUTTON}
                </Button>
              )}
              <div style={{ display: activeStep !== 1 ? "none" : "" }}>
                <TotalAmount products={productsData} />
              </div>
            </div>
            <div
              className="d-flex align-items-center" style={{ marginLeft: "auto" }} >
              <div>
                <ButtonComp
                  size="large"
                  className="Order_Cancel_btn"
                  title={Msg.CANCEL}
                  btnonclick={() => {
                    actions.modal.closeOrdersDrawer(DrawerOpen.id);
                    setFormData({
                      buyerCompany: null,
                      products: [{ product: null, quantity: 0 }],
                      notes: "",
                      approxDeliveryDate: null,
                      deliveryAddress: null,
                      billingAddress: null,
                      status: { label: "Pending", value: "pending" },
                    });
                  }}
                />
              </div>
              <div style={{ marginLeft: "10px" }}>
                {activeStep === 3 && (
                  <ButtonComp
                    size="large"
                    className="Order_Add_btn"
                    type="submit"
                    title={
                      DrawerOpen.id !== null &&
                        DrawerOpen.id?.type === Msg.ORDEREDIT
                        ? Msg.UPDATE_ORDER_LABEL
                        : Msg.ADD_ORDER_LABEL
                    }
                    btnonclick={handleFormSubmit} />)}
              </div>
            </div>
          </div>
        </Box>
      </Drawer>
      <AddressDrawer />
    </>
  );
}

export default OrdersDrawer;

export const TotalAmount = ({ products }: any) => {
  const total = products?.reduce((sum: any, i: any) => (
    sum += i.quantity * i.price
  ), 0)
  return (
    <h3>
      {Msg.TOTAL_AMOUNT} :{" "}
      ₹{total ? total?.toFixed(2) : 0.00}
    </h3>)
}
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