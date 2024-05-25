/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Msg } from "../../util/massages";
import HeaderTextLayout from "../../components/shared/HeaderTextLayout";
import { Form } from "rsuite";
import IconInputField from "../../components/common/TextField/IconInputField";
import ButtonComp from "../../components/common/Button";
import CloseIcon from "@rsuite/icons/Close";
import SearchIcon from "@rsuite/icons/Search";
import "./style.scss";
import TableInfo from "../../components/Table";
import { BuyersColumns } from "../../constants/columns";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteBuyer from "../../components/shared/customModal/DeleteModal/DeleteBuyer";
import { actions } from "../../redux/store/store";
import { Badge } from "@mui/material";
import { Colors } from "../../redux/constants/Colors";
import BlockBuyer from "../../components/shared/customModal/BlockBuyer";
import Select from "../../components/common/Select_Picker";
import { BuyerStatus } from "../../redux/constants/arrays";
import { useSelector } from "react-redux";
import { useGetRelationsQuery } from "../../api/relations";
import ImageShowModal from "../../components/shared/customModal/ImageShow";
import useWindowDimensions from "../../components/common/WindowDimensions";
import { BuyerTableHeight } from "../../constants/extras/calculatTableHeight";
import { objectInterface, permissionsInterface, reduxAuth } from "../../util/interface";
import * as R from 'rambda';

const Buyers = () => {
  const navigate = useNavigate();
  const isLoading = useSelector((state: reduxAuth) => state.auth.isLoading);
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [buyerPermission, setBuyerPermission] = useState<permissionsInterface>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  const [filteredBuyer, setFilteredBuyer] = useState<any>([]);
  const [allReq, setAllReq] = useState<any>([]);
  const [status, setStatus] = useState<any>(null);
  const [screenRow, setscreenRow] = useState<number>();
  const { width } = useWindowDimensions();

  const { data: AllRequest, refetch } = useGetRelationsQuery({ isRequested: true }, {
    refetchOnMountOrArgChange: true,
  });
  const { data: AllBuyers, isFetching } = useGetRelationsQuery({
    search: searchValue, isAccepted: true, isActive: !status ? undefined : status?.value === "active"
  }, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    const roleAndPermission = R.pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const buyerPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "buyer");
    setBuyerPermission(buyerPermission)
  }, [currentUser])

  useEffect(() => {
    if (!AllRequest?.result) return;
    const allReq = R.pathOr([], ['result', 'data'], AllRequest);
    setAllReq(allReq);
  }, [AllRequest, isFetching]);

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (!AllBuyers?.result) return;
    const filteredBuyers = R.pathOr([], ['result', 'data'], AllBuyers);
    setFilteredBuyer(filteredBuyers)
  }, [AllBuyers, isFetching]);

  const onSelect = async (e: string, item: objectInterface) => {
    const performAction =
      R.ifElse(R.equals(Msg.VIEW), () => navigate("/buyersInfo", { state: item }),
        R.ifElse(R.equals(Msg.DELETE), () => actions.modal.openDeleteBuyer(item),
          R.ifElse(R.equals(Msg.EDIT), () => navigate("/buyersEdit", { state: item }),
            R.ifElse(R.either(R.equals(Msg.INACTIVE), R.equals(Msg.ACTIVE)), () => actions.modal.openBlockBuyer({ type: e, id: item?.id }),
              () => { }
            )
          )
        )
      );
    performAction(e);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchValue(searchQuery)
  }
  const handleClearSearch = () => {
    setPage(1);
    setSearchQuery("");
    setSearchValue("");
  };

  const showPagerow = (rows: number) => {
    setscreenRow(rows)
  }

  return (
    <>
      <div className="buyers_wrapper">
        <div className="buyers_header">
          <HeaderTextLayout
            title={Msg.BUYERS_LIST_HEADER}
            data={
              filteredBuyer && filteredBuyer.length > 0
                ? `${screenRow} ${Msg.TOTAL_BUYERS_FOUND} (${filteredBuyer.length > 0 && filteredBuyer.length < 10 ? "0".concat(filteredBuyer.length) : filteredBuyer.length} ${Msg.FOUND})`
                : ""}
            dataLength={
              Array.isArray(filteredBuyer) ? filteredBuyer.length : "0"}>
            <Form className="Form_style">
              <div className="mr-2 search_conatiner search_conatiner_div">
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
                      iconInputField_wrapper="Buyer_search_wrapper"
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
              </div>

              <Select
                options={BuyerStatus}
                Select_onchange={(e: any, values: any) => {
                  setStatus(values);
                  setPage(1)
                }}
                selectedValue={status}
                placeholder={Msg.BUYER_STATUS}
                customHeight="47px"
                customWidth="200px" />

              <Badge badgeContent={allReq?.length} sx={{
                "& .MuiBadge-badge": {
                  color: Colors.light.white,
                  backgroundColor: Colors.dark.orange
                },
              }}>
                <ButtonComp
                  className="white_common_btn"
                  title={Msg.BUYER_REQUEST}
                  size="large"
                  btnonclick={() => navigate("/buyersRequest")} />
              </Badge>
              {buyerPermission?.isAdd && <ButtonComp
                className="orange_common_btn"
                title={Msg.CREATE_NEW_BUYER}
                size="large"
                btnIcon={<AddCircleOutlineIcon />}
                btnonclick={() => navigate("/buyersAdd")} />}
            </Form>
          </HeaderTextLayout>
        </div>
        <div className="buyers_content">
          <TableInfo
            showPagerow={showPagerow}
            height={BuyerTableHeight(width)}
            tableData={filteredBuyer}
            column={BuyersColumns(onSelect, currentUser, buyerPermission)}
            page={page}
            setPage={setPage}
            rowHeight={80}
            Loader={isLoading ? false : !isFetching ? false : true} />
        </div>
      </div>
      <DeleteBuyer />
      <BlockBuyer />
      <ImageShowModal />
    </>
  );
}

export default Buyers;
