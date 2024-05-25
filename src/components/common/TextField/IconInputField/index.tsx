import React from "react";
import { Form, InputGroup } from "rsuite";
import { ErrorMessage } from "../../../shared/form";
import { objectInterface } from "../../../../util/interface";

const IconInputField = (props: objectInterface) =>{
  const {
    inputlabel,
    imgonclick,
    imgsrc,
    inputtype,
    inputonchange,
    onblur,
    inputvalue,
    inputplaceholder,
    errmessage,
    iconInputField_wrapper,
    inputField_icon_class,
    height,
    onKeyDown,
    width,
    maxchar
  } = props;

  const inputStyle: React.CSSProperties = {
    fontSize: "16px",
    height: height,
    width: width,
    paddingRight: "0",
    marginLeft: "0px",
    outline: "none"
  };

  return (
    <>
      <Form.Group>
        <Form.ControlLabel style={{ fontWeight: "bold", color: "black" }}>
          {inputlabel}
        </Form.ControlLabel>
        <InputGroup inside className={iconInputField_wrapper}>
          <Form.Control
            onKeyDown={onKeyDown}
            name="password"
            id="password"
            type={inputtype}
            onChange={inputonchange}
            onBlur={onblur}
            value={inputvalue}
            placeholder={inputplaceholder}
            autoComplete="off"
            style={inputStyle}
            maxLength={maxchar} />
          <InputGroup.Addon style={{ background: "#fff", height: height }}>
            <div onClick={imgonclick} className={inputField_icon_class} style={{ userSelect: "none" }}>
              {imgsrc}
            </div>
          </InputGroup.Addon>
        </InputGroup>
        {errmessage && <ErrorMessage error={errmessage} />}
      </Form.Group>
    </>
  );
}

export default IconInputField;
