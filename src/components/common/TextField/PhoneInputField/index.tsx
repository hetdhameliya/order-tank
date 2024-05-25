import React from 'react'
import PhoneInput from 'react-phone-input-2'
import { Form } from 'rsuite'
import { ErrorMessage } from "../../../shared/form";
import "./style.scss"
import { objectInterface } from '../../../../util/interface';

const PhoneInputField = (props: objectInterface) => {
  const {
    onblur,
    errmessage,
    onchange,
    value,
    label,
    name,
    height,
    width
  } = props;
  return (
    <>
      <div className="phone_number" style={{ width: width }}>
        <Form.ControlLabel style={{ fontWeight: "bold", color: "black" }}>
          {label}
        </Form.ControlLabel>
        <PhoneInput
          inputProps={{
            name: name,
            autoComplete: "off"
          }}
          countryCodeEditable={false}
          country="in"
          value={value}
          onChange={onchange}
          inputClass="phone-input"
          inputStyle={{
            height: height,
            width: "100%"
          }}
          disableDropdown={true}
          onBlur={onblur} />
        {
          errmessage && <ErrorMessage error={errmessage} />
        }
      </div>
    </>
  )
}

export default PhoneInputField
