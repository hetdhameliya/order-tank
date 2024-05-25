/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { components } from "react-select";
import Checkbox from "@mui/material/Checkbox";
import "./style.scss";

export const Option = (props) => {
    const checkboxStyles = {
        color: props.isSelected ? "#003B6E" : undefined,
        background: "#FFFFFF",
        width: "18px",
        height: "18px",
        marginTop: "0.2rem",
        marginRight: "0.8rem"
    };
    return (
        <div className="option__wrapper__container">
            <components.Option {...props}>
                <div className="option_inner_wrapper" style={{ marginTop: "4px" }}>
                    <Checkbox
                        sx={checkboxStyles}
                        checked={props.isSelected}
                        onChange={() => null} />
                    <label style={{ height: "auto" }} className="menu__label__text">
                        {props.label}
                    </label>
                </div>
            </components.Option>
        </div>
    );
};


