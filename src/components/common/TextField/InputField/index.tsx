import React from "react";
import { Form, InputGroup } from "rsuite";
import { ErrorMessage } from "../../../shared/form";
import { objectInterface } from "../../../../util/interface";

const InputField = (props: objectInterface) => {
  const {
    Input_Form_Group,
    inputlabel,
    inputname,
    inputonchange,
    onblur,
    inputvalue,
    inputplaceholder,
    errmessage,
    maxchar,
    onkeypress,
    inputwidth,
    height,
    marginLeftSide,
    disabled,
    icon,
    endIcon,
    onClickStartIcon,
    onClickEndIcon,
    type,
    width,
    borderRadius,
    outline,
    borderColor
  } = props;

  const formControlLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "black",
    userSelect: "none"
  };

  const inputGroupStyle: React.CSSProperties = {
    borderRight: "0px",
    borderRadius: "30px 0px 0px 30px",
    height: height,
    cursor: endIcon && "pointer",
  };

  const iconFormControlStyle: React.CSSProperties = {
    marginBottom: "-4px",
    borderRadius: endIcon ? "0px" : "0px 30px 30px 0px",
    paddingLeft: endIcon ? "0.5rem " : "1rem",
    paddingRight: endIcon && "0.5rem",
    height: height,
    textAlign: endIcon && "center"
  };

  const formControlStyle: React.CSSProperties = {
    width: width,
    marginBottom: "-4px",
    borderRadius: borderRadius || "30px",
    paddingLeft: "1rem",
    height: height,
    cursor: "text",
    outline: outline && "none",
    borderColor: borderColor && "#ced4da",
  };

  return (
    <>
      <Form.Group
        className={Input_Form_Group}
        style={{ width: inputwidth, marginLeft: marginLeftSide }}>
        <Form.ControlLabel style={formControlLabelStyle}>
          {inputlabel}
        </Form.ControlLabel>
        {
          icon ? (
            <div className="d-flex " style={{ width: endIcon && "10rem" }}>
              <InputGroup.Addon
                onClick={onClickStartIcon}
                style={inputGroupStyle}>
                {icon}
              </InputGroup.Addon>
              <Form.Control
                style={iconFormControlStyle}
                size="lg"
                type={type || "text"}
                name={inputname}
                id={inputname}
                value={inputvalue}
                onChange={inputonchange}
                onBlur={onblur}
                placeholder={inputplaceholder}
                maxLength={maxchar}
                onKeyPress={onkeypress}
                autoComplete="off"
                disabled={disabled} />
              {endIcon &&
                <InputGroup.Addon
                  onClick={onClickEndIcon}
                  style={{
                    borderRadius: "0px 30px 30px 0px",
                    height: height,
                    cursor: endIcon && "pointer"
                  }}>
                  {endIcon}
                </InputGroup.Addon>}
            </div>
          ) : (
            <Form.Control
              style={formControlStyle}
              size="lg"
              type="text"
              name={inputname}
              id={inputname}
              value={inputvalue}
              onChange={inputonchange}
              onBlur={onblur}
              placeholder={inputplaceholder}
              maxLength={maxchar}
              onKeyPress={onkeypress}
              autoComplete="off"
              disabled={disabled} />
          )
        }
        {errmessage && <ErrorMessage error={errmessage} />}
      </Form.Group>
    </>
  );
}

export default InputField;
