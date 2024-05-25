/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import HeaderTextLayout from "../../components/shared/HeaderTextLayout";
import { Msg } from "../../util/massages";
import { Dropdown, Form } from "rsuite";
import IconInputField from "../../components/common/TextField/IconInputField";
import ButtonComp from "../../components/common/Button";
import TableInfo from "../../components/Table";
import "./style.scss";
import CloseIcon from "@rsuite/icons/Close";
import SearchIcon from "@rsuite/icons/Search";
import { ProductColumns } from "../../constants/columns";
import { useCreateProductsByCsvMutation, useGetAllProductQuery } from "../../api/product";
import { useGetAllCategoriesQuery } from "../../api/category";
import { actions } from "../../redux/store/store";
import ProductDetailDialog from "../../components/shared/customModal/ProductDetail";
import ProductDrawer from "../../components/shared/CustomDrawer/ProductDrawer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteProduct from "../../components/shared/customModal/DeleteModal/DeleteProduct";
import { toast } from "react-toastify";
import Select from "../../components/common/Select_Picker";
import AvailableModal from "../../components/shared/customModal/AvailableModal";
import CsvImportModal from "../../components/shared/customModal/CsvImportModal";
import InputIcon from '@mui/icons-material/Input';
import { ProductCsv } from "../../assets/Esvgs";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ImageShowModal from "../../components/shared/customModal/ImageShow";
import RejectCsvTable from "../../components/shared/customModal/RejectCsvTable";
import { ProductCsvData, ProductHeader } from "../../constants/csv/csvProductData";
import { CSVLink } from "react-csv";
import useWindowDimensions from "../../components/common/WindowDimensions";
import { productTableHeight } from "../../constants/extras/calculatTableHeight";
import { useSelector } from "react-redux";
import { apiDataInterface, permissionsInterface, reduxAuth } from "../../util/interface";
import * as R from 'rambda';

const Product = () => {

  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [productPermission, setProductPermission] = useState<permissionsInterface>();
  const csvRef = useRef<any>(null)
  const csvInstance = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  const [filteredProduct, setFilteredProduct] = useState<any>([]);
  const [selectedProductId, setSelectedProductId] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [isImport, setIsImport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [allCategory, setAllCategory] = useState([])
  const [csvOpen, setCsvOpen] = useState(false)
  const [csvData, setCsvData] = useState<any>("");
  const { width } = useWindowDimensions();

  const [createProductByCsv] = useCreateProductsByCsvMutation()
  const { data: categories, isFetching: CategotyFetch } =
    useGetAllCategoriesQuery(null, {
      refetchOnMountOrArgChange: true,
    });
  const { data: Allproduct, isFetching } = useGetAllProductQuery({
    search: searchValue,
    categoryId: [selectedCategory?.id]
  }, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const roleAndPermission = R.pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const productPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "product");
    setProductPermission(productPermission)
  }, [currentUser])

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])

  useEffect(() => {
    if (!Allproduct?.result && !categories?.result) return;
    const products = Allproduct?.result?.map((product: any) => {
      const matchingObj2 = categories?.result?.find(
        (category: any) => product.categoryId === category._id
      );
      return matchingObj2
        ? { ...product, categoryname: matchingObj2.name }
        : product;
    });
    setFilteredProduct(products);
  }, [categories, Allproduct, isFetching]);

  const onSelect = async (e: any, item: any) => {
    const performAction =
      R.ifElse(R.equals(Msg.EDIT), () => actions.modal.openProductDrawer(item),
        R.ifElse(R.equals(Msg.DELETE), () => actions.modal.openDeleteProduct(item?.id),
          R.ifElse(R.equals(Msg.VIEW), () => actions.modal.openProductDetail(item),
            () => { }
          )
        )
      );
    performAction(e);
  };

  const handleSelectedProductDelete = async () => {
    const dataObj = {
      deleteIds: selectedProductId,
      type: Msg.DELETE_ALL_PRODUCT,
      productCounts: selectedProductId?.length,
    };
    actions.modal.openDeleteProduct(dataObj);
  };

  const handleSearch = () => {
    setSearchValue(searchQuery)
    setPage(1);
  }

  const handleClearSearch = () => {
    setPage(1);
    setSearchQuery("");
    setSearchValue("");
  };

  const [screenRow, setscreenRow] = useState();

  const showPagerow = (rows: any) => {
    setscreenRow(rows)
  }

  useEffect(() => {
    if (!categories?.result) return;
    const categoryOptions: any = categories?.result?.map((item: any) => {
      return { label: item?.categoryName, value: item?.categoryName, id: item?.id };
    });
    setAllCategory(categoryOptions);
  }, [categories, CategotyFetch]);

  useEffect(() => {
    if (csvData && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvData("");
      });
    }
  }, [csvData]);

  const handleDownloadRejectedCsv = (RejectedData: any) => {
    const filename = `product.csv`;
    const headers = ProductHeader
    const data = ProductCsvData(RejectedData);
    const obj = { data, filename, headers }
    setCsvData(obj);
  }

  const handleCsvChange = async (e: any) => {
    const file = e.target.files[0]
    if (file?.type === "text/csv") {
      const formData = new FormData()
      formData.append("file", file)

      setIsImport(true)
      const res: apiDataInterface = await createProductByCsv(formData)

      if (res?.data?.statusCode === 201) {
        csvRef.current.value = null;
        setIsImport(false)
        setCsvOpen(false)
        res?.data?.result?.rejectProduct?.length > 0 &&
          actions.modal.openRejectCsvTableModal({ type: "product", data: res?.data?.result?.rejectProduct });
      } else if (res?.error?.data?.statusCode === 500 || res?.error?.data?.statusCode === 400) {
        csvRef.current.value = null;
        setIsImport(false)
        toast.error(res?.error?.data?.message);
        setCsvOpen(false)
      }
    } else {
      toast.error(Msg.ONLY_CSV);
    }
  }

  const handleAvailableProduct = async (msg: any, isAvailable: boolean) => {
    const dataObj = {
      ids: selectedProductId,
      message: msg,
      isPublished: isAvailable
    };
    actions.modal.openAvailable(dataObj);
  };

  const handleActionSelect = (val: string) => {
    if (val === "delete") {
      handleSelectedProductDelete()
    } else if (val === "not available") {
      handleAvailableProduct("Not Available?", false)
    } else if (val === "available") {
      handleAvailableProduct("Available?", true)
    }
  }

  const downloadFile = () => {
    const filePath = ProductCsv;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'product.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvOpen(false)
  };
  return (
    <>
      <div className="product_wrapper">
        <div className="product_header">
          <HeaderTextLayout
            title={Msg.PRODUCT_LIST_HEADER}
            data={
              filteredProduct && filteredProduct.length > 0
                ? `${screenRow} ${Msg.TOTAL_PRODUCTS_FOUND} (${filteredProduct.length > 0 && filteredProduct.length < 10 ? "0".concat(filteredProduct.length) : filteredProduct.length} ${Msg.FOUND})`
                : ""}
            dataLength={Array.isArray(filteredProduct) ? filteredProduct.length : "0"}>
            <Form className="product_header_form">
              {selectedProductId.length !== 0 && (productPermission?.isDelete || productPermission?.isUpdate) && (
                <div>
                  <Dropdown title="Action" size="lg" onSelect={(val: any) => handleActionSelect(val)} >
                    {productPermission?.isDelete && <Dropdown.Item eventKey="delete" >{Msg.DELETE} ({selectedProductId?.length})</Dropdown.Item>}
                    {productPermission?.isUpdate &&
                      <>
                        <Dropdown.Item eventKey="not available">{Msg.MARK_AS_NOT_AVAILABLE} ({selectedProductId?.length})</Dropdown.Item>
                        <Dropdown.Item eventKey="available">{Msg.MARK_AS_AVAILABLE} ({selectedProductId?.length})</Dropdown.Item>
                      </>
                    }
                  </Dropdown>
                </div>
              )}
              <div className="mr-2 search_conatiner search_conatiner_product_div">
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
                        setPage(1)
                        setSearchQuery("");
                        setSearchValue("")
                      }
                      setSearchQuery(e);
                    }}
                    inputplaceholder={Msg.SEARCH}
                    iconInputField_wrapper="Product_search_wrapper"
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
              <div>
                <Select
                  options={allCategory}
                  Select_onchange={(e: any, values: any) => {
                    setSelectedCategory(values);
                    setPage(1)
                  }}
                  selectedValue={selectedCategory}
                  placeholder={Msg.SELECT_CATEGORY_LABEL}
                  customHeight="45px"
                  customWidth="200px" />
              </div>

              {productPermission?.isAdd &&
                <ButtonComp
                  className="orange_common_btn"
                  title={Msg.IMPORT}
                  size="large"
                  btnonclick={() => setCsvOpen(true)}
                  btnIcon={<InputIcon style={{ width: "20px" }} />} />}

              {productPermission?.isAdd &&
                <div style={{ display: "flex" }}>
                  <ButtonComp
                    className="orange_common_btn"
                    title={Msg.CREATE_NEW_PRODUCT}
                    size="large"
                    btnIcon={<AddCircleOutlineIcon />}
                    btnonclick={() => actions.modal.openProductDrawer(null)} />
                </div>}
            </Form>
          </HeaderTextLayout>
        </div>
        <div className="product_content">
          <TableInfo
            showPagerow={showPagerow}
            height={productTableHeight(width)}
            tableData={filteredProduct}
            column={ProductColumns(onSelect, productPermission)}
            checkedKeys={selectedProductId}
            setCheckedKeys={setSelectedProductId}
            page={page}
            setPage={setPage}
            rowHeight={80}
            Loader={isFetching} />
        </div>
      </div>
      <DeleteProduct setSelectedProductId={setSelectedProductId} />
      <AvailableModal setSelectedProductId={setSelectedProductId} />
      <ProductDetailDialog />
      <ProductDrawer />
      <CsvImportModal
        csvRef={csvRef}
        open={csvOpen}
        handleCsvChange={handleCsvChange}
        isImport={isImport}
        handleCancelCsv={() => setCsvOpen(false)}
        downloadFile={downloadFile}
        Icon={AddShoppingCartIcon}
        title={Msg.IMPORT_PRODUCT}
        downloadTxt={Msg.Download_PRODUCT_SAMPLE_TEMPLATE} />
      <ImageShowModal />
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

export default Product;
