import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BackspaceIcon from "@mui/icons-material/Backspace";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { addDays } from "date-fns";
import moment from "moment";
import "./style.scss";
import { useOutsideAlerter } from "../../../util/helpers";
import { Msg } from "../../../util/massages";
import { DateRangePicker } from "react-date-range";
import { Colors } from "../../../redux/constants/Colors";
import { objectInterface } from "../../../util/interface";
import * as R from 'rambda';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const ReactDateRangePicker = (props: objectInterface) => {
  const {
    wrapperRef,
    state,
    setState,
    prevDate,
    setPrevDate,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    showDateRangePicker,
    setShowDateRangePicker,
    showPlaceholder,
    Placeholder,
    setPage,
    width,
    fontSize
  } = props;
  useOutsideAlerter(wrapperRef, setShowDateRangePicker);
  const handleCustomRange = () => {
    setShowDateRangePicker(!showDateRangePicker);
    if (!fromDate.length) {
      setState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    } else {
      setState(prevDate);
    }
  };

  const handleTimeRangeSelection = async (clear: string | objectInterface) => {
    // const firstSelectionOfStartDate = moment(state[0].startDate).format(
    //   "yyyy-MM-DD"
    // );
    // const firstSelectionOfToDate = moment(state[0].endDate).format(
    //   "yyyy-MM-DD"
    // );
    const formatDate = (date: Date) => moment(date).format("yyyy-MM-DD");
    const firstSelectionOfStartDate = R.pipe(
      R.pathOr('', ['0', 'startDate']),
      dateString => new Date(dateString),
      formatDate
    )(state);

    const firstSelectionOfToDate = R.pipe(
      R.pathOr('', ['0', 'endDate']),
      dateString => new Date(dateString),
      formatDate
    )(state);
    // TODO: remove && use if condition
    if (clear !== Msg.CLEAR) {
      setFromDate(firstSelectionOfStartDate);
      setToDate(firstSelectionOfToDate);
    }

    setPrevDate(state);
    setShowDateRangePicker(false);
    setPage && setPage(1)
  };

  const handleClearButtonClick = () => {
    setFromDate("");
    setToDate("");
    setShowDateRangePicker(false);
    setState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 0),
        key: "selection",
      },
    ]);
    handleTimeRangeSelection(Msg.CLEAR);
  };

  return (
    <>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <div onClick={handleCustomRange} className="form__input" style={{ width: width ? width : "", fontSize: fontSize ? fontSize : "", display: "flex", alignItems: "center", justifyContent: "space-between" }} >

          <div>
            {showPlaceholder && <div style={{ position: 'relative' }}>
              <span className="label-date-picker">{Placeholder}</span>
            </div>}
            <span>
              {`${fromDate.length
                ? `${moment(fromDate).format("MM-DD-yyyy")} TO ${moment(
                  toDate
                ).format("MM-DD-yyyy")}`
                : Msg.SELECT_CUSTOM_RANGE
                }`}
            </span>
            <span className="pl-2">
              {showDateRangePicker ? (
                <KeyboardArrowUpIcon className="filter__search-icon" style={{ fontSize: fontSize ? "20px" : "" }} />
              ) : (
                <KeyboardArrowDownIcon className="filter__search-icon" style={{ fontSize: fontSize ? "20px" : "" }} />
              )}
            </span>
          </div>
          {fontSize &&
            (!toDate && !fromDate) && <div>
              <CalendarMonthOutlinedIcon style={{ fontSize: "20px" }} />
            </div>
          }
        </div>
        {showDateRangePicker && (
          <div className="mainDateRangePicker">
            <DateRangePicker
              onChange={(item: objectInterface) => {
                setState([item.selection]);
              }}
              showDateDisplay={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={state}
              direction="horizontal"
              rangeColors={[Colors.dark.orange]} />
            <div className="button-container">
              <button
                onClick={handleClearButtonClick}
                className="okButton clearButton">
                <span>
                  <BackspaceIcon /> &nbsp;
                  <strong>{Msg.CLEAR}</strong>
                </span>
              </button>
              <button
                onClick={() => {
                  setShowDateRangePicker(false);
                }}
                className="cancelButton">
                <span>
                  <CancelIcon sx={{ width: "1.5rem", height: "1.5rem" }} />{" "}
                  <strong>{Msg.CANCEL}</strong>
                </span>
              </button>
              <button onClick={handleTimeRangeSelection} className="okButton">
                <span>
                  <ThumbUpAltIcon /> &nbsp;
                  <strong>{Msg.DONE}</strong>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReactDateRangePicker;
