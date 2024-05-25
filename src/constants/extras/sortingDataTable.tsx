import { arrKeySort } from "../../redux/constants/arrays";
import { objectInterface } from "../../util/interface";

interface TableDataItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function sortingDataTable(
  sortColumn: string | undefined,
  sortType: string | undefined,
  tableData: TableDataItem
) {

  if (sortColumn && sortType && tableData) {
    const objtSplit = sortColumn.split(".")

    return tableData.slice().sort((a: objectInterface, b: objectInterface) => {
      if (sortColumn === "orderDate") {
        const dateA = new Date(a.createdAt).toISOString().slice(0, 10);
        const dateB = new Date(b.createdAt).toISOString().slice(0, 10);

        if (dateA < dateB) {
          return sortType === "asc" ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortType === "asc" ? 1 : -1;
        }
        return 0;
      }

      if (objtSplit?.length > 1) {
        if (a[objtSplit[0]][objtSplit[1]] < b[objtSplit[0]][objtSplit[1]]) {
          return sortType === "asc" ? -1 : 1;
        }
        if (a[objtSplit[0]][objtSplit[1]] > b[objtSplit[0]][objtSplit[1]]) {
          return sortType === "asc" ? 1 : -1;
        }
        return 0;
      }
      if (Array.isArray(a[sortColumn])) {
        if (a[sortColumn][0][arrKeySort[0]] < b[sortColumn][0][arrKeySort[0]]) {
          return sortType === "asc" ? -1 : 1;
        }
        if (a[sortColumn][0][arrKeySort[0]] > b[sortColumn][0][arrKeySort[0]]) {
          return sortType === "asc" ? 1 : -1;
        }
        return 0;
      }
      if (a[sortColumn] < b[sortColumn]) {
        return sortType === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortType === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  return tableData;
}
