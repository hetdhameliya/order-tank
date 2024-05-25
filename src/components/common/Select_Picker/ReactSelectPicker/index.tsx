import React from "react";
import ReactSelect from "react-select";
import { ReactSelectStyle } from "./ReactSelectStyle";
import { ErrorMessage } from "../../../shared/form";
import { objectInterface } from "../../../../util/interface";

export function ReactSelectPicker(props: objectInterface) {
  const {
    options,
    onchange,
    value,
    defaultValue,
    title,
    isClearable,
    placeholder,
    err,
    width
  } = props;
  return (
    <>
      <label>
        <b>{title}</b>
      </label>
      <ReactSelect
        options={options}
        onChange={onchange}
        isClearable={isClearable}
        defaultValue={defaultValue}
        components={{
          IndicatorSeparator: () => null,
        }}
        placeholder={placeholder}
        value={value}
        styles={ReactSelectStyle(width)}/>
      {err && <ErrorMessage error={err?.product || err} />}
    </>
  );
}
