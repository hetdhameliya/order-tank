/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./style.scss"
import { Item } from '../../util/helpers'
import Select from '../../components/common/Select_Picker'
import { DashboardFilterStatus } from '../../redux/constants/arrays'
import { useGetDashboardQuery, useGetOrderListQuery } from '../../api/dashboard'
import { actions } from '../../redux/store/store'
import TableInfo from '../../components/Table'
import { OrderedDashboardColumns } from '../../constants/columns'
import { Msg } from '../../util/massages'
import { DashboardDataArr } from '../../constants/arrays'
import useWindowDimensions from '../../components/common/WindowDimensions';
import { calculatTableHeight } from '../../constants/extras/calculatTableHeight'
import { objectInterface } from '../../util/interface'
import * as R from 'rambda';

interface DashboardFilter {
  label: string;
  value: string;
}

export default function Dashboard() {

  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState<DashboardFilter>({ label: "Today", value: "today" });
  const [orderFilterBy, setOrderFilterBy] = useState<string | null>();
  const { width } = useWindowDimensions();

  useEffect(() => { actions.auth.setLoading(false) }, [])

  const { data: dashboardData, isFetching: dashboardFetching } = useGetDashboardQuery(
    { filterBy: selectedDashboardFilter }, {
    refetchOnMountOrArgChange: true,
  });

  const { data: orderData, isFetching: orderFetching } = useGetOrderListQuery({ filterBy: orderFilterBy }, {
    refetchOnMountOrArgChange: true,
  })

  const [dashboardFilterData, setDashboardFilterData] = useState<any>();
  const [showSchedule, setShowSchedule] = useState(false)
  const [orderTableData, setOrderTableData] = useState<objectInterface[]>();
  const [page, setPage] = useState<number>(1);
  const dashboardDataArr = DashboardDataArr(dashboardFilterData)

  useEffect(() => {
    if (!dashboardData?.result) return;
    const dashboardResult = R.pathOr({}, ['result'], dashboardData);
    setDashboardFilterData(dashboardResult);
  }, [dashboardData]);

  useEffect(() => {
    if (!orderData?.result) {
      setOrderTableData([]);
    } else {
      const orderDataResult = R.pathOr([], ['result', 'data'], orderData);
      setOrderTableData(orderDataResult);
    }
  }, [orderData, orderFetching]);

  const handleCheckboxChange = (event: any) => {
    if (orderFilterBy === event.target.name) {
      setOrderFilterBy(null)
    }
    else {
      setOrderFilterBy(event.target.name);
    }
  }

  const handleCheckboxScheduleChange = (event: any) => {
    const isChecked = event.target.checked;
    setShowSchedule(isChecked);
    !isChecked ? setOrderFilterBy(null) : setOrderFilterBy("today")
  }

  return (
    <>
      <div className='main_dashboard'>
        <div className='main_heading'>
          <div className='main_title'>
            <span>{Msg.DASHBOARD_TITLE}</span>
          </div>

          <div className="select_div">
            <div>
              <span className="status_label">{Msg.SELECT_FILTER}</span>
            </div>

            <Select
              options={DashboardFilterStatus}
              Select_onchange={(e: any, values: any) => {
                setSelectedDashboardFilter(values);
              }}
              selectedValue={selectedDashboardFilter}
              placeholder={Msg.SELECT_FILTER}
              customHeight="42px"
              customWidth="180px"
              borderRadius={"10px"}
              isLoading={dashboardFetching}
              disableClearable={true}
              freeSolo={dashboardFetching ? true : false} />
          </div>
        </div>
        <Grid container rowSpacing={2} columnSpacing={4} style={{ marginTop: "0.5px" }}>
          {dashboardDataArr?.map((items) => {
            return (
              <>
                <Grid item xs={12} sm={6} lg={3} md={3}>
                  <Item className='item'>
                    <div className='items_div' >
                      <items.icon className='item_icon' />
                    </div>
                    <div className='containe_div'>
                      <span className='item_heading'>{items.title}</span>
                      <span className='item_info_span' >
                        {items.title === Msg.REVENUE_TITLE ?
                          (dashboardFetching && orderFetching ? ("₹ 00") : (<span>{items?.data?.toFixed(2) < 10
                            ? `₹ 0${items?.data?.toFixed(2)?.toLocaleString("en-IN")}`
                            : `₹${items?.data?.toFixed(2)?.toLocaleString("en-IN")}`}</span>)) :
                          (dashboardFetching && orderFetching ? ("00") :
                            (<span>{items?.data < 10 ? `0${items?.data}` : items?.data}</span>))}
                      </span>
                    </div>
                  </Item>
                </Grid>
              </>
            )
          })}
        </Grid>

        <div className='tables_div'>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className='table_heading'>
              <p className='heading_title'>{Msg.ORDER_TITLE}</p>
              <span className='heading_count'>
                {!orderFetching ? (orderTableData?.length !== undefined ? (orderTableData.length < 10 ? `(0${orderTableData.length} ${Msg.FOUND})` : `(${orderTableData.length} ${Msg.FOUND})`) : '') : ("")}
              </span>
            </div>
            <div>
              <FormGroup className='pending_dashbord_checkbox'>
                <div style={{ display: "flex", gap: "5px" }}>
                  <div className='checkbox_main'>
                    <FormControlLabel onChange={handleCheckboxScheduleChange} control={<Checkbox disableRipple name="schedule" />} label={showSchedule ? `${Msg.SCHEDULE} :- ` : Msg.SCHEDULE} />
                  </div>
                  {showSchedule && (<div style={{ display: "flex", gap: "7px" }}>
                    <FormControlLabel className='checkbox_conatiner'
                      checked={orderFilterBy === 'today'}
                      onChange={handleCheckboxChange}
                      labelPlacement="end"
                      style={{ fontSize: "10px" }}
                      label={Msg.TODAY}
                      control={<Checkbox disableRipple name="today" />} />
                    <FormControlLabel
                      checked={orderFilterBy === 'nextWeek'}
                      onChange={handleCheckboxChange}
                      className='checkbox_conatiner'
                      labelPlacement="end"
                      label={Msg.DAY_7s}
                      control={<Checkbox disableRipple name="nextWeek" />} />
                    <FormControlLabel
                      checked={orderFilterBy === 'nextMonth'}
                      onChange={handleCheckboxChange}
                      className='checkbox_conatiner'
                      labelPlacement="end"
                      label={Msg.DAY_30s}
                      control={<Checkbox disableRipple name="nextMonth" />} />
                  </div>)}
                </div>
              </FormGroup>
            </div>
          </div>
          <div style={{ marginTop: "0.3rem" }}>
            <TableInfo
              tableData={orderTableData}
              column={OrderedDashboardColumns()}
              page={page}
              setPage={setPage}
              height={calculatTableHeight(width)}
              Loader={!orderFetching ? false : true}
              notShownPagination={true}
              shortTypes={"ascCategory"} />
          </div>
        </div>
      </div>
    </>
  )
}
