/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Colors } from "../redux/constants/Colors";

export const allowNumbersOnly = (e: any) => {
  let code = e.which ? e.which : e.keyCode;
  if (code > 31 && (code < 48 || code > 57)) {
    e.preventDefault();
  }
};

export const allowNumbersWithOneDots = (event: any) => {
  const charCode = event.which || event.keyCode;
  const char = String.fromCharCode(charCode);

  const inputValue = event.target.value;
  const dotCount = inputValue.split('.').length - 1;
  if ((!/[\d.]/.test(char) || (char === '.' && (dotCount > 0 || inputValue === '')))) {
    event.preventDefault();
  }
};

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? Colors.dark.palette_black
      : Colors.light.white,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  borderRadius: "10px",
}));

export const useOutsideAlerter = (ref: any, setShowDateRangePicker: any) => {
  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDateRangePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowDateRangePicker]);
};

export const
  AddCompanyFormData = (body: any) => {
    const formData = new FormData();
    const {
      logoimg,
      companyName,
      address,
      locality,
      pincode,
      city,
      state,
      gstNo,
      panNo,
      name,
      phone,
      addressName
    } = body;
    const addressObj = [
      {
        addressName: addressName || "Company Address",
        addressLine: address,
        locality: locality,
        pincode: pincode,
        city: city,
        state: state,
      },
    ];
    formData.append("companyName", companyName);
    logoimg && formData.append("logo", logoimg || "");
    gstNo && formData.append("gstNo", gstNo);
    panNo && formData.append("panNo", panNo);
    formData.append("name", name || "");
    formData.append("phone", phone);
    addressObj.forEach((value: any) => {
      for (let key in value) {
        formData.append(key, value[key]);
      }
    });

    return formData;
  };
export const UpdateCompanyFormData = (body: any) => {
  const formData = new FormData();
  const { companyimg, companyName, name, phone } = body;

  formData.append("companyName", companyName);
  companyimg && formData.append("logo", companyimg || "");
  formData.append("name", name || "");
  formData.append("phone", phone || "");

  return formData;
};

export const AddProductFormData = (body: any) => {
  const formData = new FormData();
  const {
    productName,
    productimg,
    category,
    unit,
    minOrderQuantity,
    maxOrderQuantity,
    description,
    price,
    productavailable,
    sku,
  } = body;
  formData.append("productName", productName);
  productimg && formData.append("image", productimg || "");
  formData.append("category", category);
  formData.append("unit", unit);
  formData.append("minOrderQuantity", minOrderQuantity);
  formData.append("maxOrderQuantity", maxOrderQuantity);
  formData.append("description", description);
  ((price && price !== "") || (price >= 0)) && formData.append("price", price);
  formData.append("isPublished", productavailable);
  formData.append("sku", sku);

  return formData;
};

export const updateProductFormData = (body: any) => {
  const formData = new FormData();
  const {
    image,
    productName,
    categoryId,
    unit,
    minOrderQuantity,
    maxOrderQuantity,
    description,
    price,
    isAvailable,
    sku,
  } = body;

  formData.append("sku", sku);
  formData.append("productName", productName);
  formData.append("category", categoryId);
  formData.append("unit", unit);
  formData.append("minOrderQuantity", minOrderQuantity);
  formData.append("maxOrderQuantity", maxOrderQuantity);
  formData.append("description", description);
  ((price && price !== "") || (price >= 0)) && formData.append("price", price);
  formData.append("isPublished", isAvailable);
  image && formData.append("image", image || "");

  return formData;
};

export const AddBuyerFormData = (body: any) => {
  const formData = new FormData();
  const {
    logoimg,
    companyname,
    gstNo,
    address,
    locality,
    pincode,
    city,
    state,
    panNo,
    name,
    phone,
    addressLine
  } = body;

  const addressObj = [
    {
      addressName: address,
      addressLine: addressLine,
      locality: locality,
      pincode: pincode,
      city: city,
      state: state,
    },
  ];

  formData.append("companyName", companyname);
  logoimg && formData.append("logo", logoimg || "");
  gstNo && formData.append("gstNo", gstNo);
  panNo && formData.append("panNo", panNo);
  formData.append("name", name || "");
  formData.append("phone", phone);
  addressObj.forEach((value: any) => {
    for (let key in value) {
      formData.append(key, value[key]);
    }
  });

  return formData;
};

export const orderFromData = (body: any) => {

  const formData = new FormData();
  if (Array.isArray(body?.status)) {
    body?.status?.forEach((status: any) => {
      formData?.append('status', status);
    });
  }

  return formData;
}


export const ProductSummaryFromData = (body: any) => {
  const formData = new URLSearchParams();

  if (Array.isArray(body?.status)) {
    body?.status?.forEach((status: any) => {
      formData?.append('status', status);
    });
  }


  console.log(body?.ids, "body?.ids")

  if (Array.isArray(body?.ids)) {
    body?.ids?.map((ids: any , index : number) => {
      formData?.append(`ids[${index}]`, ids);
    });
  }

  return formData;
}

