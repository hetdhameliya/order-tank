export const ProductHeader = [
  { label: "productName", key: "productName" },
  { label: "categoryName", key: "categoryName" },
  { label: "categoryCode", key: "categoryCode" },
  { label: "unit", key: "unit" },
  { label: "minOrderQuantity", key: "minOrderQuantity" },
  { label: "maxOrderQuantity", key: "maxOrderQuantity" },
  { label: "description", key: "description" },
  { label: "price", key: "price" },
  { label: "isPublished", key: "isPublished" },
  { label: "sku", key: "sku" },
  { label: "reason", key: "message" },
];

interface ProductDataItem {
  productName: string;
  categoryName: string;
  categoryCode: string;
  unit: string;
  minOrderQuantity: string;
  maxOrderQuantity: string;
  description: string;
  price: string;
  isPublished: string;
  sku: string;
  message: string;
}

export function ProductCsvData(Data: ProductDataItem[]) {
  const ProductData = [];

  if (Data && Data.length) {
    for (let i = 0; i < Data.length; i++) {
      const data = Data[i];
      const {
        productName,
        categoryName,
        categoryCode,
        unit,
        minOrderQuantity,
        maxOrderQuantity,
        description,
        price,
        isPublished,
        sku,
        message
      } = data || {};

      ProductData[i] = {
        productName: `${productName ? productName : "-"}`,
        categoryName: `${categoryName ? categoryName : "-"}`,
        categoryCode: `${categoryCode ? categoryCode : "-"}`,
        unit: `${unit ? unit : "-"}`,
        minOrderQuantity: `${minOrderQuantity ? minOrderQuantity : "0"}`,
        maxOrderQuantity: `${maxOrderQuantity ? maxOrderQuantity : "0"}`,
        description: `${description ? description : "-"}`,
        price: `${price ? price : "-"}`,
        isPublished: `${isPublished ? isPublished : "-"}`,
        sku: `${sku ? sku : "-"}`,
        message: `${message ? message : "-"}`,
      };
    }
  }
  return ProductData;
}