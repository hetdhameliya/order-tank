import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@mui/material'
import "./style.scss";
import TableInfo from '../../../components/Table';
import { AddressColumns } from '../../../constants/columns';
import HeaderTextLayout from '../../../components/shared/HeaderTextLayout';
import { Msg } from '../../../util/massages';
import { actions } from '../../../redux/store/store';
import { Form } from 'rsuite';
import ButtonComp from '../../../components/common/Button';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddressDrawer from '../../../components/shared/CustomDrawer/AddressDrawer';
import IconInputField from '../../../components/common/TextField/IconInputField';
import CloseIcon from "@rsuite/icons/Close";
import SearchIcon from "@rsuite/icons/Search";
import { useGetAddressQuery } from '../../../api/company';
import DeleteAddress from '../../../components/shared/customModal/DeleteModal/DeleteAddress';
import { useSelector } from 'react-redux';
import useWindowDimensions from '../../../components/common/WindowDimensions';
import { profileAddressTableHeight } from '../../../constants/extras/calculatTableHeight';
import { objectInterface, permissionsInterface, reduxAuth, refetchInterface } from '../../../util/interface';
import * as R from 'rambda';

const Address = ({ refetch }: refetchInterface) => {
  const currentUser = useSelector((state: reduxAuth) => state.auth.currentUser);
  const [addressPermission, setAddressPermission] = useState<permissionsInterface>();
  const [page, setPage] = useState<number>(1);
  const [screenRow, setscreenRow] = useState<number>();
  const [filteredAddress, setFilterAddress] = useState<objectInterface>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("")
  const { width } = useWindowDimensions();
  const { data: getAddress, isFetching } = useGetAddressQuery({ search: searchValue, id: currentUser?.company?.id }, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    const roleAndPermission = currentUser?.roleAndPermission?.permissions;
    const addressPermission = roleAndPermission?.find((ele: permissionsInterface) => ele.screenName === "address");
    setAddressPermission(addressPermission)
  }, [currentUser])

  useEffect(() => {
    actions.auth.setLoading(false);
  }, [])

  useEffect(() => {
    if (!getAddress?.result) return;
    setFilterAddress(getAddress?.result);
  }, [getAddress, isFetching])

  const showPagerow = (rows: number) => {
    setscreenRow(rows)
  }

  const handleSearch = () => {
    setPage(1);
    setSearchValue(searchQuery)
  }

  const handleClearSearch = () => {
    setPage(1);
    setSearchQuery("");
    setSearchValue("");
  };

  const onSelect = (e: string, item: objectInterface) => {
    const performAction =
      R.ifElse(R.equals(Msg.EDIT), () => actions.modal.openAddressDrawer(item),
        R.ifElse(R.equals(Msg.DELETE), () => actions.modal.openDeleteAddress({ id: item?.id }),
          () => { }
        )
      );
    performAction(e);
  };

  return (
    <>
      <div className="addressInfo_container">
        <Card elevation={5}>
          <CardContent>
            <HeaderTextLayout
              title={Msg.ADDRESS_LABEL}
              data={
                filteredAddress && filteredAddress.length > 0
                  ? `${screenRow} ${Msg.TOTAL_ADDRESS_FOUND} (${filteredAddress.length > 0 && filteredAddress.length < 10 ? "0".concat(filteredAddress.length) : filteredAddress.length} ${Msg.FOUND}) `
                  : ""}
              dataLength={
                Array.isArray(filteredAddress) ? filteredAddress.length : "0"}>

              <Form className='addressInfo_container_form' >
                <div className="mr-2 search_conatiner search_conatiner_profile">
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

                {addressPermission?.isAdd && <ButtonComp
                  className="orange_common_btn"
                  title={Msg.ADD_ADDRESS}
                  size="large"
                  btnIcon={<AddCircleOutlineIcon />}
                  btnonclick={() => actions.modal.openAddressDrawer(null)} />}
              </Form>

            </HeaderTextLayout>
            <div className="address_table">
              <TableInfo
                height={profileAddressTableHeight(width)}
                showPagerow={showPagerow}
                rowHeight={50}
                tableData={filteredAddress}
                column={AddressColumns(onSelect, addressPermission)}
                page={page}
                setPage={setPage}
                Loader={isFetching} />
            </div>
          </CardContent>
        </Card>
      </div>
      <AddressDrawer refetch={refetch} />
      <DeleteAddress />
    </>
  )
}

export default Address
