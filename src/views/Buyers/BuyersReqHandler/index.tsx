import React, { useEffect, useState } from "react";
import TableInfo from "../../../components/Table";
import { CompanyReqColumns } from "../../../constants/columns";
import HeaderTextLayout from "../../../components/shared/HeaderTextLayout";
import IconInputField from "../../../components/common/TextField/IconInputField";
import { Form } from "rsuite";
import { Datakey, Msg } from "../../../util/massages";
import CloseIcon from "@rsuite/icons/Close";
import SearchIcon from "@rsuite/icons/Search";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { actions } from "../../../redux/store/store";
import BlockBuyer from "../../../components/shared/customModal/BlockBuyer";
import { useGetRelationsQuery } from "../../../api/relations";
import ImageShowModal from "../../../components/shared/customModal/ImageShow";
import useWindowDimensions from "../../../components/common/WindowDimensions";
import { BuyerRequestTableHeight } from "../../../constants/extras/calculatTableHeight";
import { useSelector } from "react-redux";
import { objectInterface, permissionsInterface, reduxAuth } from "../../../util/interface";
import { pathOr } from 'rambda';

const BuyersRequest = () => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [buyerPermission, setBuyerPermission] = useState<permissionsInterface>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allReq, setAllReq] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const { width } = useWindowDimensions();
  const { data: AllRequest, isFetching } = useGetRelationsQuery({ search: searchValue, isRequested: true },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const roleAndPermission = pathOr([], ['roleAndPermission', 'permissions'], currentUser);
    const buyerPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "buyer");
    setBuyerPermission(buyerPermission)
  }, [currentUser])

  useEffect(() => {
    if (!AllRequest?.result) return;
    const requestData = pathOr([], ['result', 'data'], AllRequest);
    setAllReq(requestData);
  }, [AllRequest, isFetching]);

  const onSelect = async (e: objectInterface, item: string) => {
    if (item === Datakey.ACCEPT) {
      actions.modal.openBlockBuyer({ type: item, id: e?.id });
    } else if (item === Datakey.REJECT) {
      actions.modal.openBlockBuyer({ type: item, id: e?.id });
    }
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

  const [screenRow, setscreenRow] = useState<number>();

  const showPagerow = (rows: number) => {
    setscreenRow(rows)
  }
  return (
    <>
      <div className="buyersReq_Wrapper">
        <div className="buyersReq_header">
          <HeaderTextLayout
            arrowBack={true}
            arrowBackClick={() => navigate("/buyers")}
            title={Msg.BUYER_REQ_HEADER}
            data={
              allReq && allReq.length > 0
                ? `${screenRow} ${Msg.TOTAL_BUYER_REQ_FOUND} (${allReq.length > 0 && allReq.length < 10 ? "0".concat(allReq.length) : allReq.length} ${Msg.FOUND})`
                : ""}
            dataLength={Array.isArray(allReq) ? allReq.length : "0"}>
            <Form className="form">
              <div className="mr-2 search_conatiner">
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    inputonchange={(e: any) => {
                      setPage(1);
                      if (e === "") {
                        setSearchQuery("");
                        setSearchValue("")
                      }
                      setSearchQuery(e);
                    }}
                    inputplaceholder={Msg.SEARCH}
                    iconInputField_wrapper="buyersReq_search_wrapper"
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
            </Form>
          </HeaderTextLayout>
        </div>
        <div className="reqHandler_table">
          <TableInfo
            showPagerow={showPagerow}
            height={BuyerRequestTableHeight(width)}
            tableData={allReq}
            column={CompanyReqColumns(onSelect, buyerPermission)}
            page={page}
            setPage={setPage}
            rowHeight={80}
            Loader={isFetching} />
        </div>
      </div>
      <BlockBuyer />
      <ImageShowModal />
    </>
  );
}

export default BuyersRequest;
