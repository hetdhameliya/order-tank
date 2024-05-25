/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import HeaderTextLayout from "../../components/shared/HeaderTextLayout";
import SearchIcon from "@rsuite/icons/Search";
import "./style.scss";
import IconInputField from "../../components/common/TextField/IconInputField";
import { Form } from "rsuite";
import ButtonComp from "../../components/common/Button";
import CategoryDrawer from "../../components/shared/CustomDrawer/category";
import { useCreateCategoryByCsvMutation, useGetAllCategoriesQuery } from "../../api/category";
import TableInfo from "../../components/Table";
import CloseIcon from "@rsuite/icons/Close";
import { actions } from "../../redux/store/store";
import { CategoryColumns } from "../../constants/columns";
import { Datakey, Msg } from "../../util/massages";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import InputIcon from '@mui/icons-material/Input';
import CsvImportModal from "../../components/shared/customModal/CsvImportModal";
import { categoryCsv } from "../../assets/Esvgs";
import CategoryIcon from '@mui/icons-material/Category';
import DeleteCategoryDialog from "../../components/shared/customModal/DeleteModal/DeleteCategoty";
import RejectCsvTable from "../../components/shared/customModal/RejectCsvTable";
import { CSVLink } from "react-csv";
import useWindowDimensions from '../../components/common/WindowDimensions';
import { CategoryCsvData, Categoryheader } from "../../constants/csv/csvCategoryData";
import { categoryTableHeight } from "../../constants/extras/calculatTableHeight";
import { useSelector } from "react-redux";
import { apiDataInterface, permissionsInterface, reduxAuth } from "../../util/interface";
import * as R from 'rambda';

const Category = () => {

  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [categoryPermission, setCategoryPermission] = useState<permissionsInterface>();
  const csvRef = useRef<any>(null)
  const csvInstance = useRef<any>(null);
  const [filteredCategory, setFilteredCategory] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  const [page, setPage] = useState<number>(1);
  const [isImport, setIsImport] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvData, setCsvData] = useState<any>("");
  const { width } = useWindowDimensions();
  const [createCategoryByCsv] = useCreateCategoryByCsvMutation()
  const { data: categories, isFetching } = useGetAllCategoriesQuery(
    searchValue,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const roleAndPermission = R.pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const categoryPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "category");
    setCategoryPermission(categoryPermission)
  }, [currentUser])

  useEffect(() => {
    if (!categories?.result) return;
    const categoriesResult = R.pathOr([], ['result'], categories);
    setFilteredCategory(categoriesResult);
  }, [categories, isFetching]);

  const onSelect = async (e: any, item: any) => {
    const performAction =
      R.ifElse(R.equals(Datakey.EDIT_CATEGORY), () => actions.modal.openCategoryDrawer(e),
        R.ifElse(R.equals(Datakey.DELETE_CATEGORY), () => actions.modal.openDeleteCategory(e?.id),
          () => { }
        )
      );
    performAction(item);
  };

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])

  const handleSearch = () => {
    setSearchValue(searchQuery)
    setPage(1);
  }

  const handleClearSearch = () => {
    setPage(1);
    setSearchQuery("");
    setSearchValue("");
  };

  const [screenRow, setscreenRow] = useState<number>();

  const showPagerow = (rows: number) => {
    setscreenRow(rows)
  }

  useEffect(() => {
    if (csvData && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvData(false);
      });
    }
  }, [csvData]);

  const handleDownloadRejectedCsv = (RejectedData: any) => {
    const filename = `category.csv`;
    const headers = Categoryheader
    const data = CategoryCsvData(RejectedData);
    const obj = { data, filename, headers }
    setCsvData(obj);
  }

  const handleCsvChange = async (e: any) => {
    const file = e.target.files[0]
    if (file?.type === "text/csv") {
      const formData = new FormData()
      formData.append("file", file)

      setIsImport(true)
      const res: apiDataInterface = await createCategoryByCsv(formData)

      if (res?.data?.statusCode === 201) {
        csvRef.current.value = null;
        setIsImport(false)
        setCsvOpen(false)
        res?.data?.result?.rejectCategory?.length > 0 &&
          actions.modal.openRejectCsvTableModal({ type: "category", data: res?.data?.result?.rejectCategory });
      } else if (res?.error?.data?.statusCode === 500 || res?.error?.data?.statusCode === 400) {
        csvRef.current.value = null;
        setIsImport(false)
        setCsvOpen(false)
        toast.error(res?.error?.data?.message);
      }
    } else {
      toast.error(Msg.ONLY_CSV);
    }
  }

  const downloadFile = () => {
    const filePath = categoryCsv;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'category.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvOpen(false)
  };

  return (
    <>
      <div className="category_wrapper">
        <div className="category_header">
          <HeaderTextLayout
            title={Msg.CATEGORY_LIST_HEADER}
            data={
              filteredCategory && filteredCategory.length > 0
                ? `${screenRow} ${Msg.TOTAL_CATEGORIES_FOUND} (${filteredCategory.length > 0 && filteredCategory.length < 10 ? "0".concat(filteredCategory.length) : filteredCategory.length} ${Msg.FOUND}) `
                : ""}
            dataLength={Array.isArray(filteredCategory) ? filteredCategory.length : "0"}>
            <Form className="Form_category">
              <div className="mr-2 search_conatiner search_conatiner_div">
                <div>
                  <IconInputField
                    imgsrc={
                      <div className="search_div">
                        {searchQuery !== "" && (
                          <CloseIcon className="close_search" onClick={handleClearSearch} />
                        )}
                      </div>}
                    inputtype="text"
                    inputvalue={searchQuery}
                    inputonchange={(e: any) => {
                      if (e === "") {
                        setSearchQuery("");
                        setSearchValue("")
                        setPage(1);
                      }
                      setSearchQuery(e);
                    }}
                    inputplaceholder={Msg.SEARCH}
                    iconInputField_wrapper="search_field_wrapper"
                    height="45px" />
                </div>

                <div className="search_div">
                  <button
                    className="search_buttons"
                    onClick={handleSearch}>
                    <SearchIcon className="search_icon" />
                  </button>
                </div>
              </div>

              {categoryPermission?.isAdd && <ButtonComp
                className="orange_common_btn"
                title={Msg.IMPORT}
                size="large"
                btnonclick={() => setCsvOpen(true)}
                btnIcon={<InputIcon style={{ width: "20px" }} />} />}
              {categoryPermission?.isAdd && <ButtonComp
                className="orange_common_btn"
                title={Msg.ADD_CATEGORY_LABEL}
                size="large"
                btnIcon={<AddCircleOutlineIcon />}
                btnonclick={() => actions.modal.openCategoryDrawer(null)} />}
            </Form>
          </HeaderTextLayout>
        </div>
        <div className="category_content">
          <TableInfo
            height={categoryTableHeight(width)}
            showPagerow={showPagerow}
            rowHeight={50}
            tableData={filteredCategory}
            column={CategoryColumns(onSelect, categoryPermission)}
            page={page}
            setPage={setPage}
            Loader={isFetching} />
        </div>
      </div>
      <CategoryDrawer />
      <CsvImportModal
        csvRef={csvRef}
        open={csvOpen}
        handleCsvChange={handleCsvChange}
        isImport={isImport}
        handleCancelCsv={() => setCsvOpen(false)}
        downloadFile={downloadFile}
        Icon={CategoryIcon}
        title={Msg.IMPORT_CATEGORY}
        downloadTxt={Msg.Download_CATEGORY_SAMPLE_TEMPLATE} />
      <DeleteCategoryDialog />
      <RejectCsvTable onClick={handleDownloadRejectedCsv} />
      {csvData ? (
        <CSVLink
          data={csvData.data}
          headers={csvData.headers}
          filename={csvData.filename}
          ref={csvInstance} />
      ) : undefined}
    </>
  );
}

export default Category;
