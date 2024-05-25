import React from 'react';
import { Form } from "rsuite";
import { ErrorMessage } from "../../shared/form";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { objectInterface } from '../../../util/interface';

const Select = (props: objectInterface) => {
  const {
    title,
    Select_onchange,
    errmessage,
    placeholder,
    options,
    selectedValue,
    err,
    disabled,
    customHeight,
    customWidth,
    disableClearable,
    borderRadius,
    getOptionLabel,
    renderOption,
    multiple,
    isLoading,
    freeSolo
  } = props;

  const formControlLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "black",
    display: "block"
  }

  const circularProgressStyle: React.CSSProperties = {
    position: 'absolute',
    top: '55%',
    right: 8,
    transform: 'translateY(-50%)',
  }

  return (
    <>
      {
        title && <Form.ControlLabel style={formControlLabelStyle}>
          {title}
        </Form.ControlLabel>
      }
      <Autocomplete
        freeSolo={freeSolo}
        multiple={multiple}
        id="combo-box-demo"
        options={options}
        value={selectedValue}
        sx={{ width: customWidth || "100%" }}
        onChange={Select_onchange}
        disabled={disabled}
        disableClearable={disableClearable}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        renderInput={(params) => (
          <div style={{ position: 'relative' }}>
            <TextField
              {...params}
              placeholder={placeholder}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: customHeight || "46px",
                  padding: "0px",
                },
                "& .MuiAutocomplete-inputRoot": {
                  paddingLeft: "8px !important",
                  borderRadius: borderRadius || "50px",
                },
              }} />
            {isLoading && (
              <div style={circularProgressStyle}>
                <CircularProgress size={17} />
              </div>)}
          </div>)} />
      {/* TODO: Make below code in one liner */}
      {errmessage ? <ErrorMessage error={errmessage} /> : err && <ErrorMessage error={err?.product} />}

    </>
  );
}

export default Select;
