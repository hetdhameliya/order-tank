/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Table } from "rsuite";
import { sortingDataTable } from "../../constants/extras/sortingDataTable";
import "./style.scss"
import { objectInterface } from "../../util/interface";

const { Column, HeaderCell, Cell } = Table;

const TableInfo = (props: objectInterface) => {
  const {
    tableData,
    height,
    column,
    page,
    setPage,
    checkedKeys,
    setCheckedKeys,
    Loader,
    showPagerow,
    notShownPagination,
    shortTypes,
    checkboxPosition
  } = props;
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortType, setSortType] = useState<any>();
  const [limit, setLimit] = useState(10);
  const tableRef = useRef<HTMLDivElement>(null);

  let checked = true;
  let indeterminate = false;

  const handleSortColumn = (sortColumn: any, sortType: any) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = notShownPagination ? tableData :
    (tableData?.length &&
      tableData?.filter((v: any, i: any) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      }));

  if (checkedKeys?.length === data?.length) {
    checked = true;
  } else if (checkedKeys?.length === 0) {
    checked = false;
  } else if (
    checkedKeys?.length > 0 &&
    checkedKeys?.length < tableData?.length
  ) {
    indeterminate = true;
  }
  const handleCheckAll = (value: any, check: any) => {
    if (indeterminate) {
      const keys = tableData?.map((item: any) => item.id);
      setCheckedKeys(keys);
    } else {
      const keys = check ? tableData?.map((item: any) => item.id) : [];
      tableData?.length && setCheckedKeys(keys);
    }
  };
  const handleCheck = (value: any, checked: boolean) => {
    const keys: any = checked
      ? [...checkedKeys, value]
      : checkedKeys?.filter((item: any) => item !== value);
    setCheckedKeys(keys);
  };

  if (!data?.length) {
    checked = false;
  }

  window.addEventListener('error', (e) => {
    console.log('window error')
    console.log(e)
  })

  useEffect(() => {
    // Call the showPagerow function here when needed
    if (typeof showPagerow === 'function') {
      showPagerow(data?.length);
    }
  }, [data, showPagerow]);

  //custome height 
  const [dynamicHeight, setDynamicHeight] = useState<number>();

  const calculateDynamicHeight = () => {
    const windowHeight = window.innerHeight;
    const calculatedHeight = (windowHeight * height) / 100;
    setDynamicHeight(calculatedHeight);
  };

  useEffect(() => {
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [height]);

  useEffect(() => {
    if (shortTypes === "ascCategory") {
      setSortColumn("category")
      setSortType("asc")
    }
  }, [])

  return (
    <>
      <div ref={tableRef}>
        <Table
          shouldUpdateScroll={false}
          height={dynamicHeight}
          onRowClick={(rowData) => {
            console.log(rowData, "rowData");
          }}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          data={sortingDataTable(sortColumn, sortType, data)}
          style={{ borderRadius: "12px" }}
          cellBordered
          bordered={true}
          loading={Loader}
          wordWrap="break-word">
          {column?.map((item: any, index: number) => {
            return (
              !["HIDE"].includes(item?.dataKey) && (
                <Column
                  key={index}
                  flexGrow={item?.flexGrow}
                  sortable={item?.sortable}
                  width={item?.width}>
                  {item.header ? (
                    <HeaderCell
                      style={{ backgroundColor: "#eaeaeb", justifyContent: checkboxPosition ? "unset" : "center" }} align="center">
                      {item?.header(checked, indeterminate, handleCheckAll)}
                    </HeaderCell>
                  ) : (
                    <HeaderCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "black",
                        backgroundColor: "#eaeaeb",
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                      {item.headercell}
                    </HeaderCell>
                  )}
                  {item?.render ? (
                    <Cell
                      dataKey={item.dataKey}
                      verticalAlign="middle"
                      align={item.align}
                      style={{ width: "100%" }}>
                      {(rowData: any) => {
                        return item?.render(rowData, checkedKeys, handleCheck, index);
                      }}
                    </Cell>
                  ) : (
                    <Cell
                      wordWrap
                      dataKey={item.dataKey}
                      verticalAlign="middle" />
                  )}
                </Column>
              )
            );
          })}
        </Table>
      </div>

      {!notShownPagination &&
        <div style={{ padding: 5 }}>
          {data?.length && <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            layout={["-", "limit", "|", "pager", "skip"]}
            total={tableData?.length}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />}
        </div>}
    </>
  );
}

export default TableInfo;
