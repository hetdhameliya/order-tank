import React from "react";
import { Button } from "@mui/material";
import { objectInterface } from "../../../util/interface";

const ButtonComp = (props: objectInterface) => {
  const {
    size,
    className,
    type,
    title,
    btnonclick,
    btnstyle,
    btnIcon,
    isDisabled,
    variant,
    endIcon
  } = props;

  const buttonTextStyle: React.CSSProperties = {
    marginLeft: btnIcon ? "10px" : "0px",
    fontWeight: "bold",
    fontSize: "16px",
    textTransform: "capitalize"
  };
  return (
    <>
      <Button
        endIcon={endIcon}
        type={type}
        size={size}
        className={className}
        onClick={btnonclick}
        style={btnstyle}
        disabled={isDisabled}
        variant={variant}>
        {btnIcon && btnIcon}
        <p style={buttonTextStyle}>{title}</p>
      </Button>
    </>
  );
}

export default ButtonComp;
