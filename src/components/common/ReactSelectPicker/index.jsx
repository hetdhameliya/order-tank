/* eslint-disable react/prop-types */
import React from "react";
import ReactSelect from "react-select";
import { ReactSelectStyle } from "./ReactSelectStyle";

export function ReactSelectPicker(props) {
  const {
    options,
    onChange,
    value,
    defaultValue,
    title,
    isClearable,
    placeholder,
    disabled,
    isMulti,
    bgColor,
    hideSelectedOptions,
    components,
    SearchWithBtn,
    height,
    width,
    closeMenuOnSelect,
  } = props;
  return (
    <>
      <label style={{ margin: "0px" }}>
        <b>{title}</b>
      </label>
      <ReactSelect
        options={options}
        onChange={onChange}
        isClearable={isClearable}
        hideSelectedOptions={hideSelectedOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        components={components}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        isDisabled={disabled}
        isMulti={isMulti}
        styles={ReactSelectStyle(bgColor, isMulti, SearchWithBtn, height, width)} />
    </>
  );
}


