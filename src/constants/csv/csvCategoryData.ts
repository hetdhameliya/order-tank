export const Categoryheader = [
  { label: "categoryCode", key: "categoryCode" },
  { label: "categoryName", key: "categoryName" },
  { label: "reason", key: "message" },
];
interface CategoryDataItem {
  categoryCode: string;
  categoryName: string;
  message: string;
}

export function CategoryCsvData(Data: CategoryDataItem[]) {
  const CategoryData = [];
  if (Data && Data.length) {
    for (let i = 0; i < Data.length; i++) {
      const data = Data[i];

      const {
        categoryCode,
        categoryName,
        message
      } = data || {};

      CategoryData[i] = {
        categoryCode: `${categoryCode ? categoryCode : "-"}`,
        categoryName: `${categoryName ? categoryName : "-"}`,
        message: `${message ? message : "-"}`,
      };
    }
  }
  return CategoryData;
}